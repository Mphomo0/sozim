import { Record, Meta } from '@/models/Record'
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

  console.log(`   Starting harvest from ${id}, limit: ${limit} records`)

  while (pages < maxPages && theses.length + articles.length < limit) {
    const url = token
      ? `${endpoint}?verb=ListRecords&resumptionToken=${encodeURIComponent(
          token
        )}`
      : `${endpoint}?verb=ListRecords&metadataPrefix=oai_dc`

    console.log(
      `   Fetching from ${id}, page ${pages + 1}, token: ${
        token ? 'yes' : 'no'
      }`
    )

    const xml = await fetchWithRetry(url)
    if (!xml || xml.length < 200) {
      console.log(`   No data received from ${id}`)
      break
    }

    if (xml.includes('<error code=')) {
      const errorMatch = xml.match(/<error code="([^"]*)">([^<]*)<\/error>/)
      if (errorMatch) {
        console.log(
          `   ${id} returned error: ${errorMatch[1]} - ${errorMatch[2]}`
        )
        if (errorMatch[1] === 'noRecordsMatch') break
      }
    }

    const { records, next } = parseOai(xml, id)
    console.log(`   ${id} page ${pages + 1} parsed ${records.length} records`)

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

  console.log(
    `   ${id} harvest completed: ${theses.length} theses, ${articles.length} articles`
  )

  console.log(`   📊 URL Statistics for ${id}:`)
  console.log(`     - Theses with URL: ${theses.filter(t => t.url && t.url !== '' && t.url !== '#').length}/${theses.length}`)
  console.log(`     - Articles with URL: ${articles.filter(a => a.url && a.url !== '' && a.url !== '#').length}/${articles.length}`)

  return { t: theses.slice(0, limit), a: articles.slice(0, limit) }
}

export async function harvestDSpaceRepositories(): Promise<{
  theses: number
  articles: number
}> {
  const allTheses: RecordType[] = []
  const allArticles: RecordType[] = []

  const existingTheses = (await Record.find({
    category: 'thesis',
  }).lean()) as unknown as RecordType[]
  const existingArticles = (await Record.find({
    category: 'article',
  }).lean()) as unknown as RecordType[]

  console.log(
    `📚 Harvesting ${Object.keys(DSPACE_ENDPOINTS).length} DSpace repositories`
  )

  for (const [id, endpoint] of Object.entries(DSPACE_ENDPOINTS)) {
    try {
      console.log(`🔍 Testing ${id} at ${endpoint}`)

      const testUrl = `${endpoint}?verb=ListRecords&metadataPrefix=oai_dc`
      const testResponse = await fetchWithRetry(testUrl)

      if (!testResponse || !testResponse.includes('<record>')) {
        console.log(`⭐️ Skipping ${id} - endpoint didn't return records`)
        continue
      }

      console.log(`✅ ${id} is accessible, starting harvest...`)
      const { t: theses, a: articles } = await harvestDSpaceRepo(
        id,
        endpoint,
        RECORDS_PER_REPOSITORY
      )
      allTheses.push(...theses)
      allArticles.push(...articles)
      console.log(
        `✅ ${id}: ${theses.length} theses, ${articles.length} articles`
      )
    } catch (err) {
      console.error(`❌ ${id} failed:`, (err as Error).message)
      await logError('DSpace:' + id, err as Error)
    }

    await sleep(1500)
  }

  const mergedTheses = accumulativeDedupe([...existingTheses, ...allTheses])
  const mergedArticles = accumulativeDedupe([
    ...existingArticles,
    ...allArticles,
  ])

  await Record.deleteMany({ category: 'thesis' })
  await Record.insertMany(
    mergedTheses.map((r) => ({ ...r, category: 'thesis' }))
  )

  await Record.deleteMany({ category: 'article' })
  await Record.insertMany(
    mergedArticles.map((r) => ({ ...r, category: 'article' }))
  )

  console.log(
    `🎉 Repositories: ${allTheses.length} new theses, ${allArticles.length} new articles`
  )

  return { theses: allTheses.length, articles: allArticles.length }
}

export async function harvestDSpaceRepositoriesIncremental(
  limit: number = 10
): Promise<number> {
  let totalNewRecords = 0

  let existingTheses = (await Record.find({
    category: 'thesis',
  }).lean()) as unknown as RecordType[]
  let existingArticles = (await Record.find({
    category: 'article',
  }).lean()) as unknown as RecordType[]

  console.log(
    `📚 Incremental harvesting from ${
      Object.keys(DSPACE_ENDPOINTS).length
    } repositories`
  )

  for (const [id, endpoint] of Object.entries(DSPACE_ENDPOINTS)) {
    try {
      console.log(`🔍 Testing ${id} for incremental harvest`)

      const testUrl = `${endpoint}?verb=ListRecords&metadataPrefix=oai_dc`
      const testResponse = await fetchWithRetry(testUrl)

      if (!testResponse || !testResponse.includes('<record>')) {
        console.log(`⭐️ Skipping ${id} - endpoint not returning records`)
        continue
      }

      console.log(`✅ Incremental harvesting ${id}`)
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
        await Record.insertMany(
          newTheses.map((r) => ({ ...r, category: 'thesis' }))
        )
        existingTheses = [...existingTheses, ...newTheses]
        console.log(`✅ ${id}: Added ${newTheses.length} new theses`)
        totalNewRecords += newTheses.length
      }

      if (newArticles.length > 0) {
        await Record.insertMany(
          newArticles.map((r) => ({ ...r, category: 'article' }))
        )
        existingArticles = [...existingArticles, ...newArticles]
        console.log(`✅ ${id}: Added ${newArticles.length} new articles`)
        totalNewRecords += newArticles.length
      }
    } catch (err) {
      console.error(
        `❌ ${id} incremental harvest failed:`,
        (err as Error).message
      )
      await logError('DSpaceIncremental:' + id, err as Error)
    }

    await sleep(800)
  }

  return totalNewRecords
}

export async function logError(context: string, error: Error): Promise<void> {
  const entry = {
    context,
    message: error?.message || String(error),
    time: new Date(),
  }

  try {
    await Meta.findOneAndUpdate(
      { key: 'system' },
      {
        $set: {
          lastError: entry,
        },
      },
      { upsert: true }
    )
  } catch (e) {
    console.error('Meta update error', (e as Error)?.message)
  }

  console.error('❌', context, entry.message)
}
