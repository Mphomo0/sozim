import type { Metadata } from 'next'
import LibraryPageClient from './LibraryPageClient'
import { getBreadcrumbSchema, getWebPageSchema, getFAQSchema } from '@/lib/seo/schemas'

const BASE_URL = 'https://www.sozim.co.za'

export const metadata: Metadata = {
  title: 'Academic Library | Sozim – South African Research Resources',
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

const libraryFAQs = [
  {
    question: 'What is the Sozim Academic Library?',
    answer:
      'The Sozim Academic Library is a free online research resource providing students and researchers with access to scholarly articles, theses, and research publications from South African universities. It supports Library and Information Science (LIS) students and researchers across South Africa.',
  },
  {
    question: 'Who can use the Sozim Academic Library?',
    answer:
      'The library is open to all Sozim students, researchers, and members of the public interested in South African academic research. Students enrolled in LIS or ETD programmes benefit most from the curated research collections.',
  },
  {
    question: 'What types of resources are available in the Sozim Academic Library?',
    answer:
      'The library provides access to scholarly articles, theses, dissertations, and research papers from South African universities, including resources relevant to Library and Information Science, Education Training and Development, and related fields.',
  },
  {
    question: 'Is the Sozim Academic Library free to use?',
    answer:
      'Yes. The Sozim Academic Library is free for students and researchers. No subscription or payment is required to search and access the available academic resources.',
  },
]

export default function LibraryPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Academic Library', url: `${BASE_URL}/library` },
  ])
  const webPageSchema = getWebPageSchema({
    name: 'Academic Library | Sozim – South African Research Resources',
    description: 'Access academic articles, theses, and research data from South African universities. Free for students.',
    url: `${BASE_URL}/library`,
    lastModified: '2026-03-28',
    breadcrumb: [
      { name: 'Home', url: BASE_URL },
      { name: 'Academic Library', url: `${BASE_URL}/library` },
    ],
    speakable: ['h1', 'h2', 'p'],
  })
  const faqSchema = getFAQSchema(libraryFAQs)

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <LibraryPageClient />
    </>
  )
}
