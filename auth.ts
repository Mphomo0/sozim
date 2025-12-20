import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import Nodemailer from 'next-auth/providers/nodemailer'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import clientPromise from '@/lib/mongodb-client'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { DefaultSession } from 'next-auth'
import { AdapterUser } from 'next-auth/adapters'

interface AppUser {
  id: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  alternativeNumber?: string
  dob?: string
  idNumber?: string
  nationality?: string
  address?: string
  role?: string
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),

  // ✅ DATABASE SESSIONS
  session: {
    strategy: 'database',
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
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        await dbConnect()

        const user = await User.findOne({ email: credentials.email })
        if (!user) throw new Error('Invalid credentials')

        const isValid = await user.comparePassword(
          credentials.password as string
        )
        if (!isValid) throw new Error('Invalid credentials')

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
        } as AppUser
      },
    }),
  ],

  pages: {
    signIn: '/login',
  },

  callbacks: {
    /**
     * ✅ DATABASE SESSION CALLBACK
     * Runs on every request that calls auth() / useSession()
     */
    async session({ session, user }) {
      if (session.user && user && session.user.firstName) {
        session.user.id = user.id
        session.user.firstName = user.firstName
        session.user.lastName = user.lastName
        session.user.email = user.email
        session.user.phone = user.phone
        session.user.alternativeNumber = user.alternativeNumber
        session.user.dob = user.dob
        session.user.idNumber = user.idNumber
        session.user.nationality = user.nationality
        session.user.address = user.address
        session.user.role = user.role
      }
      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
})

declare module 'next-auth/adapters' {
  interface AdapterUser {
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    alternativeNumber?: string | null
    dob?: string | null
    idNumber?: string | null
    nationality?: string | null
    address?: string | null
    role?: string | null
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      firstName?: string | null
      lastName?: string | null
      email?: string | null
      phone?: string | null
      alternativeNumber?: string | null
      dob?: string | null
      idNumber?: string | null
      nationality?: string | null
      address?: string | null
      role?: string | null
    } & DefaultSession['user']
  }
}
