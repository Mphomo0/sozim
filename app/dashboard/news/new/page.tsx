import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { NewsPostEditor } from '@/components/sections/dashboard/news/NewsPostEditor'
import { DashboardPageLayout } from '@/components/sections/dashboard/DashboardPageLayout'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function NewNewsPostPage() {
  const session = await auth()

  if (session?.user?.role !== 'ADMIN') {
    redirect('/student')
  }

  return (
    <DashboardPageLayout
      title="Create New Article"
      description="Write and publish a news article."
      breadcrumbs={[
        { label: 'Admin', href: '/dashboard/news' },
        { label: 'News', href: '/dashboard/news' },
        { label: 'New Article' }
      ]}
      action={
        <Link href="/dashboard/news" passHref>
          <Button variant="outline" className="group flex items-center gap-2 border-primary/20 hover:bg-primary/5 transition-all">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Articles
          </Button>
        </Link>
      }
    >
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md w-full">
        <div className="p-4 md:p-8">
          <NewsPostEditor />
        </div>
      </div>
    </DashboardPageLayout>
  )
}
