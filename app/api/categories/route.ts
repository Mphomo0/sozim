import { NextResponse, NextRequest } from 'next/server'
import dbConnect from '@/lib/mongodb'
import CourseCategory from '@/models/CourseCategory'

export async function GET() {
  try {
    await dbConnect()
    const categories = await CourseCategory.find().lean()
    return NextResponse.json(categories, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('GET /categories error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

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

    const existing = await CourseCategory.findOne({ name }).lean()
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
  } catch (error: unknown) {
    console.error('POST /categories error:', error)

    let errorMessage = 'Internal server error'
    if (error instanceof Error) {
      errorMessage = error.message
    } else if (
      typeof error === 'object' &&
      error !== null &&
      'message' in error
    ) {
      errorMessage = (error as { message: string }).message
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
