import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import User from '@/models/User'
import Application from '@/models/Application'
import dbConnect from '@/lib/mongodb'
import { Users, CheckCircle2, XCircle, Clock, TrendingUp, ArrowUpRight } from 'lucide-react'
import ApplicationStatusChart from '@/components/sections/dashboard/ApplicationStatusChart'
import ApplicationYearTrendChart from '@/components/sections/dashboard/ApplicationYearTrendChart'
import YearSelector from '@/components/sections/dashboard/YearSelector'
import { DashboardPageLayout } from '@/components/sections/dashboard/DashboardPageLayout'
import { Button } from '@/components/ui/button'

export const revalidate = 30

interface PageProps {
  searchParams: Promise<{ year?: string }>
}

interface StatusChartData {
  _id: number
  pending: number
  approved: number
  rejected: number
  count: number
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const session = await auth()

  if (!session || !session.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <p className="text-xl text-gray-700 font-medium">You are not authenticated.</p>
        <Link href="/login" passHref>
          <Button className="mt-6 bg-primary text-primary-foreground hover:opacity-90 transition-all duration-200 shadow-lg">
            Login to Dashboard
          </Button>
        </Link>
      </div>
    )
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/student')
  }

  await dbConnect()

  const currentYear = new Date().getFullYear()
  const params = await searchParams
  const selectedYear = Number(params?.year) || currentYear

  const startDate = new Date(selectedYear, 0, 1)
  const endDate = new Date(selectedYear + 1, 0, 1)

  const [totalUsers, totalApplications, totalPending, totalApproved, totalRejected] = await Promise.all([
    User.countDocuments({ role: 'USER' }),
    Application.countDocuments({ createdAt: { $gte: startDate, $lt: endDate } }),
    Application.countDocuments({ status: 'PENDING', createdAt: { $gte: startDate, $lt: endDate } }),
    Application.countDocuments({ status: 'APPROVED', createdAt: { $gte: startDate, $lt: endDate } }),
    Application.countDocuments({ status: 'REJECTED', createdAt: { $gte: startDate, $lt: endDate } }),
  ])

  const pendingPercent = totalApplications ? Math.round((totalPending / totalApplications) * 100) : 0
  const approvedPercent = totalApplications ? Math.round((totalApproved / totalApplications) * 100) : 0
  const rejectedPercent = totalApplications ? Math.round((totalRejected / totalApplications) * 100) : 0

  const yearTrendRaw = await Application.aggregate([
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

  const yearTrend: StatusChartData[] = yearTrendRaw.map((y: any) => ({
    _id: y._id,
    pending: y.pending,
    approved: y.approved,
    rejected: y.rejected,
    count: y.count,
  }))

  const statusChartData: StatusChartData[] = [
    {
      _id: selectedYear,
      pending: totalPending,
      approved: totalApproved,
      rejected: totalRejected,
      count: totalPending + totalApproved + totalRejected,
    },
  ]

  return (
    <DashboardPageLayout
      title="Dashboard Overview"
      description={`Real-time insights and application metrics for ${selectedYear}.`}
      breadcrumbs={[{ label: 'Analytics' }]}
      action={
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Filter Year:</span>
          <YearSelector currentYear={currentYear} selectedYear={selectedYear} />
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users Card */}
        <div className="group relative bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="w-16 h-16 text-blue-600" />
          </div>
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="inline-flex p-2 rounded-lg bg-blue-50 text-blue-600 mb-4 items-center gap-2">
                <Users className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Metrics</span>
              </div>
              <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900">{totalUsers}</span>
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Growth
                </span>
              </div>
            </div>
            <div className="mt-6 flex items-center text-xs text-gray-400 group-hover:text-blue-600 transition-colors">
              <span>View all users</span>
              <ArrowUpRight className="w-3 h-3 ml-1" />
            </div>
          </div>
        </div>

        {/* Pending Card */}
        <div className="group bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex flex-col h-full">
            <div className="inline-flex p-2 rounded-lg bg-amber-50 text-amber-600 mb-4 w-fit">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-medium text-gray-500">Pending Applications</h3>
            <div className="mt-2 text-4xl font-bold text-gray-900">{totalPending}</div>
            <div className="mt-auto pt-6">
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)] transition-all duration-1000 ease-out"
                  style={{ width: `${pendingPercent}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs font-medium">
                <span className="text-gray-400">Current Status</span>
                <span className="text-amber-600">{pendingPercent}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Approved Card */}
        <div className="group bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex flex-col h-full">
            <div className="inline-flex p-2 rounded-lg bg-emerald-50 text-emerald-600 mb-4 w-fit">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-medium text-gray-500">Approved Applications</h3>
            <div className="mt-2 text-4xl font-bold text-gray-900">{totalApproved}</div>
            <div className="mt-auto pt-6">
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] transition-all duration-1000 ease-out"
                  style={{ width: `${approvedPercent}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs font-medium">
                <span className="text-gray-400">Success Rate</span>
                <span className="text-emerald-600">{approvedPercent}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rejected Card */}
        <div className="group bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex flex-col h-full">
            <div className="inline-flex p-2 rounded-lg bg-rose-50 text-rose-600 mb-4 w-fit">
              <XCircle className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-medium text-gray-500">Rejected Applications</h3>
            <div className="mt-2 text-4xl font-bold text-gray-900">{totalRejected}</div>
            <div className="mt-auto pt-6">
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)] transition-all duration-1000 ease-out"
                  style={{ width: `${rejectedPercent}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs font-medium">
                <span className="text-gray-400">Rejection Rate</span>
                <span className="text-rose-600">{rejectedPercent}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Application Breakdown</h2>
              <p className="text-sm text-gray-500">Status distribution for {selectedYear}</p>
            </div>
          </div>
          <div className="h-[350px]">
            <ApplicationStatusChart data={statusChartData} year={selectedYear} />
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Historical Trends</h2>
              <p className="text-sm text-gray-500">Year-over-year application volume</p>
            </div>
          </div>
          <div className="h-[350px]">
            <ApplicationYearTrendChart data={yearTrend} />
          </div>
        </div>
      </div>
    </DashboardPageLayout>
  )
}
