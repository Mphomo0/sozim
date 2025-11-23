import { NextResponse, NextRequest } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Course from '@/models/Course'
import { auth } from '@/auth'

// GET a single course
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect()

    // Extract course ID from the request URL params
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Course Id is required' },
        { status: 400 }
      )
    }

    const course = await Course.findById(id).populate('courses')

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    return NextResponse.json(course)
  } catch (error) {
    console.error('Error fetching Course:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Course' },
      { status: 500 }
    )
  }
}

// PATCH /api/course/:id
export const PATCH = auth(async function (
  req,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await dbConnect()

    // Extract course ID from the request URL params
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      )
    }

    const body = await req.json()
    const { name, code, description, duration, isOpen, categoryId } = body

    // Ensure that at least the name or code is provided
    if (
      !name &&
      !code &&
      !description &&
      !duration &&
      isOpen === undefined &&
      !categoryId
    ) {
      return NextResponse.json(
        { error: 'At least one field (name or code) must be provided' },
        { status: 400 }
      )
    }

    // Find and update the category
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { name, code, description, duration, isOpen, categoryId },
      { new: true } // Return the updated course after the update
    ).populate('categoryId', 'name')

    if (!updatedCourse) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    return NextResponse.json(
      { success: true, data: updatedCourse },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error updating Course Category:', error)
    return NextResponse.json(
      { error: 'Failed to update Course' },
      { status: 500 }
    )
  }
})

export const DELETE = auth(async function (
  req,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await dbConnect()

    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      )
    }

    const deletedCourse = await Course.findByIdAndDelete(id)

    if (!deletedCourse) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    return NextResponse.json(
      { success: true, message: 'Course deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('DELETE /courses/:id error:', error)
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    )
  }
})
