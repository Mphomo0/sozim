import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '../globals.css'
import Navbar from '@/components/global/Navbar'
import Footer from '@/components/global/Footer'

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
  title: 'Sozim Trading and Consultancy | Login',
  description:
    'Log in to your Sozim Trading and Consultancy account to access your dashboard, courses, and learner information.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <Navbar />
      {children}
      <Footer />
    </main>
  )
}
