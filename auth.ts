import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import Nodemailer from 'next-auth/providers/nodemailer'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import clientPromise from '@/lib/mongodb-client'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

// Define proper types for our user
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
  session: { strategy: 'jwt' },
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
          throw new Error('Email and password are required')
        }
        // Connect to MongoDB
        await dbConnect()
        // Find user by email
        const user = await User.findOne({ email: credentials.email })
        if (!user) throw new Error('No user found')
        // Verify password
        const isValid = await user.comparePassword(
          credentials.password as string
        )
        if (!isValid) throw new Error('Invalid password')

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
    async session({ session, token }) {
      // Add properties to session from token
      if (session.user) {
        session.user.id = token.id as string
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
        session.user.email = token.email as string
        session.user.phone = token.phone as string
        session.user.alternativeNumber = token.alternativeNumber as string
        session.user.dob = token.dob as string
        session.user.idNumber = token.idNumber as string
        session.user.nationality = token.nationality as string
        session.user.address = token.address as string
        session.user.role = token.role as string
      }
      return session
    },
    async jwt({ token, user }) {
      // Add properties from user to token when signing in
      if (user) {
        token.id = user.id
        token.firstName = (user as AppUser).firstName
        token.lastName = (user as AppUser).lastName
        token.email = (user as AppUser).email
        token.phone = (user as AppUser).phone
        token.alternativeNumber = (user as AppUser).alternativeNumber
        token.dob = (user as AppUser).dob
        token.idNumber = (user as AppUser).idNumber
        token.nationality = (user as AppUser).nationality
        token.address = (user as AppUser).address
        token.role = (user as AppUser).role
      }
      return token
    },
  },
  secret: process.env.AUTH_SECRET,
})

// Extend the built-in session types
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
    }
  }

  // Extend the built-in User type for cleaner JWT callback
  interface User extends AppUser {}
}
