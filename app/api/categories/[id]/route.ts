import { NextResponse, NextRequest } from 'next/server'
import dbConnect from '@/lib/mongodb'
import CourseCategory from '@/models/CourseCategory'
import { auth } from '@/auth'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect()

    // Extract category ID from the request URL params
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Category Id is required' },
        { status: 400 }
      )
    }

    const category = await CourseCategory.findById(id).populate('courses')

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error fetching Course Category:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Course Category' },
      { status: 500 }
    )
  }
}

export const DELETE = auth(async function (
  req,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await dbConnect()

    // Extract category ID from the request URL params
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      )
    }

    const deletedCategory = await CourseCategory.findByIdAndDelete(id)

    if (!deletedCategory) {
      return NextResponse.json(
        { error: 'Category not found or already deleted' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Category successfully deleted' })
  } catch (error) {
    console.error('Error deleting Course Category:', error)
    return NextResponse.json(
      { error: 'Failed to delete Course Category' },
      { status: 500 }
    )
  }
})

export const PATCH = auth(async function (
  req,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await dbConnect()

    // Extract category ID from the request URL params
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      )
    }

    const body = await req.json()
    const { name, code, description } = body

    // Ensure that at least the name or code is provided
    if (!name && !code) {
      return NextResponse.json(
        { error: 'At least one field (name or code) must be provided' },
        { status: 400 }
      )
    }

    // Find and update the category
    const updatedCategory = await CourseCategory.findByIdAndUpdate(
      id,
      { name, code, description },
      { new: true } // Return the updated category after the update
    )

    if (!updatedCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json(updatedCategory)
  } catch (error) {
    console.error('Error updating Course Category:', error)
    return NextResponse.json(
      { error: 'Failed to update Course Category' },
      { status: 500 }
    )
  }
})
