import type { Metadata } from 'next'
import PageHeader from '@/components/global/PageHeader'
import ContactsInfoCard from '@/components/sections/contact/ContactsInfoCard'
import InfoMap from '@/components/sections/contact/InfoMap'
import FAQSection from '@/components/global/FAQSection'
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
    question: 'How can I contact Sozim Trading and Consultancy?',
    answer:
      'You can reach us by phone at (+27) 83 668 0104, email at admin@sozim.co.za, or visit us at Shop 4, Sunday School Building, 154 Charlotte Maxeke Street, Bloemfontein. We are also available through our online contact form and offer a callback request service for your convenience.',
  },
  {
    question: 'Where is Sozim Trading and Consultancy located?',
    answer:
      'Our campus is located at Shop 4, Sunday School Building, 154 Charlotte Maxeke Street, Bloemfontein, Free State, 9301, South Africa. We are situated in the city centre with easy access to public transport and parking facilities. Online consultations and virtual support are also available.',
  },
  {
    question: 'What are your operating hours?',
    answer:
      'We are open Monday to Friday from 08:00 to 17:00, and on Saturdays from 09:00 to 13:00. We are closed on Sundays and public holidays. For online support, you can reach us via email at any time and we will respond during our next business day.',
  },
  {
    question: 'How quickly will I receive a response to my enquiry?',
    answer:
      'Our team aims to respond to all enquiries within 24-48 business hours. For urgent admissions enquiries, we recommend calling us directly on (+27) 83 668 0104. You can also request a callback through our website if you prefer a phone call at a convenient time.',
  },
  {
    question: 'Can I visit the campus before enrolling?',
    answer:
      'Yes, we welcome prospective students to visit our campus in Bloemfontein. Campus visits can be arranged by contacting us in advance. We offer guided tours, meet-and-greet sessions with instructors, and the opportunity to view our learning facilities. Contact us to schedule your visit.',
  },
  {
    question: 'Do you offer online support for students outside Bloemfontein?',
    answer:
      'Absolutely. We provide comprehensive online support for students across South Africa. Our virtual learning platform, online enrolment system, and digital communication channels ensure that distance is never a barrier to quality education. Contact us to discuss online study options.',
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
        details="Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible."
      />
      <ContactsInfoCard />
      <InfoMap />
      <FAQSection
        title="Frequently Asked Questions About Contacting Sozim"
        faqs={contactFAQs}
      />
    </>
  )
}
