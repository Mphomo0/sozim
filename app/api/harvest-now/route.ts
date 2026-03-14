import { NextResponse } from 'next/server'
import { harvestDSpaceRepo } from '@/lib/harvest-dspace'
import { harvestResearchData } from '@/lib/harvest-research'
import { DSPACE_ENDPOINTS, RECORDS_PER_REPOSITORY, fetchWithRetry, sleep, createRecordSignature, accumulativeDedupe } from '@/lib/harvest-utils'
import { convexClient, api } from '@/lib/convex-client'
import { Id } from '@/convex/_generated/dataModel'

const BATCH_SIZE = 2

async function createJob(totalRepos: number) {
  return await convexClient.mutation(api.harvestJobs.createHarvestJob, {
    type: 'full',
    totalRepos,
  })
}

async function startJob(jobId: Id<'harvestJobs'>) {
  await convexClient.mutation(api.harvestJobs.startJob, { jobId })
}

async function updateProgress(jobId: Id<'harvestJobs'>, currentRepo: string, processedRepos: number, totalRepos: number, results: { theses: number; articles: number; research: number }) {
  await convexClient.mutation(api.harvestJobs.updateJobProgress, {
    jobId,
    currentRepo,
    processedRepos,
    totalRepos,
    results,
  })
}

async function completeJob(jobId: Id<'harvestJobs'>, results: { theses: number; articles: number; research: number }) {
  await convexClient.mutation(api.harvestJobs.completeJob, { jobId, results })
}

async function failJob(jobId: Id<'harvestJobs'>, error: string) {
  await convexClient.mutation(api.harvestJobs.failJob, { jobId, error })
}

async function updateLibraryMeta() {
  // Use the efficient countByCategory query — no full record fetch needed
  const counts = await convexClient.query(api.records.countByCategory, {})

  await convexClient.mutation(api.records.updateLibraryMeta, {
    key: 'main',
    counts: {
      theses: counts.thesis,
      articles: counts.article,
      research: counts.research,
      total: counts.total,
    },
    lastHarvest: Date.now(),
  })
}

export async function POST(): Promise<NextResponse> {
  const start = Date.now()
  const repoIds = Object.keys(DSPACE_ENDPOINTS)
  const totalRepos = repoIds.length + 1 // +1 for research

  const jobId = await createJob(totalRepos) as unknown as Id<'harvestJobs'>

  try {
    
    await startJob(jobId)

    let allTheses: any[] = []
    let allArticles: any[] = []
    // Note: no pre-fetch of existing records needed — bulkUpsertRecords with
    // clearCategory replaces the entire category, so dedup happens at the
    // Convex mutation level (by_record_id index).
    let processedRepos = 0

    for (let i = 0; i < repoIds.length; i += BATCH_SIZE) {
      const batch = repoIds.slice(i, i + BATCH_SIZE)
  

      for (const id of batch) {
        const endpoint = DSPACE_ENDPOINTS[id as keyof typeof DSPACE_ENDPOINTS]

        try {
          const testUrl = `${endpoint}?verb=ListRecords&metadataPrefix=oai_dc`
          const testResponse = await fetchWithRetry(testUrl)

          if (!testResponse || !testResponse.includes('<record>')) {
           
            processedRepos++
            continue
          }

          const { t: theses, a: articles } = await harvestDSpaceRepo(id, endpoint, RECORDS_PER_REPOSITORY)
          allTheses.push(...theses)
          allArticles.push(...articles)

      
        } catch (err) {
          console.error(`❌ ${id} failed:`, (err as Error).message)
        }

        processedRepos++
        await updateProgress(jobId, id, processedRepos, totalRepos, {
          theses: allTheses.length,
          articles: allArticles.length,
          research: 0,
        })

        await sleep(1500)
      }
    }

 
    const researchCount = await harvestResearchData()
    processedRepos++

    await updateProgress(jobId, 'research', processedRepos, totalRepos, {
      theses: allTheses.length,
      articles: allArticles.length,
      research: researchCount,
    })

    // Deduplicate freshly harvested records among themselves, then save.
    // clearCategory + bulkUpsert replaces the whole category atomically.
    const mergedTheses = accumulativeDedupe(allTheses)
    const mergedArticles = accumulativeDedupe(allArticles)


    await convexClient.mutation(api.records.bulkUpsertRecords, {
      records: mergedTheses.map((r: any) => ({ ...r, category: 'thesis' })),
      clearCategory: 'thesis',
    })

    await convexClient.mutation(api.records.bulkUpsertRecords, {
      records: mergedArticles.map((r: any) => ({ ...r, category: 'article' })),
      clearCategory: 'article',
    })

    await updateLibraryMeta()

    const finalResults = {
      theses: mergedTheses.length,
      articles: mergedArticles.length,
      research: researchCount,
    }

    await completeJob(jobId, finalResults)

    const duration = Math.round((Date.now() - start) / 1000)
 

    return NextResponse.json({
      success: true,
      message: 'Full harvest completed',
      duration_seconds: duration,
      timestamp: new Date().toISOString(),
      jobId,
      results: finalResults,
    })
  } catch (error) {
    console.error('Harvest error:', error)
    await failJob(jobId, (error as Error).message)

    return NextResponse.json(
      { success: false, error: (error as Error).message, jobId },
      { status: 500 }
    )
  }
}
