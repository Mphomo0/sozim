import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import Nodemailer from 'next-auth/providers/nodemailer'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import clientPromise from '@/lib/mongodb-client'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { DefaultSession } from 'next-auth'
import { JWT } from 'next-auth/jwt'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),

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
          .select('firstName lastName email phone alternativeNumber dob idNumber nationality address password role')

        if (!user) throw new Error('No account found')

        const isValid = await user.comparePassword(
          credentials.password as string
        )
        if (!isValid) throw new Error('Incorrect password')

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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.role = user.role
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.phone = user.phone
        token.alternativeNumber = user.alternativeNumber
        token.dob = user.dob ? new Date(user.dob).toISOString() : null
        token.idNumber = user.idNumber
        token.nationality = user.nationality
        token.address = user.address
      }
      return token
    },

    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string
        session.user.role = token.role as string | null
        session.user.firstName = token.firstName as string | null
        session.user.lastName = token.lastName as string | null
        session.user.phone = token.phone as string | null
        session.user.alternativeNumber = token.alternativeNumber as
          | string
          | null
        session.user.dob = token.dob ? new Date(token.dob) : null
        session.user.idNumber = token.idNumber as string | null
        session.user.nationality = token.nationality as string | null
        session.user.address = token.address as string | null
      }
      return session
    },
  },

  pages: {
    signIn: '/login',
  },

  secret: process.env.NEXTAUTH_SECRET,
})

// --- Type Augmentation ---

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role?: string | null
      firstName?: string | null
      lastName?: string | null
      phone?: string | null
      alternativeNumber?: string | null
      dob?: Date | null
      idNumber?: string | null
      nationality?: string | null
      address?: string | null
    } & DefaultSession['user']
  }

  interface User {
    id?: string
    role?: string | null
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    alternativeNumber?: string | null
    dob?: Date | null
    idNumber?: string | null
    nationality?: string | null
    address?: string | null
  }
}

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
