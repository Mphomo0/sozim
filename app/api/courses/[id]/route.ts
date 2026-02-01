import { NextResponse, NextRequest } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Course from '@/models/Course'
import { auth } from '@/auth'
import mongoose from 'mongoose'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect()

    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Course Id is required' },
        { status: 400 }
      )
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid Course ID format' },
        { status: 400 }
      )
    }

    const course = await Course.findById(id)
      .select('name code description duration isOpen categoryId level qualification modules creditTotals entryRequirements')
      .lean()

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    return NextResponse.json(
      { data: course },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    )
  } catch (error) {
    console.error('Error fetching Course:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Course' },
      { status: 500 }
    )
  }
}

export const PATCH = auth(async function (
  req,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await dbConnect()

    const { id } = await params
    const body = await req.json()

    const {
      name,
      code,
      description,
      fullDescription,
      duration,
      isOpen,
      categoryId,
      modules,
      creditTotals,
      entryRequirements,
      qualification,
      level,
    } = body

    const course = await Course.findById(id)
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    if (name && name.trim() !== course.name) {
      const exists = await Course.findOne({ name: name.trim() }).lean()
      if (exists) {
        return NextResponse.json(
          { error: 'A course with this name already exists.' },
          { status: 409 }
        )
      }
    }

    if (name !== undefined) course.name = name.trim()
    if (code !== undefined) course.code = code.trim()
    if (description !== undefined) course.description = description?.trim()
    if (fullDescription !== undefined)
      course.fullDescription = fullDescription?.trim()
    if (duration !== undefined) course.duration = duration.trim()
    if (categoryId !== undefined) course.categoryId = categoryId

    if (typeof isOpen === 'boolean') {
      course.isOpen = isOpen
    }

    if (qualification !== undefined) course.qualification = qualification.trim()
    if (level !== undefined) course.level = level.trim()

    if (modules) {
      if (modules.knowledgeModules)
        course.modules.knowledgeModules = modules.knowledgeModules

      if (modules.practicalSkillModules)
        course.modules.practicalSkillModules = modules.practicalSkillModules

      if (modules.workExperienceModules)
        course.modules.workExperienceModules = modules.workExperienceModules
    }

    if (creditTotals) {
      if (creditTotals.knowledge !== undefined)
        course.creditTotals.knowledge = creditTotals.knowledge

      if (creditTotals.practical !== undefined)
        course.creditTotals.practical = creditTotals.practical

      if (creditTotals.workExperience !== undefined)
        course.creditTotals.workExperience = creditTotals.workExperience

      if (creditTotals.total !== undefined)
        course.creditTotals.total = creditTotals.total
    }

    if (entryRequirements !== undefined) {
      course.entryRequirements = entryRequirements
    }

    const updated = await course.save()

    return NextResponse.json(updated, { status: 200 })
  } catch (error: unknown) {
    console.error('PATCH /courses error:', error)

    const message =
      error instanceof Error ? error.message : 'Internal server error'

    return NextResponse.json({ error: message }, { status: 500 })
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
