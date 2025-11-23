import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

// Define proper types for our user
interface AppUser {
  id: string
  firstName?: string
  lastName?: string
  email?: string
  role?: string
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
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
        token.email = user.email
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
      role?: string | null
    }
  }
}
