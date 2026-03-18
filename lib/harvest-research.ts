import { convexClient, api } from './convex-client'
import type { Record as RecordType, ResearchSource } from '@/lib/types'
import {
  RESEARCH_DATA_SOURCES,
  RECORDS_PER_REPOSITORY,
  INCREMENTAL_RECORDS,
  fetchJSON,
  sleep,
  year,
  stripHtml,
  rid,
  detectDryad,
  detectZenodo,
  detectMendeley,
  createRecordSignature,
  accumulativeDedupe,
} from './harvest-utils'
import { logError, HarvestCtx } from './harvest-dspace'

async function getRecords(ctx: HarvestCtx | undefined, category: string, pageSize: number) {
  if (ctx?.runQuery) {
    return await ctx.runQuery(api.records.getRecords, { category, pageSize })
  }
  if (!convexClient) throw new Error("No Convex client available")
  return await convexClient.query(api.records.getRecords, { category, pageSize })
}

async function bulkUpsert(ctx: HarvestCtx | undefined, records: any[], clearCategory?: string) {
  const args = { records, ...(clearCategory ? { clearCategory } : {}) }
  if (ctx?.runMutation) {
    return await ctx.runMutation(api.records.bulkUpsertRecords, args)
  }
  if (!convexClient) throw new Error("No Convex client available")
  return await convexClient.mutation(api.records.bulkUpsertRecords, args)
}

interface DryadData {
  _embedded?: {
    'stash:datasets'?: any[]
    'stash:items'?: any[]
  }
  results?: any[]
}

interface ZenodoData {
  hits?: {
    hits?: any[]
  }
}

interface MendeleyData {
  data?: any[]
  meta?: {
    totalPages?: number
  }
}

export async function fetchResearchSource(
  source: ResearchSource,
  query: string = '',
  limit: number = 40
): Promise<RecordType[]> {
  const out: RecordType[] = []
  const size = Math.min(25, limit)

  try {
    for (let page = 1; out.length < limit; page++) {
      let url = ''

      if (source.name === 'dryad') {
        url = `${source.apiUrl}?q=${encodeURIComponent(
          query || '*'
        )}&page=${page}&per_page=${size}`
      } else if (source.name === 'zenodo') {
        url = `${source.apiUrl}?q=${encodeURIComponent(query || '*')}${
          source.params
        }&page=${page}&size=${size}`
      } else if (source.name === 'mendeley') {
        const q = query || 'data.mendeley.com'
        url = `${source.apiUrl}?query=${encodeURIComponent(q)}${
          source.params
        }&page[number]=${page}`
      }

      if (source.name === 'dryad') {
        const data = await fetchJSON<DryadData>(url)
        if (!data) {
          break
        }

        const embedded = data._embedded || {}
        const results =
          embedded['stash:datasets'] ||
          embedded['stash:items'] ||
          data.results ||
          []

        if (!results.length) {
          break
        }

        for (const it of results) {
          if (out.length >= limit) break

          const a = it.attributes || it || {}
          const rawDoi = a.doi || a.identifier || ''
          const doi = String(rawDoi).replace(/^doi:/i, '').trim()

          const authArr = a.authors || a.creators || []
          const authors = authArr
            .map((x: any) => {
              if (!x) return ''
              if (x.fullName) return x.fullName
              const fn = x.firstName || x.givenName || ''
              const ln = x.lastName || x.familyName || ''
              if (fn || ln) return `${fn} ${ln}`.trim()
              return x.name || ''
            })
            .filter(Boolean)

          const title = a.title || 'Untitled'
          const description = a.abstract || a.description || ''
          const keywords = a.keywords || a.subjects || []
          const pubYear = year(a.publicationDate || a.publicationYear)

          const idVal = it.id || doi || rawDoi || ''
          const urlRec = doi
            ? `https://doi.org/${doi}`
            : (a.url && String(a.url)) ||
              (idVal ? `https://datadryad.org/stash/dataset/${idVal}` : '')

          let record: RecordType = {
            id: `dryad-${idVal || rid()}`,
            title,
            authors,
            description,
            keywords,
            year: pubYear,
            source: 'Dryad Digital Repository',
            type: 'Research Data',
            identifier: doi || String(idVal),
            identifierType: doi ? 'DOI' : 'Dryad ID',
            url: urlRec,
          }

          if (detectDryad(record.identifier || '', record.url || '')) {
            record.source = 'Dryad Digital Repository'
          }

          out.push(record)
        }
      } else if (source.name === 'zenodo') {
        const data = await fetchJSON<ZenodoData>(url)
        if (!data) {
          break
        }

        const hits = data.hits?.hits || []
        if (!hits.length) break

        for (const it of hits) {
          if (out.length >= limit) break
          const md = it.metadata || {}
          const doi = md.doi || ''
          const htmlLink = it.links?.html || ''
          const urlRec = doi ? `https://doi.org/${doi}` : htmlLink

          let record: RecordType = {
            id: `zenodo-${it.id}`,
            title: md.title || 'Untitled',
            authors: (md.creators || [])
              .map((c: any) => c.name)
              .filter(Boolean),
            description: md.description || '',
            keywords: md.keywords || [],
            year: year(md.publication_date),
            source: 'Zenodo',
            type: 'Research Data',
            identifier: doi || String(it.id),
            identifierType: doi ? 'DOI' : 'Zenodo ID',
            url: urlRec,
          }

          if (detectZenodo(record.identifier, record.url)) {
            record.source = 'Zenodo'
          }

          out.push(record)
        }
        if (hits.length < size) break
      } else if (source.name === 'mendeley') {
        const data = await fetchJSON<MendeleyData>(url)
        if (!data) {
          break
        }

        const items = data.data || []
        if (!items.length) break

        for (const it of items) {
          if (out.length >= limit) break
          const at = it.attributes || {}
          const titles = at.titles || []
          const title = titles[0]?.title || at.title || 'Untitled'
          const doi = at.doi || ''
          const urlRec =
            (at.url && String(at.url)) || (doi ? `https://doi.org/${doi}` : '')

          const creators = (at.creators || [])
            .map((c: any) => c.name || c.familyName || '')
            .filter(Boolean)
          const subjects = (at.subjects || [])
            .map((s: any) => s.subject)
            .filter(Boolean)

          let record: RecordType = {
            id: `mendeley-${it.id}`,
            title,
            authors: creators,
            description: stripHtml(at.descriptions?.[0]?.description || ''),
            keywords: subjects,
            year: year(at.publicationYear || at.published),
            source: 'Mendeley Data',
            type: 'Research Data',
            identifier: doi || String(it.id),
            identifierType: doi ? 'DOI' : 'ID',
            url: urlRec,
          }

          if (detectMendeley(record.identifier, record.url)) {
            record.source = 'Mendeley Data'
          }

          out.push(record)
        }

        const totalPages = data.meta?.totalPages
        if (totalPages && page >= totalPages) break
      }
    }
  } catch (err) {
    console.error(
      `   Error fetching from ${source.name}:`,
      (err as Error).message
    )
  }

  return out
}

export async function harvestResearchData(ctx?: HarvestCtx): Promise<number> {
  const allResearch: RecordType[] = []
  
  for (const source of RESEARCH_DATA_SOURCES) {
    try {
      const recs = await fetchResearchSource(source, '', RECORDS_PER_REPOSITORY)
      allResearch.push(...recs)
    } catch (err) {
      console.error(`   ❌ ${source.name} failed:`, (err as Error).message)
      await logError(ctx, 'Research:' + source.name, err as Error)
    }
    await sleep(1200)
  }

  const mergedResearch = accumulativeDedupe(allResearch)

  await bulkUpsert(ctx, mergedResearch.map(r => ({ ...r, category: 'research' })), 'research')

  return allResearch.length
}

export async function harvestResearchDataIncremental(
  ctx: HarvestCtx | undefined,
  limit: number = 10
): Promise<number> {
  let totalNewRecords = 0
  
  const searchResult = await getRecords(ctx, 'research', 1000)
  const existingResearch = searchResult.results as unknown as RecordType[]

  for (const source of RESEARCH_DATA_SOURCES) {
    try {
      const recs = await fetchResearchSource(source, '', limit)

      const newRecs = recs.filter(
        (newRec) =>
          !existingResearch.some(
            (existing) =>
              createRecordSignature(existing) === createRecordSignature(newRec)
          )
      )

      if (newRecs.length > 0) {
        await bulkUpsert(ctx, newRecs.map((r) => ({ ...r, category: 'research' }))
        )
        
        totalNewRecords += newRecs.length
      }
    } catch (err) {
      console.error(
        `   ❌ ${source.name} incremental harvest failed:`,
        (err as Error).message
      )
      await logError(ctx, 'ResearchIncremental:' + source.name, err as Error)
    }
    await sleep(800)
  }

  return totalNewRecords
}
