"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href: string
}

function getBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []

  const labelMap: Record<string, string> = {
    about: 'About Us',
    courses: 'Our Programs',
    'career-pathway': 'Career Pathways',
    contact: 'Contact Us',
    'contact-learning': 'Enquire About Learning',
    campus: 'Our Campus',
    library: 'Academic Library',
    shop: 'Sozim Store',
    dashboard: 'Dashboard',
    favorites: 'Favorites',
    student: 'Student Portal',
    'call-me-back': 'Request Callback',
    apply: 'Apply Now',
    portal: 'Student Portal',
    login: 'Login',
  }

  segments.forEach((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join('/')}`
    const label = labelMap[segment] || segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    breadcrumbs.push({ label, href })
  })

  return breadcrumbs
}

export default function Breadcrumb() {
  const pathname = usePathname()

  if (pathname === '/') return null

  const breadcrumbs = getBreadcrumbs(pathname)

  return (
    <nav aria-label="Breadcrumb" className="bg-slate-50 border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center gap-2 py-3 text-sm overflow-x-auto whitespace-nowrap">
          <li>
            <Link
              href="/"
              className="flex items-center gap-1 text-slate-600 hover:text-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1"
              aria-label="Go to homepage"
            >
              <Home className="w-4 h-4" />
              <span className="sr-only">Home</span>
            </Link>
          </li>
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.href} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" aria-hidden="true" />
              {index === breadcrumbs.length - 1 ? (
                <span
                  className="text-blue-700 font-semibold font-medium"
                  aria-current="page"
                >
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-slate-600 hover:text-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}
