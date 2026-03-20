import { NextResponse } from 'next/server'
import { getConvexClient, api } from '@/lib/convex-client'

export async function GET(): Promise<NextResponse> {
  try {
    const job = await getConvexClient()!.query(api.harvestJobs.getLatestJob, { type: 'full' })
    return NextResponse.json(job)
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
