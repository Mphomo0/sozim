import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Breadcrumb from '@/components/global/Breadcrumb'
import { getBreadcrumbSchema } from '@/lib/seo/schemas'

const BASE_URL = 'https://www.sozim.co.za'

export const metadata: Metadata = {
  title: 'Student Portal | Coming Soon - Sozim Trading and Consultancy',
  description: 'The new Sozim Trading student portal is launching soon. Access your courses, track progress, and manage your learning journey all in one place.',
  keywords: [
    'student portal Sozim',
    'learning management system',
    'online learning platform',
    'course access portal',
    'student dashboard',
    'trading education platform',
    'progress tracking',
  ],
  openGraph: {
    title: 'Student Portal | Coming Soon - Sozim Trading and Consultancy',
    description: 'The new Sozim Trading student portal is launching soon. Access your courses, track progress, and manage your learning journey all in one place.',
    url: `${BASE_URL}/portal`,
  },
  alternates: {
    canonical: `${BASE_URL}/portal`,
  },
}

export default function PortalPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Student Portal', url: `${BASE_URL}/portal` },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Breadcrumb />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Coming Soon
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
            Student Portal
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            We're building something extraordinary. Your personalized learning hub 
            is almost here - with course access, progress tracking, and more.
          </p>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl p-8 md:p-12 mb-12">
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="space-y-3">
                <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold">Course Access</h3>
                <p className="text-slate-400 text-sm">Access all your enrolled courses materials, lessons, and resources in one place.</p>
              </div>
              <div className="space-y-3">
                <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold">Progress Tracking</h3>
                <p className="text-slate-400 text-sm">Monitor your learning journey with detailed progress indicators and analytics.</p>
              </div>
              <div className="space-y-3">
                <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold">Community</h3>
                <p className="text-slate-400 text-sm">Connect with fellow students, share insights, and grow together.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild className="text-lg h-14 px-8 rounded-full bg-blue-600 hover:bg-blue-700">
              <Link href="/apply">
                Apply for a Course <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>

          <p className="mt-8 text-slate-500 text-sm">
            Have questions?{' '}
            <Link href="/contact" className="text-blue-400 hover:text-blue-300 underline underline-offset-4">
              Contact our team
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
