import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import NewsPostList from '@/components/sections/dashboard/news/NewsPostList'
import { DashboardPageLayout } from '@/components/sections/dashboard/DashboardPageLayout'

export const dynamic = 'force-dynamic'

export default async function NewsPage() {
  const session = await auth()

  if (session?.user?.role !== 'ADMIN') {
    redirect('/student')
  }

  return (
    <DashboardPageLayout
      title="News Articles"
      description="Create and manage news articles for the website."
      breadcrumbs={[
        { label: 'Admin', href: '/dashboard/news' },
        { label: 'News' }
      ]}
    >
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md w-full">
        <div className="p-4 md:p-8">
          <NewsPostList />
        </div>
      </div>
    </DashboardPageLayout>
  )
}
