import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
  title: 'Dashboard | Sozim Trading and Consultancy',
  description:
    'Access your learner dashboard, courses, progress, and account details at Sozim Trading and Consultancy.',
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      {children}
    </main>
  )
}
