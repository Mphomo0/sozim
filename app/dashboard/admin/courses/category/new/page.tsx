import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { CreateCategory } from '@/components/sections/dashboard/admin/usersComponents/sozimCourses/categories/CreateCategory'
import { DashboardPageLayout } from '@/components/sections/dashboard/DashboardPageLayout'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function NewCategoryPage() {
  const session = await auth()

  if (session?.user?.role !== 'ADMIN') {
    redirect('/student')
  }



  return (
    <DashboardPageLayout
      title="Create New Category"
      description="Add a new classification for courses."
      breadcrumbs={[
        { label: 'Admin', href: '/dashboard/admin/courses' },
        { label: 'Categories', href: '/dashboard/admin/courses/category' },
        { label: 'New Category' }
      ]}
      action={
        <Link href="/dashboard/admin/courses/category" passHref>
          <Button variant="outline" className="group flex items-center gap-2 border-primary/20 hover:bg-primary/5 transition-all">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Categories
          </Button>
        </Link>
      }
    >
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
        <div className="p-8 max-w-4xl">
          <CreateCategory />
        </div>
      </div>
    </DashboardPageLayout>
  )
}
