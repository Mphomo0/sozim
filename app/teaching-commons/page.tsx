import type { Metadata } from 'next'

export const revalidate = 86400

import PageHeader from '@/components/global/PageHeader'
import Breadcrumb from '@/components/global/Breadcrumb'
import TeachingCommonsIntro from '@/components/sections/teachingcommons/TeachingCommonsIntro'
import { getBreadcrumbSchema, getWebPageSchema } from '@/lib/seo/schemas'

const BASE_URL = 'https://www.sozim.co.za'

export const metadata: Metadata = {
  title: 'Teaching Commons – Centre for Teaching and Learning',
  description:
    'The Teaching Commons (TC) at Sozim is an academic support centre partnering with academic schools to create transformative learning experiences in Bloemfontein, South Africa.',
  keywords: [
    'Teaching Commons Sozim',
    'Centre for Teaching and Learning',
    'Sozim academic support',
    'teaching and learning Bloemfontein',
    'academic development South Africa',
  ],
  openGraph: {
    title: 'Teaching Commons | Sozim - Accredited Education and Training College',
    description:
      'The Teaching Commons (TC) at Sozim partners with academic schools to create transformative learning experiences for students and staff.',
    url: `${BASE_URL}/teaching-commons`,
    siteName: 'Sozim',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Teaching Commons - Sozim',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Teaching Commons | Sozim',
    description:
      'The Teaching Commons (TC) at Sozim partners with academic schools to create transformative learning experiences.',
    images: ['/og-image.jpg'],
    site: '@sozimtrading',
  },
  alternates: {
    canonical: `${BASE_URL}/teaching-commons`,
  },
}

export default function TeachingCommonsPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Teaching Commons', url: `${BASE_URL}/teaching-commons` },
  ])
  const webPageSchema = getWebPageSchema({
    name: 'Teaching Commons | Sozim',
    description:
      'The Teaching Commons (TC) at Sozim is an academic support centre partnering with academic schools to create transformative learning experiences.',
    url: `${BASE_URL}/teaching-commons`,
    breadcrumb: [
      { name: 'Home', url: BASE_URL },
      { name: 'Teaching Commons', url: `${BASE_URL}/teaching-commons` },
    ],
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
      <Breadcrumb />
      <PageHeader
        title="Teaching Commons"
        details="The Centre for Teaching and Learning at Sozim — partnering with academic schools to create transformative learning experiences."
      />
      <TeachingCommonsIntro />
    </>
  )
}
