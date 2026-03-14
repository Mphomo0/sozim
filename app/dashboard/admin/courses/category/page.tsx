import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import CourseCategoryTable from '@/components/sections/dashboard/admin/usersComponents/sozimCourses/CourseCategoryTable'
import { DashboardPageLayout } from '@/components/sections/dashboard/DashboardPageLayout'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function CourseCategoryPage() {
  const session = await auth()

  if (session?.user?.role !== 'ADMIN') {
    redirect('/student')
  }


  return (
    <DashboardPageLayout
      title="Course Categories"
      description="Manage and organize course departments and groupings."
      breadcrumbs={[
        { label: 'Admin', href: '/dashboard/admin/courses' },
        { label: 'Courses', href: '/dashboard/admin/courses' },
        { label: 'Categories' }
      ]}
      action={
        <Link href="/dashboard/admin/courses" passHref>
          <Button variant="outline" className="group flex items-center gap-2 border-primary/20 hover:bg-primary/5 transition-all">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Courses
          </Button>
        </Link>
      }
    >
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
        <div className="p-8">
          <CourseCategoryTable />
        </div>
      </div>
    </DashboardPageLayout>
  )
}
