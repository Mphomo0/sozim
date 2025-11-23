import { AppSidebar } from '@/components/sections/dashboard/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import NewUser from '@/components/sections/dashboard/admin/usersComponents/NewUser'

export default async function DashboardPage() {
  let session

  try {
    session = await auth()
  } catch (error) {
    console.error('Authentication error:', error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <p className="text-xl text-red-600">
          Authentication error. Please try again.
        </p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <p className="text-xl text-gray-700">You are not authenticated.</p>
        <Link href="/login" passHref>
          <Button className="mt-4 bg-black text-white hover:bg-gray-800 transition duration-200">
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
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">
                    Sozim Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Add New User</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4 pt-0">
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min">
            <div className="py-2 p-8">
              <div className="flex justify-between items-center w-3/4 mx-auto mt-8">
                <h1 className="text-2xl font-bold mt-16 mb-16">
                  Admin: Add User
                </h1>
                <Link
                  href={'/dashboard/admin/users'}
                  className="px-4 py-2 bg-blue-900 font-semibold text-white rounded"
                >
                  Back to Users
                </Link>
              </div>
              <NewUser />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
