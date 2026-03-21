import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import AllUsers from '@/components/sections/dashboard/admin/usersComponents/AllUsers'
import { DashboardPageLayout } from '@/components/sections/dashboard/DashboardPageLayout'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const session = await auth()

  if (session?.user?.role !== 'ADMIN') {
    redirect('/student')
  }

  return (
    <DashboardPageLayout
      title="Manage Users"
      description="View, edit, and manage all registered users in the system."
      breadcrumbs={[
        { label: 'Admin', href: '/dashboard/admin/users' },
        { label: 'Users' }
      ]}
    >
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md w-full">
        <div className="p-4 md:p-8">
          <AllUsers />
        </div>
      </div>
    </DashboardPageLayout>
  )
}
