import { NextResponse, NextRequest } from 'next/server'
import dbConnect from '@/lib/mongodb'
import { Record } from '@/models/Record'
import { PAGE_SIZE_DEFAULT } from '@/lib/harvest-utils'
import type {
  HarvestRequest,
  HarvestResponse,
  SearchQueryParsed,
  Facets,
  FacetItem,
  ScoredRecord,
  Record as RecordType,
} from '@/lib/types'

function parseSearchQuery(q: string): SearchQueryParsed {
  const text = String(q).trim().toLowerCase()
  if (!text) return { phrases: [], tokens: [], raw: '' }

  const phrases: string[] = []
  const tokens: string[] = []
  const re = /"([^"]+)"|(\S+)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    if (m[1]) phrases.push(m[1].trim())
    else if (m[2]) tokens.push(m[2].trim())
  }
  return { phrases, tokens, raw: text }
}

function buildSearchHaystack(r: RecordType): string {
  return (
    `${r.title || ''} ${r.description || ''} ${(r.keywords || []).join(' ')} ` +
    `${(r.authors || []).join(' ')} ${r.identifier || ''}`
  ).toLowerCase()
}

function matchesQuery(haystack: string, parsed: SearchQueryParsed): boolean {
  const h = haystack.toLowerCase()
  for (const p of parsed.phrases) {
    if (!h.includes(p)) return false
  }
  for (const t of parsed.tokens) {
    if (!h.includes(t)) return false
  }
  return true
}

function scoreRecordForQuery(
  record: RecordType,
  parsed: SearchQueryParsed
): number {
  const title = (record.title || '').toLowerCase()
  const identifier = (record.identifier || '').toLowerCase()
  const hay = buildSearchHaystack(record)
  const q = parsed.raw

  let score = 0

  if (title === q) score += 60
  else if (title.includes(q)) score += 35

  if (identifier === q) score += 40
  else if (identifier.includes(q)) score += 20

  for (const p of parsed.phrases) {
    if (title.includes(p)) score += 12
    if (identifier.includes(p)) score += 8
    if (hay.includes(p)) score += 6
  }
  for (const t of parsed.tokens) {
    if (title.includes(t)) score += 5
    if (identifier.includes(t)) score += 4
    if (hay.includes(t)) score += 3
  }

  return score
}

function buildFacets(records: RecordType[]): Facets {
  const years = new Map<number, number>()
  const authors = new Map<string, number>()
  const repos = new Map<string, number>()
  const types = new Map<string, number>()

  for (const r of records || []) {
    if (r.year) years.set(r.year, (years.get(r.year) || 0) + 1)
    ;(r.authors || []).forEach(
      (a) => a && authors.set(a, (authors.get(a) || 0) + 1)
    )
    if (r.source) repos.set(r.source, (repos.get(r.source) || 0) + 1)
    if (r.type) types.set(r.type, (types.get(r.type) || 0) + 1)
  }

  const mapify = <T extends string | number>(m: Map<T, number>): FacetItem[] =>
    [...m.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }))

  return {
    years: mapify(years),
    authors: mapify(authors).slice(0, 100),
    repositories: mapify(repos),
    types: mapify(types),
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<HarvestResponse>> {
  try {
    await dbConnect()

    const body: HarvestRequest = await request.json().catch(() => ({}))
    const {
      category = 'all',
      query = '',
      page = 1,
      pageSize = PAGE_SIZE_DEFAULT,
      filters = {},
    } = body

    let dbQuery: any = {}

    if (category !== 'all') {
      if (category === 'theses') dbQuery.category = 'thesis'
      else if (category === 'articles') dbQuery.category = 'article'
      else if (category === 'research') dbQuery.category = 'research'
    }

    if (filters.year) {
      dbQuery.year = parseInt(String(filters.year))
    }
    if (filters.repository) {
      dbQuery.source = filters.repository
    }
    if (filters.type) {
      dbQuery.type = filters.type
    }
    if (filters.author) {
      dbQuery.authors = { $regex: filters.author, $options: 'i' }
    }

    let records = (await Record.find(dbQuery).lean()).map((doc: any) => ({
      id: doc._id?.toString?.() ?? '',
      title: doc.title ?? '',
      authors: doc.authors ?? [],
      description: doc.description ?? '',
      keywords: doc.keywords ?? [],
      year: doc.year ?? null,
      source: doc.source ?? '',
      type: doc.type ?? '',
      identifier: doc.identifier ?? '',
      category: doc.category ?? '',
      identifierType: doc.identifierType ?? '',
      url: doc.url ?? '',
    })) as RecordType[]

    const q = (query || '').trim()
    if (q) {
      const parsed = parseSearchQuery(q)
      if (parsed.phrases.length || parsed.tokens.length) {
        const scored: ScoredRecord[] = []
        for (const r of records) {
          const hay = buildSearchHaystack(r)
          if (!matchesQuery(hay, parsed)) continue
          const score = scoreRecordForQuery(r, parsed)
          scored.push({ record: r, score })
        }
        scored.sort((a, b) => b.score - a.score)
        records = scored.map((x) => x.record)
      }
    }

    const facets = buildFacets(records)
    const total = records.length
    const start = (page - 1) * pageSize
    const slice = records.slice(start, start + pageSize)

    return NextResponse.json({
      success: true,
      results: slice,
      total,
      page: Number(page),
      pageSize: Number(pageSize),
      hasMore: page * pageSize < total,
      facets,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      },
    })
  } catch (error) {
    console.error('Harvest API error:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message } as any,
      { status: 500 }
    )
  }
}

export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
