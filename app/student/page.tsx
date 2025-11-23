import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import User from '@/models/User'
import Application from '@/models/Application'
import dbConnect from '@/lib/mongodb'
import ProfileCard from '@/components/sections/students/ProfileCard'
import ApplicationStatusCard from '@/components/sections/students/ApplicationStatusCard'
// import NewApplicationCard from '@/components/sections/students/NewApplicationCard'

export default async function StudentPage() {
  // Authenticate user
  let session
  try {
    session = await auth()
  } catch (err) {
    console.error('Authentication error:', err)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">Authentication error. Please try again.</p>
      </div>
    )
  }

  if (!session) {
    redirect('/login')
  }

  if (session.user?.role !== 'USER') {
    redirect('/dashboard') // Admin goes to admin dashboard
  }

  await dbConnect()

  // Fetch student info
  const student = await User.findById(session.user.id).lean()

  // Fetch student's applications
  const applications = await Application.find({ user: session.user.id })
    .sort({ createdAt: -1 })
    .lean()

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Section */}
        <ProfileCard />

        {/* Applications Status Section */}
        <ApplicationStatusCard />
      </div>

      {/* New Application Section */}
      {/* <NewApplicationCard studentId={session.user.id} /> */}
    </div>
  )
}
