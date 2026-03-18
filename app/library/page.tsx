import type { Metadata } from 'next'
import LibraryPageClient from './LibraryPageClient'

const BASE_URL = 'https://www.sozim.co.za'

export const metadata: Metadata = {
  title: 'Academic Library | Scholarly Articles, Theses & Research Data',
  description:
    'Access the Sozim Academic Library — thousands of scholarly articles, theses, and research data from leading South African universities and international repositories. Free academic search for students and researchers.',
  keywords: [
    'academic library South Africa',
    'scholarly articles South Africa',
    'thesis repository SA',
    'research database',
    'free academic library',
    'university research resources',
    'academic journals South Africa',
    'dissertation database',
    'open access research',
    'LIS research resources',
  ],
  openGraph: {
    title: 'Sozim Academic Library | Scholarly Research Resources',
    description:
      'Access thousands of academic articles, theses, and research data from South African universities and international repositories.',
    url: `${BASE_URL}/library`,
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
