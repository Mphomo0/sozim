import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import Nodemailer from 'next-auth/providers/nodemailer'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import clientPromise from '@/lib/mongodb-client'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { DefaultSession } from 'next-auth'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),

  // ✅ JWT Strategy is recommended for Credentials & Role-based access
  session: {
    strategy: 'jwt',
  },

  providers: [
    Nodemailer({
      server: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      from: process.env.EMAIL_FROM,
    }),

    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        await dbConnect()
        const user = await User.findOne({ email: credentials.email })

        if (!user) throw new Error('No user found with this email')

        const isValid = await user.comparePassword(credentials.password as string)
        if (!isValid) throw new Error('Incorrect password')

        // This object is passed to the JWT callback
        return {
          id: user._id.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          alternativeNumber: user.alternativeNumber,
          dob: user.dob,
          idNumber: user.idNumber,
          nationality: user.nationality,
          address: user.address,
          role: user.role,
        }
      },
    }),
  ],

  callbacks: {
    /**
     * 1. JWT Callback: Runs when the token is created (sign in) or updated.
     * Persists user data into the encrypted cookie.
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.phone = user.phone
        token.alternativeNumber = user.alternativeNumber
        token.dob = user.dob
        token.idNumber = user.idNumber
        token.nationality = user.nationality
        token.address = user.address
      }
      return token
    },

    /**
     * 2. Session Callback: Runs whenever the session is checked.
     * Exposes the data from the token to your frontend/Server Components.
     */
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
        session.user.phone = token.phone as string
        session.user.alternativeNumber = token.alternativeNumber as string
        session.user.dob = token.dob as string
        session.user.idNumber = token.idNumber as string
        session.user.nationality = token.nationality as string
        session.user.address = token.address as string
      }
      return session
    },
  },

  pages: {
    signIn: '/login',
  },

  secret: process.env.NEXTAUTH_SECRET,
})

// --- TypeScript Module Augmentation ---

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      firstName?: string | null
      lastName?: string | null
      role?: string | null
      phone?: string | null
      alternativeNumber?: string | null
      dob?: string | null
      idNumber?: string | null
      nationality?: string | null
      address?: string | null
    } & DefaultSession['user']
  }

  interface User {
    role?: string | null
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    alternativeNumber?: string | null
    dob?: string | null
    idNumber?: string | null
    nationality?: string | null
    address?: string | null
  }
}

import { JWT } from 'next-auth/jwt'

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role?: string | null
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    alternativeNumber?: string | null
    dob?: string | null
    idNumber?: string | null
    nationality?: string | null
    address?: string | null
  }
}
