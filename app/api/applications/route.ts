import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Application from '@/models/Application'
import { auth } from '@/auth'

export const GET = auth(async function (req) {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await dbConnect()

    // Parse query parameters (?page=1&limit=10)
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)

    const skip = (page - 1) * limit

    // Get total count
    const total = await Application.countDocuments()

    // Fetch paginated applications
    const apps = await Application.find()
      .populate('applicantId')
      .populate('courseId')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }) // newest first

    return NextResponse.json(
      {
        data: apps,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page * limit < total,
          hasPrevPage: page > 1,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('GET /applications error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
})

export const POST = auth(async function (req) {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await dbConnect()

    const data = await req.json()

    const newApplication = await Application.create(data)

    const saved = await newApplication.save()

    return Response.json(saved, { status: 201 })
  } catch (error: any) {
    console.error('POST /applications error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
})
