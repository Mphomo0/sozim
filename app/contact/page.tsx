import type { Metadata } from 'next'
import PageHeader from '@/components/global/PageHeader'
import ContactsInfoCard from '@/components/sections/contact/ContactsInfoCard'
import InfoMap from '@/components/sections/contact/InfoMap'
import Breadcrumb from '@/components/global/Breadcrumb'
import { getFAQSchema, getBreadcrumbSchema, getLocalBusinessSchema } from '@/lib/seo/schemas'
import React from 'react'

const BASE_URL = 'https://www.sozim.co.za'

export const metadata: Metadata = {
  title: 'Contact Sozim Trading and Consultancy | Get in Touch',
  description:
    'Contact Sozim Trading and Consultancy in Bloemfontein, South Africa. Get in touch for course enquiries, admissions, student support, and general information. Call (+27) 83 668 0104 or email admin@sozim.co.za.',
  keywords: [
    'contact Sozim Trading',
    'Sozim education contact details',
    'trading courses enquiries South Africa',
    'Bloemfontein education contact',
    'Sozim admissions contact',
    'student support South Africa',
    'contact learning institution SA',
  ],
  openGraph: {
    title: 'Contact Sozim Trading and Consultancy | Get in Touch',
    description:
      'Reach out to Sozim Trading and Consultancy for course enquiries, admissions, and student support. Our team is ready to help you start your educational journey.',
    url: `${BASE_URL}/contact`,
  },
  alternates: {
    canonical: `${BASE_URL}/contact`,
  },
}

const localBusinessSchema = getLocalBusinessSchema()

const contactFAQs = [
  {
    question: 'When do applications open?',
    answer:
      'Applications are open year-round with intakes in January, April, July, and October. Secure your spot in our next intake today.',
  },
  {
    question: 'How long does the application process take?',
    answer:
      'The application process typically takes 5-7 business days from submission to acceptance. Our admissions team will contact you if any additional information is required.',
  },
  {
    question: 'Do you offer payment plans?',
    answer:
      'Yes, we offer flexible payment plans to make our courses more affordable. Contact our admissions team to discuss the payment options available to you.',
  },
  {
    question: 'Can I schedule a campus tour?',
    answer:
      'Yes, we encourage prospective students to visit our campus. Contact us to schedule a tour and learn more about our facilities and programmes.',
  },
]

export default function Contact() {
  const faqSchema = getFAQSchema(contactFAQs)
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Contact Us', url: `${BASE_URL}/contact` },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Breadcrumb />
      <PageHeader
        title="Get in Touch"
        details="Have questions? Would love to hear from you. Send us a message and we'll respond as soon as possible."
      />
      <ContactsInfoCard />
      <InfoMap />
    </>
  )
}