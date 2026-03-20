import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getConvexClient } from '@/lib/convex-client'
import { api } from '@/convex/_generated/api'
import ApplicationStatusChart from '@/components/sections/dashboard/ApplicationStatusChart'
import ApplicationYearTrendChart from '@/components/sections/dashboard/ApplicationYearTrendChart'
import YearSelector from '@/components/sections/dashboard/YearSelector'
import { DashboardPageLayout } from '@/components/sections/dashboard/DashboardPageLayout'
import { Button } from '@/components/ui/button'
import DashboardStatsGrid from '@/components/sections/dashboard/DashboardStatsGrid'

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
  // Manual check removed as it's now handled by middleware

  if (session.user.role !== 'ADMIN') {
    redirect('/student')
  }


  const currentYear = new Date().getFullYear()
  const params = await searchParams
  const selectedYear = Number(params?.year) || currentYear

  const stats = await getConvexClient()!.query(api.applications.getDashboardStats, { year: selectedYear })

  const totalUsers = stats?.totalUsers || 0
  const totalApplications = stats?.totalApplications || 0
  const totalPending = stats?.totalPending || 0
  const totalApproved = stats?.totalApproved || 0
  const totalRejected = stats?.totalRejected || 0

  const pendingPercent = totalApplications ? Math.round((totalPending / totalApplications) * 100) : 0
  const approvedPercent = totalApplications ? Math.round((totalApproved / totalApplications) * 100) : 0
  const rejectedPercent = totalApplications ? Math.round((totalRejected / totalApplications) * 100) : 0

  const yearTrend: StatusChartData[] = (stats?.yearTrend || []).map((y: { _id: number; pending: number; approved: number; rejected: number; count: number }) => ({
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
      <DashboardStatsGrid
        totalUsers={totalUsers}
        totalPending={totalPending}
        totalApproved={totalApproved}
        totalRejected={totalRejected}
        pendingPercent={pendingPercent}
        approvedPercent={approvedPercent}
        rejectedPercent={rejectedPercent}
      />

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
