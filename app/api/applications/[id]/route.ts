import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Application from '@/models/Application'
import { auth } from '@/auth'

export const GET = auth(async function (
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
        { error: 'Application ID is required' },
        { status: 400 }
      )
    }
    const app = await Application.findById(id).populate('applicantId courseId')

    if (!app) {
      return Response.json({ error: 'Application not found' }, { status: 404 })
    }

    return Response.json(app)
  } catch (error) {
    console.error('Error displaying application:', error)
    return NextResponse.json(
      { error: 'Failed to display application' },
      { status: 500 }
    )
  }
})

export const PUT = auth(async function (
  req,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!req.auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    // Extract course ID from the request URL params
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      )
    }

    const body = await req.json()

    const updated = await Application.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    )

    if (!updated) {
      return Response.json({ error: 'Application not found' }, { status: 404 })
    }

    return Response.json(updated)
  } catch (error) {
    console.error('Error updating application:', error)
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    )
  }
})

export const DELETE = auth(async function (
  req,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect()

    // Extract course ID from the request URL params
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      )
    }

    const app = await Application.findById(id)

    if (!app) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    await Application.findByIdAndDelete(id)

    return NextResponse.json({
      message: 'Application deleted successfully',
      documents: app.documents || [],
    })
  } catch (error) {
    console.error('Error deleting application:', error)
    return NextResponse.json(
      { error: 'Failed to delete application' },
      { status: 500 }
    )
  }
})
