import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import CourseComponent from '@/components/sections/dashboard/admin/usersComponents/sozimCourses/CourseComponent'
import { DashboardPageLayout } from '@/components/sections/dashboard/DashboardPageLayout'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function CoursesPage() {
  const session = await auth()

  if (session?.user?.role !== 'ADMIN') {
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
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md w-full">
        <div className="p-4 md:p-8">
          <CourseComponent />
        </div>
      </div>
    </DashboardPageLayout>
  )
}
