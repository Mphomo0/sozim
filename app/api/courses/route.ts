import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Course from '@/models/Course'
import CourseCategory from '@/models/CourseCategory'
import { auth } from '@/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await dbConnect()

    const courses = await Course.find()
      .select('name code description duration isOpen categoryId level qualification')
      .populate('categoryId', 'name')
      .lean()

    return NextResponse.json(
      { success: true, data: courses },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    )
  } catch (error: unknown) {
    console.error('GET /courses error:', error)
    return NextResponse.json(
      {
        success: false,
        error:
          process.env.NODE_ENV === 'development'
            ? error || 'Unknown error'
            : 'Failed to fetch courses',
      },
      { status: 500 }
    )
  }
}

export const POST = auth(async function (req) {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()

    const {
      name,
      code,
      description,
      duration,
      isOpen,
      categoryId,
      modules,
      creditTotals,
      entryRequirements,
      qualification,
      level,
    } = body

    if (!name?.trim() || !code?.trim() || !duration?.trim() || !categoryId) {
      return NextResponse.json(
        {
          error: 'Name, Code, Duration, and Category ID are required fields.',
        },
        { status: 400 }
      )
    }

    const categoryExists = await CourseCategory.findById(categoryId).lean()
    if (!categoryExists) {
      return NextResponse.json(
        { error: 'Invalid category ID' },
        { status: 400 }
      )
    }

    const existingCourse = await Course.findOne({ name }).lean()
    if (existingCourse) {
      return NextResponse.json(
        { error: 'A course with this name already exists.' },
        { status: 409 }
      )
    }

    const newCourse = new Course({
      name: name.trim(),
      code: code.trim(),
      description: description?.trim() ?? '',
      duration: duration.trim(),
      isOpen: typeof isOpen === 'boolean' ? isOpen : true,
      categoryId,
      qualification,
      level,
      modules: modules ?? {},
      creditTotals: creditTotals ?? {},
      entryRequirements: entryRequirements ?? [],
    })

    const saved = await newCourse.save()

    return NextResponse.json(saved, { status: 201 })
  } catch (error: unknown) {
    console.error('POST /courses error:', error)
    const message =
      error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
})
