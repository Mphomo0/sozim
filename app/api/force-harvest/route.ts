import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import { Record, Meta } from '@/models/Record'
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
    { upsert: true }
  )
}

export async function POST(): Promise<NextResponse> {
  try {
    await dbConnect()

    console.log('💥 Force harvest triggered')

    await Promise.all([Record.deleteMany({}), Meta.deleteMany({})])

    console.log('🧹 Cache cleared, starting fresh harvest')
    await harvestDSpaceRepositories()
    await harvestResearchData()
    await updateMeta()

    return NextResponse.json({
      success: true,
      message:
        'Force harvest completed - cache cleared and fresh data harvested',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Force harvest error:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
