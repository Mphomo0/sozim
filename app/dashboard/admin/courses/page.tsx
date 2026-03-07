import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import CourseComponent from '@/components/sections/dashboard/admin/usersComponents/sozimCourses/CourseComponent'
import { DashboardPageLayout } from '@/components/sections/dashboard/DashboardPageLayout'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function CoursesPage() {
  let session

  try {
    session = await auth()
  } catch (error) {
    console.error('Authentication error:', error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <p className="text-xl text-red-600 font-medium">
          Authentication error. Please try again.
        </p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <p className="text-xl text-gray-700 font-medium">You are not authenticated.</p>
        <Link href="/login" passHref>
          <Button className="mt-6 bg-primary text-primary-foreground hover:opacity-90 transition-all duration-200 shadow-lg">
            Login
          </Button>
        </Link>
      </div>
    )
  }

  if (session.user?.role !== 'ADMIN') {
    redirect('/student')
  }

  return (
    <DashboardPageLayout
      title="Manage Courses"
      description="Configure and organize educational programs."
      breadcrumbs={[
        { label: 'Admin', href: '/dashboard/admin/courses' },
        { label: 'Courses' }
      ]}
    >
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
        <div className="p-8">
          <CourseComponent />
        </div>
      </div>
    </DashboardPageLayout>
  )
}
