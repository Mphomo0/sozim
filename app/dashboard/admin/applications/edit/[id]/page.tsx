import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import EditApplication from '@/components/sections/dashboard/admin/applications/EditApplication'
import { DashboardPageLayout } from '@/components/sections/dashboard/DashboardPageLayout'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ApplicationAdminEditPage() {
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
