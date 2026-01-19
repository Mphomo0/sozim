// app/api/elis-live-search/route.ts
import { NextResponse, NextRequest } from 'next/server'
import {
  ELIS_PRIMARY,
  ELIS_BACKUP,
  PAGE_SIZE_DEFAULT,
  fetchWithRetry,
  sleep,
} from '@/lib/harvest-utils'
import { parseOai } from '@/lib/oai-parser'
import type {
  ElisSearchResult,
  ElisEndpointChoice,
  SearchQueryParsed,
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

async function chooseElisEndpointForSearch(): Promise<ElisEndpointChoice> {
  const smallQuery = '&metadataPrefix=oai_dc'

  try {
    const url = `${ELIS_PRIMARY}?verb=ListRecords${smallQuery}`
    const xml = await fetchWithRetry(url)
    if (xml && xml.length > 200 && /<record>/i.test(xml)) {
      console.log('   E-LIS primary endpoint OK for search')
      return { endpoint: ELIS_PRIMARY, used: 'primary' }
    }
  } catch (e) {
    console.log('   E-LIS primary search test failed:', (e as Error).message)
  }

  try {
    const url = `${ELIS_BACKUP}?verb=ListRecords${smallQuery}`
    const xml = await fetchWithRetry(url)
    if (xml && xml.length > 200 && /<record>/i.test(xml)) {
      console.log('   E-LIS backup endpoint OK for search')
      return { endpoint: ELIS_BACKUP, used: 'backup' }
    }
  } catch (e) {
    console.log('   E-LIS backup search test failed:', (e as Error).message)
  }

  return { endpoint: null, used: null }
}

async function searchEliSDirectly(
  query: string = '',
  page: number = 1,
  pageSize: number = PAGE_SIZE_DEFAULT,
): Promise<ElisSearchResult> {
  const allMatches: RecordType[] = []

  const resolved = await chooseElisEndpointForSearch()
  if (!resolved.endpoint) {
    console.log('   E-LIS live search: no working endpoint')
    return { results: [], endpointUsed: null }
  }

  const endpoint = resolved.endpoint
  console.log(
    `   E-LIS live search using ${resolved.used} endpoint: ${endpoint}`,
  )

  const parsed = parseSearchQuery(query)
  const limitTotal = page * pageSize
  const maxPages = 3

  try {
    let token: string | null = null
    let pages = 0

    while (allMatches.length < limitTotal && pages < maxPages) {
      const searchUrl = token
        ? `${endpoint}?verb=ListRecords&resumptionToken=${encodeURIComponent(token)}`
        : `${endpoint}?verb=ListRecords&metadataPrefix=oai_dc`

      console.log(
        `   Fetching E-LIS page ${pages + 1}, token: ${token ? 'yes' : 'no'}`,
      )

      const xml = await fetchWithRetry(searchUrl)
      if (!xml || xml.length < 200) break

      if (xml.includes('<error code=')) {
        const errorMatch = xml.match(/<error code="([^"]*)">([^<]*)<\/error>/)
        if (errorMatch) {
          console.log(`   E-LIS error: ${errorMatch[1]} - ${errorMatch[2]}`)
          if (errorMatch[1] === 'noRecordsMatch') break
        }
      }

      const { records, next } = parseOai(xml, 'elis')
      console.log(`   E-LIS page ${pages + 1} found ${records.length} records`)

      for (const record of records) {
        const haystack = buildSearchHaystack(record)
        if (matchesQuery(haystack, parsed)) {
          allMatches.push(record)
          if (allMatches.length >= limitTotal) break
        }
      }

      token = next
      pages++

      if (!token) break
      await sleep(800)
    }

    console.log(
      `   E-LIS search completed: ${allMatches.length} matching records`,
    )

    const offset = (page - 1) * pageSize
    const slice = allMatches.slice(offset, offset + pageSize)

    return { results: slice, endpointUsed: resolved.used }
  } catch (err) {
    console.error('   E-LIS direct search error:', (err as Error).message)
    return { results: [], endpointUsed: resolved.used }
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json().catch(() => ({}))
    const { query = '', page = 1, pageSize = PAGE_SIZE_DEFAULT } = body

    const trimmedQuery = String(query || '').trim()

    const isMultiWord = trimmedQuery.includes(' ')
    const lengthOk = trimmedQuery.length >= 2

    if (!trimmedQuery || (!lengthOk && !isMultiWord)) {
      return NextResponse.json({
        success: true,
        results: [],
        total: 0,
        page: Number(page),
        pageSize: Number(pageSize),
        hasMore: false,
        source: 'E-LIS Live Search',
        message:
          'Type at least 2 characters (or a multi-word phrase) to search E-LIS',
      })
    }

    console.log(
      `🔍 E-LIS Live Search: "${trimmedQuery}" (page ${page}, pageSize ${pageSize})`,
    )
    const { results, endpointUsed } = await searchEliSDirectly(
      trimmedQuery,
      page,
      pageSize,
    )

    if (!endpointUsed) {
      return NextResponse.json(
        {
          success: false,
          error:
            'E-LIS repository unreachable (primary and backup endpoints failed)',
          results: [],
          total: 0,
        },
        { status: 502 },
      )
    }

    return NextResponse.json({
      success: true,
      results,
      total: results.length,
      page: Number(page),
      pageSize: Number(pageSize),
      hasMore: false,
      source: 'E-LIS Live Search',
      endpoint_used: endpointUsed,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
      },
    })
  } catch (error) {
    console.error('E-LIS live search error:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    )
  }
}
