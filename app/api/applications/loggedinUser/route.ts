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

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const skip = (page - 1) * limit

    const total = await Application.countDocuments({
      applicantId: req.auth.user.id,
    })

    const apps = await Application.find({ applicantId: req.auth.user.id })
      .select('status createdAt applicantId courseId documents')
      .populate('applicantId', 'firstName lastName email')
      .populate('courseId', 'name code')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean()

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
