import type { Metadata } from 'next'
import PageHeader from '@/components/global/PageHeader'
import CallbackForm from '@/components/sections/contact/CallbackForm'
import Breadcrumb from '@/components/global/Breadcrumb'
import { getBreadcrumbSchema } from '@/lib/seo/schemas'

const BASE_URL = 'https://www.sozim.co.za'

export const metadata: Metadata = {
  title: 'Request Callback',
  description:
    'Request a callback from a Sozim student recruitment advisor. We will call you to discuss your education and training options.',
  keywords: [
    'request callback Sozim',
    'student advisor call back',
    'course information call',
    'Sozim contact callback',
    'admissions call back SA',
  ],
  openGraph: {
    title: 'Request Callback | Sozim',
    description:
      'Request a callback from our student recruitment team to discuss your educational goals and course options.',
    url: `${BASE_URL}/call-me-back`,
    siteName: 'Sozim',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Request Callback - Sozim',
        type: 'image/jpeg',
      },
    ],
  },
  alternates: {
    canonical: `${BASE_URL}/call-me-back`,
  },
}

export default function ContactMe() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Request Callback', url: `${BASE_URL}/call-me-back` },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Breadcrumb />
      <PageHeader
        title="Request a Callback"
        details="Please provide your contact details, and a Student Recruitment Advisor will reach out to you shortly."
      />
      <CallbackForm />
    </>
  )
}
