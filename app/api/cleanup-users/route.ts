import { NextResponse } from 'next/server'
import { cleanupDuplicateUsers } from '@/app/actions/user.actions'

export async function POST(request: Request) {
  try {
    const { email, clerkId } = await request.json()
    
    if (!email || !clerkId) {
      return NextResponse.json({ error: 'Email and clerkId are required' }, { status: 400 })
    }

    const result = await cleanupDuplicateUsers(email, clerkId)
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Error in cleanup API:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
