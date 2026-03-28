import type { Metadata } from 'next'
import ContactLearningSection from '@/components/sections/contact-learning/ContactLearningSection'
import PageHeader from '@/components/global/PageHeader'
import Breadcrumb from '@/components/global/Breadcrumb'
import { getFAQSchema, getBreadcrumbSchema } from '@/lib/seo/schemas'

const BASE_URL = 'https://www.sozim.co.za'

export const metadata: Metadata = {
  title: 'Enquire',
  description:
    'Enquire about learning opportunities at Sozim. Get information about course enrolment, admissions, financial assistance, and student support.',
  keywords: [
    'enquire Sozim',
    'course enrolment South Africa',
    'student admission enquiry',
    'learning opportunities SA',
    'trading course enquiries',
    'student recruitment South Africa',
  ],
  openGraph: {
    title: 'Enquire | Sozim',
    description:
      'Get information about enrolling in Sozim trading and professional education courses. Our admissions team is ready to help.',
    url: `${BASE_URL}/contact-learning`,
    siteName: 'Sozim',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Enquire About Learning - Sozim',
        type: 'image/jpeg',
      },
    ],
  },
  alternates: {
    canonical: `${BASE_URL}/contact-learning`,
  },
}

const enquiryFAQs = [
  {
    question: 'How do I enquire about enrolling in a Sozim programme?',
    answer:
      'You can enquire about enrolment by filling out our online contact form, calling us at (+27) 83 668 0104, or emailing admin@sozim.co.za. Our admissions team will respond within 24-48 hours with detailed information about your chosen programme, entry requirements, fees, and enrolment procedures.',
  },
  {
    question: 'What information should I include in my learning enquiry?',
    answer:
      'Include your full name, contact details, the programme(s) you are interested in, your current education level, any relevant work experience, and any specific questions you have. The more details you provide, the better we can tailor our response to your needs and career goals.',
  },
  {
    question: 'Can I get financial assistance or bursary information?',
    answer:
      'Yes, we can provide information about available financial assistance options, payment plans, and potential bursary opportunities. South African students may qualify for various funding schemes through SETAs, NSFAS (where applicable), and institutional payment arrangements. Contact us to discuss your financial planning options.',
  },
  {
    question: 'What happens after I submit an enquiry?',
    answer:
      'After submitting your enquiry, one of our student recruitment advisors will contact you within 24-48 hours. They will answer your questions, provide programme details, guide you through the application process, and help you select the most suitable programme for your career goals.',
  },
  {
    question: 'Can I schedule a one-on-one consultation about my studies?',
    answer:
      'Yes, we offer one-on-one consultations for prospective students. These sessions can be conducted in person at our Bloemfontein campus or via video call for students outside the area. Use our contact form or call us directly to schedule a consultation at a time that suits you.',
  },
  {
    question: 'Are there intake periods or can I enrol at any time?',
    answer:
      'Many of our programmes have rolling admissions, allowing you to enrol at any time. Some accredited programmes have specific intake periods — our admissions team will inform you of these when you enquire. Online programmes typically offer maximum flexibility with start dates throughout the year.',
  },
]

export default function ContactLearning() {
  const faqSchema = getFAQSchema(enquiryFAQs)
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Enquire About Learning', url: `${BASE_URL}/contact-learning` },
  ])

  return (
    <>
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
        title="Contact Learning"
        details="Choose from our wide range of industry-recognized programs designed to advance your career."
      />
      <ContactLearningSection />
    </>
  )
}
