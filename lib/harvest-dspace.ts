import { getConvexClient, api } from './convex-client'
import type { Record as RecordType, HarvestResult } from '@/lib/types'
import {
  DSPACE_ENDPOINTS,
  RECORDS_PER_REPOSITORY,
  INCREMENTAL_RECORDS,
  fetchWithRetry,
  sleep,
  createRecordSignature,
  accumulativeDedupe,
} from './harvest-utils'
import { parseOai } from './oai-parser'

export interface HarvestCtx {
  runQuery: (query: any, args: any) => Promise<any>
  runMutation: (mutation: any, args: any) => Promise<any>
}

async function getRecords(ctx: HarvestCtx | undefined, category: string, pageSize: number) {
  if (ctx?.runQuery) {
    return await ctx.runQuery(api.records.getRecords, { category, pageSize })
  }
  if (!getConvexClient()) throw new Error("No Convex client available")
  return await getConvexClient()!.query(api.records.getRecords, { category, pageSize })
}

async function bulkUpsert(ctx: HarvestCtx | undefined, records: any[], clearCategory?: string) {
  const args = { records, ...(clearCategory ? { clearCategory } : {}) }
  if (ctx?.runMutation) {
    return await ctx.runMutation(api.records.bulkUpsertRecords, args)
  }
  if (!getConvexClient()) throw new Error("No Convex client available")
  return await getConvexClient()!.mutation(api.records.bulkUpsertRecords, args)
}

async function updateMeta(ctx: HarvestCtx | undefined, key: string, counts: any, lastError?: any) {
  const args = { key, counts, ...(lastError ? { lastError } : {}) }
  if (ctx?.runMutation) {
    return await ctx.runMutation(api.records.updateLibraryMeta, args)
  }
  if (!getConvexClient()) throw new Error("No Convex client available")
  return await getConvexClient()!.mutation(api.records.updateLibraryMeta, args)
}

export async function harvestDSpaceRepo(
  id: string,
  endpoint: string,
  limit: number = 40
): Promise<HarvestResult> {
  const theses: RecordType[] = []
  const articles: RecordType[] = []
  let token: string | null = null
  let pages = 0
  const maxPages = 5

  while (pages < maxPages && theses.length + articles.length < limit) {
    const url = token
      ? `${endpoint}?verb=ListRecords&resumptionToken=${encodeURIComponent(
          token
        )}`
      : `${endpoint}?verb=ListRecords&metadataPrefix=oai_dc`

    const xml = await fetchWithRetry(url)
    if (!xml || xml.length < 200) {
      break
    }

    if (xml.includes('<error code=')) {
      const errorMatch = xml.match(/<error code="([^"]*)">([^<]*)<\/error>/)
      if (errorMatch) {
        if (errorMatch[1] === 'noRecordsMatch') break
      }
    }

    const { records, next } = parseOai(xml, id)

    for (const r of records) {
      if (/thesis|dissertation/i.test(r.type)) theses.push(r)
      else if (/article/i.test(r.type)) articles.push(r)
      else if (r.type && r.type !== 'Other') articles.push(r)

      if (theses.length + articles.length >= limit) break
    }

    token = next
    pages++
    if (!token) break

    await sleep(1000)
  }

  return { t: theses.slice(0, limit), a: articles.slice(0, limit) }
}

export async function harvestDSpaceRepositories(ctx?: HarvestCtx): Promise<{
  theses: number
  articles: number
}> {
  const allTheses: RecordType[] = []
  const allArticles: RecordType[] = []

  const thesesResult = await getRecords(ctx, 'thesis', 1000)
  const existingTheses = thesesResult.results as unknown as RecordType[]

  const articlesResult = await getRecords(ctx, 'article', 1000)
  const existingArticles = articlesResult.results as unknown as RecordType[]

  for (const [id, endpoint] of Object.entries(DSPACE_ENDPOINTS)) {
    try {
      const testUrl = `${endpoint}?verb=ListRecords&metadataPrefix=oai_dc`
      const testResponse = await fetchWithRetry(testUrl)

      if (!testResponse || !testResponse.includes('<record>')) {
        continue
      }

      const { t: theses, a: articles } = await harvestDSpaceRepo(
        id,
        endpoint,
        RECORDS_PER_REPOSITORY
      )
      allTheses.push(...theses)
      allArticles.push(...articles)
    } catch (err) {
    console.error(`❌ ${id} failed:`, (err as Error).message)
    await logError(ctx, 'DSpace:' + id, err as Error)
    }

    await sleep(1500)
  }

  const mergedTheses = accumulativeDedupe([...existingTheses, ...allTheses])
  const mergedArticles = accumulativeDedupe([
    ...existingArticles,
    ...allArticles,
  ])

  await bulkUpsert(ctx, mergedTheses.map((r) => ({ ...r, category: 'thesis' })), 'thesis')

  await bulkUpsert(ctx, mergedArticles.map((r) => ({ ...r, category: 'article' })), 'article')

  return { theses: allTheses.length, articles: allArticles.length }
}

export async function harvestDSpaceRepositoriesIncremental(
  ctx: HarvestCtx | undefined,
  limit: number = 10
): Promise<number> {
  let totalNewRecords = 0

  const thesesResult = await getRecords(ctx, 'thesis', 1000)
  let existingTheses = thesesResult.results as unknown as RecordType[]

  const articlesResult = await getRecords(ctx, 'article', 1000)
  let existingArticles = articlesResult.results as unknown as RecordType[]

  for (const [id, endpoint] of Object.entries(DSPACE_ENDPOINTS)) {
    try {
      const testUrl = `${endpoint}?verb=ListRecords&metadataPrefix=oai_dc`
      const testResponse = await fetchWithRetry(testUrl)

      if (!testResponse || !testResponse.includes('<record>')) {
        continue
      }

      const { t: theses, a: articles } = await harvestDSpaceRepo(
        id,
        endpoint,
        limit
      )

      const newTheses = theses.filter(
        (newThesis) =>
          !existingTheses.some(
            (existing) =>
              createRecordSignature(existing) ===
              createRecordSignature(newThesis)
          )
      )

      const newArticles = articles.filter(
        (newArticle) =>
          !existingArticles.some(
            (existing) =>
              createRecordSignature(existing) ===
              createRecordSignature(newArticle)
          )
      )

      if (newTheses.length > 0) {
        await bulkUpsert(ctx, newTheses.map((r) => ({ ...r, category: 'thesis' })))
        existingTheses = [...existingTheses, ...newTheses]
        totalNewRecords += newTheses.length
      }

      if (newArticles.length > 0) {
        await bulkUpsert(ctx, newArticles.map((r) => ({ ...r, category: 'article' })))
        existingArticles = [...existingArticles, ...newArticles]
        totalNewRecords += newArticles.length
      }
    } catch (err) {
      console.error(
        `❌ ${id} incremental harvest failed:`,
        (err as Error).message
      )
      await logError(ctx, 'DSpaceIncremental:' + id, err as Error)
    }

    await sleep(800)
  }

  return totalNewRecords
}

export async function logError(ctx: HarvestCtx | undefined, context: string, error: Error): Promise<void> {
  const entry = {
    context,
    message: error?.message || String(error),
    time: Date.now(),
  }

  try {
    await updateMeta(ctx, 'system', { theses: 0, articles: 0, research: 0, total: 0 }, entry)
  } catch (e) {
    console.error('Meta update error', (e as Error)?.message)
  }

  console.error(context, entry.message)
}
