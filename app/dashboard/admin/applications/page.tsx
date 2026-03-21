import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ListApplications from '@/components/sections/dashboard/admin/applications/ListApplications'
import { DashboardPageLayout } from '@/components/sections/dashboard/DashboardPageLayout'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function ApplicationAdminPage() {
  const session = await auth()

  if (session?.user?.role !== 'ADMIN') {
    redirect('/student')
  }


  if (session.user?.role !== 'ADMIN') {
    redirect('/student')
  }

  return (
    <DashboardPageLayout
      title="Applications"
      description="Review and manage all student applications."
      breadcrumbs={[
        { label: 'Admin', href: '/dashboard/admin/applications' },
        { label: 'Applications' }
      ]}
    >
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md w-full">
        <div className="p-4 md:p-8">
          <ListApplications />
        </div>
      </div>
    </DashboardPageLayout>
  )
}
