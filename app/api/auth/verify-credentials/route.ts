// app/api/auth/verify-credentials/route.ts

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' // <-- Prisma is safe here (Node.js)
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // 1. Database Lookup
    const user = await prisma.user.findUnique({
      where: { email: email },
    })

    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // 2. Password Verification
    const isValid = await bcrypt.compare(String(password), user.password)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // 3. Return the necessary user data (without the password hash)
    return NextResponse.json({
      id: user.id,
      firstName: user.firstName,
      email: user.email,
      role: user.role,
    })
  } catch (error) {
    console.error('Verification API Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
