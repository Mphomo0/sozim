import type { Metadata } from 'next'
import LibraryPageClient from './LibraryPageClient'
import { getBreadcrumbSchema, getWebPageSchema } from '@/lib/seo/schemas'

const BASE_URL = 'https://www.sozim.co.za'

export const metadata: Metadata = {
  title: 'Academic Library',
	description:
		'Access the Sozim Academic Library — scholarly articles, theses, and research from South African universities. Free academic search for students and researchers.',
  keywords: [
    'academic library South Africa',
    'scholarly articles South Africa',
    'thesis repository SA',
    'research database',
    'free academic library',
    'university research resources',
  ],
	openGraph: {
		title: 'Academic Library | Sozim',
		description: 'Access academic articles, theses, and research data from South African universities. Free for students.',
		url: `${BASE_URL}/library`,
    siteName: 'Sozim',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Sozim Academic Library',
        type: 'image/jpeg',
      },
    ],
  },
  alternates: {
    canonical: `${BASE_URL}/library`,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function LibraryPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Academic Library', url: `${BASE_URL}/library` },
  ])
  const webPageSchema = getWebPageSchema({
    name: 'Academic Library | Sozim',
    description: 'Access academic articles, theses, and research data from South African universities. Free for students.',
    url: `${BASE_URL}/library`,
    lastModified: '2026-03-28',
    breadcrumb: [
      { name: 'Home', url: BASE_URL },
      { name: 'Academic Library', url: `${BASE_URL}/library` },
    ],
    speakable: ['h1', 'h2', 'p'],
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <LibraryPageClient />
    </>
  )
}
