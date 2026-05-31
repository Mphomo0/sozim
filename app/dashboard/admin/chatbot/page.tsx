import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { DashboardPageLayout } from '@/components/sections/dashboard/DashboardPageLayout'
import ChatbotManager from '@/components/sections/dashboard/admin/ChatbotManager'

export const dynamic = 'force-dynamic'

export default async function ChatbotAdminPage() {
  const session = await auth()

  if (session?.user?.role !== 'ADMIN') {
    redirect('/student')
  }

  return (
    <DashboardPageLayout
      title="Chatbot Manager"
      description="Manage the Sozim AI chatbot and website content indexing."
      breadcrumbs={[
        { label: 'Admin', href: '/dashboard/admin/chatbot' },
        { label: 'Chatbot' },
      ]}
    >
      <ChatbotManager />
    </DashboardPageLayout>
  )
}
