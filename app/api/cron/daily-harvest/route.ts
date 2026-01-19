import { NextResponse, NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import { Meta, Record } from '@/models/Record'
import { harvestDSpaceRepositories } from '@/lib/harvest-dspace'
import { harvestResearchData } from '@/lib/harvest-research'

async function updateMeta(): Promise<void> {
  const thesesCount = await Record.countDocuments({ category: 'thesis' })
  const articlesCount = await Record.countDocuments({ category: 'article' })
  const researchCount = await Record.countDocuments({ category: 'research' })

  await Meta.findOneAndUpdate(
    { key: 'system' },
    {
      $set: {
        lastUpdated: new Date(),
        counts: {
          theses: thesesCount,
          articles: articlesCount,
          research: researchCount,
          total: thesesCount + articlesCount + researchCount,
        },
        lastHarvest: new Date(),
      },
    },
    { upsert: true },
  )
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const authHeader = request.headers.get('authorization')

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()

    console.log(
      '🔄 Starting automated daily harvest (40 records per repository)',
    )
    const harvestStart = Date.now()

    await harvestDSpaceRepositories()
    await harvestResearchData()
    await updateMeta()

    const duration = Math.round((Date.now() - harvestStart) / 1000)
    console.log(`✅ Automated harvest completed in ${duration} seconds`)

    return NextResponse.json({
      success: true,
      message: 'Daily harvest completed successfully',
      duration_seconds: duration,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Daily harvest cron error:', error)

    await Meta.findOneAndUpdate(
      { key: 'system' },
      {
        $set: {
          lastError: {
            context: 'DailyHarvestCron',
            message: (error as Error).message,
            time: new Date(),
          },
        },
      },
      { upsert: true },
    )

    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    )
  }
}
