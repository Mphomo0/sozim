import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import { harvestDSpaceRepositories } from '@/lib/harvest-dspace'
import { harvestResearchData } from '@/lib/harvest-research'
import { Record, Meta } from '@/models/Record'

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
    { upsert: true }
  )
}
export async function POST(): Promise<NextResponse> {
  try {
    await dbConnect()

    console.log(
      '🚀 Manual harvest triggered (40 records per DSpace repo + research)'
    )
    const start = Date.now()

    await harvestDSpaceRepositories()
    await harvestResearchData()
    await updateMeta()

    const duration = Math.round((Date.now() - start) / 1000)

    return NextResponse.json({
      success: true,
      message:
        'Manual harvest completed - 40 records from each DSpace repository + research sources',
      duration_seconds: duration,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Manual harvest error:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
