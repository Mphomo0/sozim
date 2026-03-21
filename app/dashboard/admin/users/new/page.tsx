import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import NewUser from '@/components/sections/dashboard/admin/usersComponents/NewUser'
import { DashboardPageLayout } from '@/components/sections/dashboard/DashboardPageLayout'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function NewUserPage() {
  const session = await auth()

  if (session?.user?.role !== 'ADMIN') {
    redirect('/student')
  }


  return (
    <DashboardPageLayout
      title="Add User"
      description="Register a new user account with specific roles and access."
      breadcrumbs={[
        { label: 'Admin', href: '/dashboard/admin/users' },
        { label: 'Users', href: '/dashboard/admin/users' },
        { label: 'Add New' }
      ]}
      action={
        <Link href="/dashboard/admin/users" passHref>
          <Button variant="outline" className="group flex items-center gap-2 border-primary/20 hover:bg-primary/5 transition-all">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Users
          </Button>
        </Link>
      }
    >
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md w-full">
        <div className="p-4 md:p-8">
          <NewUser />
        </div>
      </div>
    </DashboardPageLayout>
  )
}
