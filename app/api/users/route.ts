import { NextResponse, NextRequest } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { auth } from '@/auth'

// POST /api/users to create a new user
export const POST = async (req: NextRequest) => {
  try {
    await dbConnect()
    const body = await req.json()

    const {
      firstName,
      lastName,
      phone,
      alternativeNumber,
      dob,
      idNumber,
      email,
      address,
      nationality,
      password,
      role,
    } = body

    if (
      !firstName ||
      !lastName ||
      !phone ||
      !alternativeNumber ||
      !dob ||
      !idNumber ||
      !email ||
      !address ||
      !nationality
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      )
    }

    const user = await User.create({
      firstName,
      lastName,
      phone,
      dob,
      alternativeNumber,
      idNumber,
      nationality,
      email,
      address,
      password,
      role,
    })

    const userObj = user.toObject()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...safeUser } = userObj

    return NextResponse.json(safeUser, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}

export const GET = auth(async function (req) {
  try {
    if (!req.auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 10
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit

    // Build query
    const query: any = {}
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ]
    }

    // Get total count
    const totalUsers = await User.countDocuments(query)

    // Apply pagination and search
    const users = await User.find(query).select('-password').skip(skip).limit(limit)

    const totalPages = Math.ceil(totalUsers / limit)

    return NextResponse.json(
      {
        users,
        totalUsers,
        totalPages,
        currentPage: page,
        limit,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Failed to load users' },
      { status: 500 }
    )
  }
})
