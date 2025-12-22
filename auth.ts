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

  // ✅ JWT strategy is necessary for Credentials and efficient role-based routing
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

        if (!user) throw new Error('No account found with this email')

        const isValid = await user.comparePassword(credentials.password as string)
        if (!isValid) throw new Error('Incorrect password')

        // ✅ We return a flat object where all types match the NextAuth 'User' interface.
        // Important: dob must be a string to avoid the Date vs String TypeScript error.
        return {
          id: user._id.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          alternativeNumber: user.alternativeNumber,
          dob: user.dob instanceof Date ? user.dob.toISOString() : user.dob, 
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
     * ✅ JWT CALLBACK
     * This saves the data from 'authorize' into the encrypted cookie.
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
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
     * ✅ SESSION CALLBACK
     * This makes the data available when you call 'await auth()' in your app.
     */
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.firstName = token.firstName
        session.user.lastName = token.lastName
        session.user.phone = token.phone
        session.user.alternativeNumber = token.alternativeNumber
        session.user.dob = token.dob
        session.user.idNumber = token.idNumber
        session.user.nationality = token.nationality
        session.user.address = token.address
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
// This tells TypeScript that these extra fields exist on the Session and User objects.

declare module 'next-auth' {
  interface Session {
    user: {
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
    } & DefaultSession['user']
  }

  interface User {
    id?: string
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
