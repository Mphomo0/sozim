'use client'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import Navbar from '@/components/global/Navbar'
import Footer from '@/components/global/Footer'

const ChatbotWidget = dynamic(
  () => import('@/components/sections/chatbot/ChatbotWidget'),
  { ssr: false },
)

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Dashboard pages handle their own layout internally
  const isDashboard = pathname?.startsWith('/dashboard') || false

  return (
    <>
      {!isDashboard && <Navbar />}
      <main>{children}</main>
      {!isDashboard && <Footer />}
      {!isDashboard && <ChatbotWidget />}
    </>
  )
}
