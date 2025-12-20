import { AppSidebar } from '@/components/sections/dashboard/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import User from '@/models/User'
import Application from '@/models/Application'
import dbConnect from '@/lib/mongodb'
export const dynamic = 'force-dynamic'
import { Users, CheckCircle2, XCircle, Clock } from 'lucide-react'
import ApplicationStatusChart from '@/components/sections/dashboard/ApplicationStatusChart'
import ApplicationYearTrendChart from '@/components/sections/dashboard/ApplicationYearTrendChart'
import YearSelector from '@/components/sections/dashboard/YearSelector'

interface PageProps {
  searchParams: Promise<{ year?: string }>
}

// Type for chart data
interface StatusChartData {
  _id: number
  pending: number
  approved: number
  rejected: number
  count: number
}

export default async function DashboardPage({ searchParams }: PageProps) {
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

  await dbConnect()

  // --- Year Filter ---
  const currentYear = new Date().getFullYear()
  const params = await searchParams
  const selectedYear = Number(params?.year) || currentYear

  const startDate = new Date(selectedYear, 0, 1)
  const endDate = new Date(selectedYear + 1, 0, 1)

  // --- Year-filtered analytics ---
  const totalUsers = await User.countDocuments({ role: 'USER' })

  const totalApplications = await Application.countDocuments({
    createdAt: { $gte: startDate, $lt: endDate },
  })

  const totalPending = await Application.countDocuments({
    status: 'PENDING',
    createdAt: { $gte: startDate, $lt: endDate },
  })

  const totalApproved = await Application.countDocuments({
    status: 'APPROVED',
    createdAt: { $gte: startDate, $lt: endDate },
  })

  const totalRejected = await Application.countDocuments({
    status: 'REJECTED',
    createdAt: { $gte: startDate, $lt: endDate },
  })

  // Percentages
  const pendingPercent = totalApplications
    ? Math.round((totalPending / totalApplications) * 100)
    : 0
  const approvedPercent = totalApplications
    ? Math.round((totalApproved / totalApplications) * 100)
    : 0
  const rejectedPercent = totalApplications
    ? Math.round((totalRejected / totalApplications) * 100)
    : 0

  // --- Chart Data ---
  const statusChartData: StatusChartData[] = [
    {
      _id: selectedYear,
      pending: totalPending,
      approved: totalApproved,
      rejected: totalRejected,
      count: totalPending + totalApproved + totalRejected,
    },
  ]

  // Multi-year trend aggregation
  const yearTrendRaw: {
    _id: number
    count: number
    pending: number
    approved: number
    rejected: number
  }[] = await Application.aggregate([
    // <--- Type added here
    {
      $group: {
        _id: { $year: '$createdAt' },
        count: { $sum: 1 },
        pending: { $sum: { $cond: [{ $eq: ['$status', 'PENDING'] }, 1, 0] } },
        approved: { $sum: { $cond: [{ $eq: ['$status', 'APPROVED'] }, 1, 0] } },
        rejected: { $sum: { $cond: [{ $eq: ['$status', 'REJECTED'] }, 1, 0] } },
      },
    },
    { $sort: { _id: 1 } },
  ])

  const yearTrend: StatusChartData[] = yearTrendRaw.map((y) => ({
    _id: y._id,
    pending: y.pending,
    approved: y.approved,
    rejected: y.rejected,
    count: y.count,
  }))

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">
                    Sozim Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Analytics</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
          {/* Year Dropdown */}
          <div className="flex justify-end">
            <YearSelector
              currentYear={currentYear}
              selectedYear={selectedYear}
            />
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Users */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center gap-4">
                <Users className="w-10 h-10 text-blue-600" />
                <div>
                  <p className="text-xl font-semibold">{totalUsers}</p>
                  <p className="text-gray-500 mt-1">Total Users</p>
                </div>
              </div>
            </div>

            {/* Pending */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center gap-4">
                <Clock className="w-10 h-10 text-yellow-500" />
                <div>
                  <p className="text-xl font-semibold">{totalPending}</p>
                  <p className="text-gray-500 mt-1">Pending</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 h-3 rounded-full mt-4">
                <div
                  className="h-3 rounded-full bg-yellow-500"
                  style={{ width: `${pendingPercent}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {pendingPercent}% ({selectedYear})
              </p>
            </div>

            {/* Approved */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center gap-4">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
                <div>
                  <p className="text-xl font-semibold">{totalApproved}</p>
                  <p className="text-gray-500 mt-1">Approved</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 h-3 rounded-full mt-4">
                <div
                  className="h-3 rounded-full bg-green-600"
                  style={{ width: `${approvedPercent}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {approvedPercent}% ({selectedYear})
              </p>
            </div>

            {/* Rejected */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center gap-4">
                <XCircle className="w-10 h-10 text-red-600" />
                <div>
                  <p className="text-xl font-semibold">{totalRejected}</p>
                  <p className="text-gray-500 mt-1">Rejected</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 h-3 rounded-full mt-4">
                <div
                  className="h-3 rounded-full bg-red-600"
                  style={{ width: `${rejectedPercent}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {rejectedPercent}% ({selectedYear})
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="bg-white p-6 rounded-xl shadow-md mt-6">
            <h2 className="text-lg font-semibold mb-4">
              Application Status ({selectedYear})
            </h2>
            <ApplicationStatusChart
              data={statusChartData}
              year={selectedYear}
            />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md mt-6">
            <h2 className="text-lg font-semibold mb-4">
              Applications Over Years
            </h2>
            <ApplicationYearTrendChart data={yearTrend} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
