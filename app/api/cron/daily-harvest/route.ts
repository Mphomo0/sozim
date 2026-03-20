import { NextResponse } from 'next/server'
import { harvestDSpaceRepo } from '@/lib/harvest-dspace'
import { harvestResearchDataIncremental } from '@/lib/harvest-research'
import { DSPACE_ENDPOINTS, INCREMENTAL_RECORDS, fetchWithRetry, sleep } from '@/lib/harvest-utils'
import { getConvexClient, api } from '@/lib/convex-client'
import { Id } from '@/convex/_generated/dataModel'

const BATCH_SIZE = 2

async function createJob(totalRepos: number) {
  return await getConvexClient()!.mutation(api.harvestJobs.createHarvestJob, {
    type: 'incremental',
    totalRepos,
  })
}

async function startJob(jobId: Id<'harvestJobs'>) {
  await getConvexClient()!.mutation(api.harvestJobs.startJob, { jobId })
}

async function updateProgress(jobId: Id<'harvestJobs'>, currentRepo: string, processedRepos: number, totalRepos: number, results: { theses: number; articles: number; research: number }) {
  await getConvexClient()!.mutation(api.harvestJobs.updateJobProgress, {
    jobId,
    currentRepo,
    processedRepos,
    totalRepos,
    results,
  })
}

async function completeJob(jobId: Id<'harvestJobs'>, results: { theses: number; articles: number; research: number }) {
  await getConvexClient()!.mutation(api.harvestJobs.completeJob, { jobId, results })
}

async function failJob(jobId: Id<'harvestJobs'>, error: string) {
  await getConvexClient()!.mutation(api.harvestJobs.failJob, { jobId, error })
}

async function updateLibraryMeta() {
  // Use the efficient countByCategory query — no full record fetch needed
  const counts = await getConvexClient()!.query(api.records.countByCategory, {})

  await getConvexClient()!.mutation(api.records.updateLibraryMeta, {
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

export async function POST(req: Request): Promise<NextResponse> {
  // Verify this is a legitimate Vercel Cron invocation
  const authHeader = req.headers.get('Authorization')
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const start = Date.now()
  const repoIds = Object.keys(DSPACE_ENDPOINTS)
  const totalRepos = repoIds.length + 1

  // Hoist jobId so failJob can always reference it in catch
  const jobId = await createJob(totalRepos) as unknown as Id<'harvestJobs'>

  try {
    await startJob(jobId)

    let allTheses: any[] = []
    let allArticles: any[] = []
    // Note: no existing-records pre-fetch needed here.
    // bulkUpsertRecords uses the by_record_id index to upsert idempotently,
    // so previously-seen records just overwrite with the same data — no harm.
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

          const { t: theses, a: articles } = await harvestDSpaceRepo(id, endpoint, INCREMENTAL_RECORDS)
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

        await sleep(800)
      }
    }

    const researchCount = await harvestResearchDataIncremental(undefined)
    processedRepos++

    await updateProgress(jobId, 'research', processedRepos, totalRepos, {
      theses: allTheses.length,
      articles: allArticles.length,
      research: researchCount,
    })

    if (allTheses.length > 0 || allArticles.length > 0) {

      await getConvexClient()!.mutation(api.records.bulkUpsertRecords, {
        records: allTheses.map((r: any) => ({ ...r, category: 'thesis' })),
      })

      await getConvexClient()!.mutation(api.records.bulkUpsertRecords, {
        records: allArticles.map((r: any) => ({ ...r, category: 'article' })),
      })
    }

    await updateLibraryMeta()

    const finalResults = {
      theses: allTheses.length,
      articles: allArticles.length,
      research: researchCount,
    }

    await completeJob(jobId, finalResults)

    const duration = Math.round((Date.now() - start) / 1000)

    return NextResponse.json({
      success: true,
      message: 'Incremental harvest completed',
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
