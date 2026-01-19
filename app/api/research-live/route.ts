// app/api/research-live/route.ts
import { NextResponse, NextRequest } from 'next/server'
import {
  OPENALEX_LIVE_SOURCE,
  PAGE_SIZE_DEFAULT,
  fetchJSON,
  year,
  stripHtml,
  detectDryad,
  detectZenodo,
  detectMendeley,
  rid,
} from '@/lib/harvest-utils'
import type { OpenAlexDatasetResult, Record as RecordType } from '@/lib/types'

interface OpenAlexResponse {
  results?: any[]
  meta?: {
    count?: number
    next_cursor?: string
    next_page?: string
  }
}

async function fetchOpenAlexDatasets(
  query: string,
  page: number = 1,
  pageSize: number = PAGE_SIZE_DEFAULT,
): Promise<OpenAlexDatasetResult> {
  const perPage = Math.min(pageSize, 50)
  const trimmed = String(query || '').trim()

  const filterExpr = `type:dataset,title.search:${trimmed}`
  const filter = encodeURIComponent(filterExpr)

  const url = `${OPENALEX_LIVE_SOURCE.apiUrl}?filter=${filter}&per-page=${perPage}&page=${page}`

  console.log('   OpenAlex URL:', url)

  const data = await fetchJSON<OpenAlexResponse>(url)
  if (!data || !Array.isArray(data.results)) {
    console.log('   OpenAlex: no results or unexpected JSON')
    return { records: [], total: 0, hasMore: false }
  }

  const lowerQuery = trimmed.toLowerCase()
  const tokens = trimmed.toLowerCase().split(/\s+/).filter(Boolean)

  const mapped: RecordType[] = []
  for (const it of data.results) {
    try {
      const doiRaw = it.doi || ''
      const doi = doiRaw.replace(/^https?:\/\/doi.org\//i, '').trim()
      const title = it.display_name || 'Untitled'
      const pubYear = year(it.publication_year)

      const auths = it.authorships || []
      const authors = auths
        .map((a: any) => a.author?.display_name || '')
        .filter(Boolean)

      const concepts = (it.concepts || [])
        .map((c: any) => c.display_name || '')
        .filter(Boolean)
      const conceptString = concepts.join(' ').toLowerCase()

      const titleLower = (title || '').toLowerCase()

      const titleMatches = lowerQuery && titleLower.includes(lowerQuery)
      const keywordMatches =
        conceptString &&
        (conceptString.includes(lowerQuery) ||
          tokens.some((t) => t && conceptString.includes(t)))

      if (!titleMatches && !keywordMatches) {
        continue
      }

      let urlRec = ''
      if (doi) {
        urlRec = `https://doi.org/${doi}`
      } else if (it.primary_location?.landing_page_url) {
        urlRec = it.primary_location.landing_page_url
      } else if (it.id) {
        urlRec = String(it.id).replace(
          /^https?:\/\/openalex.org\//i,
          'https://openalex.org/',
        )
      }

      let record: RecordType = {
        id: `openalex-${it.id || rid()}`,
        title,
        authors,
        description: stripHtml(
          it.abstract_inverted_index
            ? Object.keys(it.abstract_inverted_index).join(' ')
            : '',
        ),
        keywords: concepts,
        year: pubYear,
        source: 'OpenAlex (Datasets)',
        type: 'Research Data',
        identifier: doi || String(it.id || ''),
        identifierType: doi ? 'DOI' : 'OpenAlex ID',
        url: urlRec,
      }

      if (detectDryad(record.identifier, record.url)) {
        record.source = 'Dryad Digital Repository'
      } else if (detectZenodo(record.identifier, record.url)) {
        record.source = 'Zenodo'
      } else if (detectMendeley(record.identifier, record.url)) {
        record.source = 'Mendeley Data'
      }

      mapped.push(record)
    } catch (e) {
      console.error('   OpenAlex mapping error:', (e as Error).message)
    }
  }

  const total = data.meta?.count || mapped.length
  const hasMore = Boolean(
    data.meta?.next_cursor || data.meta?.next_page || false,
  )

  console.log(
    `   OpenAlex live search mapped ${mapped.length} records (total meta: ${total})`,
  )

  return { records: mapped, total, hasMore }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json().catch(() => ({}))
    const { query = '', page = 1, pageSize = PAGE_SIZE_DEFAULT } = body

    const trimmedQuery = String(query || '').trim()
    if (!trimmedQuery) {
      return NextResponse.json(
        {
          success: false,
          error: 'Query is required for live research search',
          results: [],
          total: 0,
        },
        { status: 400 },
      )
    }

    console.log(`🔍 OpenAlex Live Search: "${trimmedQuery}" (datasets only)`)

    const { records, total, hasMore } = await fetchOpenAlexDatasets(
      trimmedQuery,
      page,
      pageSize,
    )

    return NextResponse.json({
      success: true,
      results: records,
      total,
      page: Number(page),
      pageSize: Number(pageSize),
      hasMore,
      source: 'OpenAlex Live Search',
    })
  } catch (error) {
    console.error('OpenAlex live search error:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    )
  }
}
