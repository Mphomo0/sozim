import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import CreateApplication from '@/components/sections/dashboard/admin/applications/CreateApplication'
import { DashboardPageLayout } from '@/components/sections/dashboard/DashboardPageLayout'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function NewApplicationPage() {
  const session = await auth()

  if (session?.user?.role !== 'ADMIN') {
    redirect('/student')
  }


  return (
    <DashboardPageLayout
      title="Add Application"
      description="Create a new student application record in the system."
      breadcrumbs={[
        { label: 'Admin', href: '/dashboard/admin/applications' },
        { label: 'Applications', href: '/dashboard/admin/applications' },
        { label: 'Add New' }
      ]}
      action={
        <Link href="/dashboard/admin/applications" passHref>
          <Button variant="outline" className="group flex items-center gap-2 border-primary/20 hover:bg-primary/5 transition-all">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Applications
          </Button>
        </Link>
      }
    >
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md w-full">
        <div className="p-4 md:p-8">
          <CreateApplication />
        </div>
      </div>
    </DashboardPageLayout>
  )
}
