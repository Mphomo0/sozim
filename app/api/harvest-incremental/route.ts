import { NextResponse, NextRequest } from 'next/server'
import dbConnect from '@/lib/mongodb'
import { Meta, Record } from '@/models/Record'
import { harvestDSpaceRepositoriesIncremental } from '@/lib/harvest-dspace'
import { harvestResearchDataIncremental } from '@/lib/harvest-research'
import { INCREMENTAL_RECORDS } from '@/lib/harvest-utils'
import type { IncrementalHarvestResponse } from '@/lib/types'

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

export async function POST(
  request: NextRequest
): Promise<NextResponse<IncrementalHarvestResponse>> {
  try {
    await dbConnect()

    const body = await request.json().catch(() => ({}))
    const { category = 'all' } = body

    console.log(`Incremental harvest triggered for category: ${category}`)

    let newRecords = 0

    if (
      category === 'all' ||
      category === 'theses' ||
      category === 'articles'
    ) {
      console.log('📚 Incremental harvesting from DSpace repositories...')
      const dspaceResults = await harvestDSpaceRepositoriesIncremental(
        INCREMENTAL_RECORDS
      )
      newRecords += dspaceResults
    }

    if (category === 'all' || category === 'research') {
      console.log('🔬 Incremental harvesting from research data sources...')
      const researchResults = await harvestResearchDataIncremental(
        INCREMENTAL_RECORDS
      )
      newRecords += researchResults
    }

    await updateMeta()

    return NextResponse.json({
      success: true,
      message: 'Incremental harvest completed',
      newRecords,
      category,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Incremental harvest error:', error)
    return NextResponse.json(
      { success: false, message: (error as Error).message } as any,
      { status: 500 }
    )
  }
}
