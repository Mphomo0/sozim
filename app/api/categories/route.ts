import { NextResponse, NextRequest } from 'next/server'
import dbConnect from '@/lib/mongodb'
import CourseCategory from '@/models/CourseCategory'

// GET all categories
export async function GET() {
  try {
    await dbConnect()
    const categories = await CourseCategory.find()
    return NextResponse.json(categories)
  } catch (error) {
    console.error('GET /categories error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

// POST create a new category
export async function POST(req: NextRequest) {
  try {
    await dbConnect()
    const { name, code, description } = await req.json()

    if (!name?.trim() || !code?.trim()) {
      return NextResponse.json(
        { error: 'Name and Code are required' },
        { status: 400 }
      )
    }

    const existing = await CourseCategory.findOne({ name })
    if (existing)
      return NextResponse.json(
        { error: 'Category name already exists' },
        { status: 409 }
      )

    const newCategory = new CourseCategory({
      name: name.trim(),
      code: code.trim(),
      description: description?.trim(),
    })

    const saved = await newCategory.save()
    return NextResponse.json(saved, { status: 201 })
  } catch (error: any) {
    console.error('POST /categories error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
