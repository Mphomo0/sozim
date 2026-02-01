import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
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

    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      )
    }

    const user = await User.findById(id)
      .select('firstName lastName email phone alternativeNumber dob idNumber nationality address role applications createdAt updatedAt')
      .lean()

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    console.error('Failed to fetch user:', error)
    return NextResponse.json(
      { message: 'Failed to fetch user' },
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

    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { message: 'User ID is required in the URL' },
        { status: 400 }
      )
    }

    const data = await req.json()

    if (data.password) {
      const salt = await bcrypt.genSalt(10)
      data.password = await bcrypt.hash(data.password, salt)
    }

    const updatedUser = await User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).select('firstName lastName email phone alternativeNumber dob idNumber nationality address role applications createdAt updatedAt')

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(updatedUser, { status: 200 })
  } catch (error) {
    console.error('Failed to update user:', error)
    return NextResponse.json(
      { message: 'Failed to update user' },
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
        { message: 'User ID is required' },
        { status: 400 }
      )
    }

    const user = await User.findByIdAndDelete(id)

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { message: 'Failed to delete user' },
      { status: 500 }
    )
  }
})
