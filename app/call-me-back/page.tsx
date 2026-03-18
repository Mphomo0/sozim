import type { Metadata } from 'next'
import PageHeader from '@/components/global/PageHeader'
import CallbackForm from '@/components/sections/contact/CallbackForm'
import Breadcrumb from '@/components/global/Breadcrumb'
import { getBreadcrumbSchema } from '@/lib/seo/schemas'

const BASE_URL = 'https://www.sozim.co.za'

export const metadata: Metadata = {
  title: 'Request a Callback | Sozim Trading and Consultancy',
  description:
    'Request a callback from a Sozim Trading and Consultancy student recruitment advisor. Fill in your details and we will call you at a time that suits you to discuss your education and training options.',
  keywords: [
    'request callback Sozim',
    'student advisor call back',
    'course information call',
    'Sozim contact callback',
    'admissions call back SA',
  ],
  openGraph: {
    title: 'Request a Callback | Sozim Trading and Consultancy',
    description:
      'Request a callback from our student recruitment team. We will call you to discuss your educational goals and course options.',
    url: `${BASE_URL}/call-me-back`,
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
