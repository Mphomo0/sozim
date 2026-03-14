import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import EditApplication from '@/components/sections/dashboard/admin/applications/EditApplication'
import { DashboardPageLayout } from '@/components/sections/dashboard/DashboardPageLayout'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ApplicationAdminEditPage() {
  const session = await auth()

  if (session?.user?.role !== 'ADMIN') {
    redirect('/student')
  }


  return (
    <DashboardPageLayout
      title="Edit Application"
      description="Update student application details and status."
      breadcrumbs={[
        { label: 'Admin', href: '/dashboard/admin/applications' },
        { label: 'Applications', href: '/dashboard/admin/applications' },
        { label: 'Edit' }
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
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
        <div className="p-8">
          <EditApplication />
        </div>
      </div>
    </DashboardPageLayout>
  )
}
