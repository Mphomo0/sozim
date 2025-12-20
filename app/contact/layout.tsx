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
  title: 'Contact Us',
  description:
    'Get in touch with Sozim Trading and Consultancy for course inquiries, training programs, or professional consultancy services.',
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
