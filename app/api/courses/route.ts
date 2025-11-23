import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Course from '@/models/Course'
import { auth } from '@/auth'

// GET /api/courses
export async function GET() {
  try {
    await dbConnect()
    const courses = await Course.find().populate('categoryId', 'name')

    return NextResponse.json(courses)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}

export const POST = auth(async function (req) {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { name, code, description, duration, isOpen, categoryId } =
      await req.json()

    if (
      !name?.trim() ||
      !code?.trim() ||
      !duration?.trim() ||
      !isOpen ||
      !categoryId
    ) {
      return NextResponse.json(
        { error: 'Name, Duration, Category ID, Code and isOpen are required' },
        { status: 400 }
      )
    }

    const existingCourse = await Course.findOne({ name })
    if (existingCourse) {
      return NextResponse.json(
        { error: 'Course name already exists' },
        { status: 409 }
      )
    }

    const newCourse = new Course({
      name: name.trim(),
      code: code.trim(),
      description: description?.trim(),
      duration: duration?.trim(),
      isOpen: isOpen ?? true,
      categoryId,
    })

    const saved = await newCourse.save()
    return NextResponse.json(saved, { status: 201 })
  } catch (error: unknown) {
    // FIXED: Changed 'any' to 'unknown'
    console.error('POST /courses error:', error)

    // Type narrowing to safely extract the message
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error'

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
})
