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
  title: 'Career Pathways | Build Your Future with Sozim',
  description:
    'Discover career pathways at Sozim Training Institute. Learn how our courses and learnerships help you progress from training to employment.',
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
