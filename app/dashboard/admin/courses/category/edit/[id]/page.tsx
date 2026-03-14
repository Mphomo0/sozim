import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { EditCategory } from '@/components/sections/dashboard/admin/usersComponents/sozimCourses/categories/EditCategory'
import { DashboardPageLayout } from '@/components/sections/dashboard/DashboardPageLayout'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function EditCategoryPage() {
  const session = await auth()

  if (session?.user?.role !== 'ADMIN') {
    redirect('/student')
  }



  return (
    <DashboardPageLayout
      title="Edit Category"
      description="Update category name, code or description."
      breadcrumbs={[
        { label: 'Admin', href: '/dashboard/admin/courses' },
        { label: 'Categories', href: '/dashboard/admin/courses/category' },
        { label: 'Edit Category' }
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
          <EditCategory />
        </div>
      </div>
    </DashboardPageLayout>
  )
}
