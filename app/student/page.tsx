import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import ProfileCard from '@/components/sections/students/ProfileCard'
import ApplicationStatusCard from '@/components/sections/students/ApplicationStatusCard'
import NewApplicationCard from '@/components/sections/students/NewApplicationCard'
export const dynamic = 'force-dynamic'

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

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Section */}
        <ProfileCard />

        {/* New Application Section */}
        <NewApplicationCard />
      </div>
      {/* Applications Status Section */}
      <ApplicationStatusCard />
    </div>
  )
}
