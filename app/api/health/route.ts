import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Record, Meta } from '@/models/Record';
import { DSPACE_ENDPOINTS, RESEARCH_DATA_SOURCES } from '@/lib/harvest-utils';
import type { HealthResponse } from '@/lib/types';

export async function GET(): Promise<NextResponse<HealthResponse>> {
  try {
    await dbConnect();

    const [thesesCount, articlesCount, researchCount, meta] = await Promise.all([
      Record.countDocuments({ category: 'thesis' }),
      Record.countDocuments({ category: 'article' }),
      Record.countDocuments({ category: 'research' }),
      Meta.findOne({ key: 'system' }).lean() as Promise<{ lastHarvest?: Date } | null>
    ]);

    const totalRecords = thesesCount + articlesCount + researchCount;

    return NextResponse.json({
      ok: true,
      service: "Academic Library Harvester",
      version: "3.4.0",
      timestamp: new Date().toISOString(),
      repositories: {
        academic: Object.keys(DSPACE_ENDPOINTS).length,
        research_data: RESEARCH_DATA_SOURCES.length,
        includes_elis: true,
        includes_openalex_live: true
      },
      data: {
        total_records: totalRecords,
        theses: thesesCount,
        articles: articlesCount,
        research: researchCount
      },
      meta: meta || {},
      harvest: {
        last_harvest: meta && 'lastHarvest' in meta && meta.lastHarvest instanceof Date
          ? meta.lastHarvest.toISOString()
          : "Never",
        next_harvest: "Daily at 2 AM"
      }
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      { ok: false, error: (error as Error).message } as any,
      { status: 500 }
    );
  }
}