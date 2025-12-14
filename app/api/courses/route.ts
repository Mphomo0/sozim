import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Course from '@/models/Course'
import CourseCategory from '@/models/CourseCategory'
import { auth } from '@/auth'

// GET /api/courses
export async function GET() {
  try {
    await dbConnect()
    const courses = await Course.find().populate('categoryId', 'name')

    return NextResponse.json({ success: true, data: courses })
  } catch (error: unknown) {
    console.error('GET /courses error:', error) // <-- log it
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

    // Validate required fields
    if (!name?.trim() || !code?.trim() || !duration?.trim() || !categoryId) {
      return NextResponse.json(
        {
          error: 'Name, Code, Duration, and Category ID are required fields.',
        },
        { status: 400 }
      )
    }

    // Validate categoryId exists
    const categoryExists = await CourseCategory.findById(categoryId)
    if (!categoryExists) {
      return NextResponse.json(
        { error: 'Invalid category ID' },
        { status: 400 }
      )
    }

    // Check duplicates
    const existingCourse = await Course.findOne({ name })
    if (existingCourse) {
      return NextResponse.json(
        { error: 'A course with this name already exists.' },
        { status: 409 }
      )
    }

    // Build Course object
    const newCourse = new Course({
      name: name.trim(),
      code: code.trim(),
      description: description?.trim() ?? '',
      duration: duration.trim(),
      isOpen: typeof isOpen === 'boolean' ? isOpen : true,
      categoryId,
      qualification, // optional
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
