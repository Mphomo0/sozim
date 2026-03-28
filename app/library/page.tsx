import type { Metadata } from 'next'
import LibraryPageClient from './LibraryPageClient'

const BASE_URL = 'https://www.sozim.co.za'

export const metadata: Metadata = {
  title: 'Academic Library',
  description:
    'Access the Sozim Academic Library — scholarly articles, theses, and research data from South African universities. Free academic search for students and researchers.',
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
    description:
      'Access thousands of academic articles, theses, and research data from South African universities.',
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
  return <LibraryPageClient />
}
