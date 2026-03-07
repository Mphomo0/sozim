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

    // Parse query parameters (?page=1&limit=10&search=...)
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit

    // Build query
    const query: any = {}
    if (search) {
      // Since applicantId is populated, we might need to search in the Applicant model
      // But typically we filter at the mongo level. If applicantId is a reference,
      // we might need to use aggregation or search fields that are indexed.
      // Assuming we want to search by applicant details, we might need a more complex query
      // or just search on the Application fields if they exist.
      // However, the common pattern is to search in the populated fields if possible,
      // but Application.find(query) filters Application documents first.
      
      // For now, let's look for applicants matching the search and then filter applications.
      // Or better, use a join if supported, but Mongoose find().populate() doesn't filter by populated fields natively.
      
      // Let's assume we can at least search by status or something if we had more fields.
      // To properly search applicant name, we'd need to find applicant IDs first.
      
      const ApplicantModel = (await import('@/models/User')).default; // Use User model as Applicant
      const matchingApplicants = await ApplicantModel.find({
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ]
      }).select('_id');
      
      const applicantIds = matchingApplicants.map(a => a._id);
      query.applicantId = { $in: applicantIds };
    }

    // Get total count
    const total = await Application.countDocuments(query)

    // Fetch paginated applications
    const apps = await Application.find(query)
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
  } catch (error: unknown) {
    console.error('GET /applications error:', error)
    const message =
      error instanceof Error ? error.message : 'Failed to fetch applications'

    return NextResponse.json({ error: message }, { status: 500 })
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
  } catch (error: unknown) {
    console.error('POST /applications error:', error)
    const message =
      error instanceof Error ? error.message : 'Internal server error'

    return NextResponse.json({ error: message }, { status: 500 })
  }
})
