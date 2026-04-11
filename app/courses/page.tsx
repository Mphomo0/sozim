import type { Metadata } from 'next'
import PageHeader from '@/components/global/PageHeader'
import OurPrograms from '@/components/sections/programs/OurPrograms'
import Breadcrumb from '@/components/global/Breadcrumb'
import {
  getFAQSchema,
  getBreadcrumbSchema,
  getCourseSchema,
  getWebPageSchema,
  getArticleSchema,
  getEducationalOccupationalCredentialSchema,
} from '@/lib/seo/schemas'

const BASE_URL = 'https://www.sozim.co.za'

export const metadata: Metadata = {
  title: 'Courses | Accredited Education and Training College in Bloemfontein',
  description:
    'Explore accredited courses at Sozim, an education and training college in Bloemfontein. Enrol in LIS and ETD programmes.',
  keywords: [
    'Colleges in Bloemfontein',
    'SAQA accredited courses Bloemfontein',
    'library and information science courses',
    'ETD courses South Africa',
    'career development programs',
    'online courses South Africa',
    'accredited training college',
    'skills development courses',
  ],
  openGraph: {
    title: 'Courses | Sozim - Accredited Education and Training College',
    description:
      'Explore accredited courses at Sozim, an education and training college in Bloemfontein. Enrol in LIS and ETD programmes.',
    url: `${BASE_URL}/courses`,
    siteName: 'Sozim',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Sozim Courses - Accredited Education and Training College',
        type: 'image/jpeg',
      },
    ],
  },
  alternates: {
    canonical: `${BASE_URL}/courses`,
  },
  authors: [{ name: 'Sozim Team' }],
  other: {
    author: 'Sozim Team',
    published: '2026-03-28',
    modified: '2026-03-28',
  },
}

const courseSchema = getCourseSchema({
  name: 'Accredited Education and Training Programmes',
  description:
    'Accredited education and training programmes at Sozim in Bloemfontein. LIS and ETD programmes for career advancement.',
  url: `${BASE_URL}/courses`,
})

const courseFAQs = [
  {
    question: 'What courses does Sozim offer?',
    answer:
      'Sozim offers accredited programmes in Library and Information Science (LIS), Education Training and Development (ETD), and professional skills courses. Our courses include Library Assistant, Learning and Development Facilitator, Assessment Practitioner, and professional development programmes ranging from beginner to advanced levels.',
  },
  {
    question: 'Are Sozim courses accredited in South Africa?',
    answer:
      'Yes, our programmes are ETDP SETA accredited and QCTO registered, designed to meet South African Qualifications Authority (SAQA) standards. Upon successful completion, students receive accredited credentials that are recognised by employers and institutions across South Africa.',
  },
  {
    question: 'How long do courses take to complete?',
    answer:
      'Course duration varies depending on the programme selected. Short certificate courses can be completed in 4-8 weeks, while more comprehensive programmes may run for 3-6 months. We offer both full-time and part-time study options, as well as online learning formats to accommodate different schedules.',
  },
  {
    question: 'Do I receive a certificate after completing a course?',
    answer:
      'Yes, students who successfully complete any of our programmes receive a certificate of completion. Accredited programmes also qualify for SAQA-registered credentials that can be used for employment, further education, or professional development. Certificates are issued upon meeting all course requirements.',
  },
  {
    question:
      'Can I study courses online from anywhere in South Africa?',
    answer:
      'Yes. Sozim offers online learning options for most of our programmes, making quality education accessible to students across South Africa. Our virtual learning environment provides the same comprehensive curriculum as our in-person courses, with flexible scheduling to suit working professionals and full-time students.',
  },
  {
    question: 'What are the entry requirements for Sozim courses?',
    answer:
      'Entry requirements vary by course level. Beginner courses typically have no formal prerequisites. Advanced programmes may require foundational knowledge or prior completion of introductory courses. Check individual course pages for specific requirements.',
  },
  {
    question: 'Do you offer career support after completing a course?',
    answer:
      'While we do not guarantee job placement, we provide comprehensive career guidance and support. Our programmes include access to career pathway resources, industry connections, and professional development support. Some advanced courses may include mentorship components.',
  },
  {
    question: 'How much do courses cost at Sozim?',
    answer:
      'Course fees vary depending on the programme length and accreditation level. We offer competitive pricing for South African students and provide payment plan options for certain courses. Contact our admissions team for detailed fee structures.',
  },
]

export default function CoursesPage() {
  const faqSchema = getFAQSchema(courseFAQs)
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Our Programs', url: `${BASE_URL}/courses` },
  ])
  const webPageSchema = getWebPageSchema({
    name: 'Courses | Sozim - Accredited Education and Training College',
    description:
      'Explore accredited courses at Sozim in Bloemfontein. Enrol in LIS and ETD programmes.',
    url: `${BASE_URL}/courses`,
    lastModified: '2026-03-28',
    breadcrumb: [
      { name: 'Home', url: BASE_URL },
      { name: 'Courses', url: `${BASE_URL}/courses` },
    ],
    speakable: ['h1', 'h2', 'p'],
  })
  const articleSchema = getArticleSchema({
    headline: 'Accredited Courses - Education and Training College',
    description:
      'Explore accredited courses at Sozim in Bloemfontein. Enrol in LIS and ETD programmes.',
    author: 'Sozim Team',
    datePublished: '2026-03-28',
    dateModified: '2026-03-28',
    url: `${BASE_URL}/courses`,
    keywords: [
      'courses South Africa',
      'accredited courses Bloemfontein',
      'training college',
    ],
  })
  const credentialSchema = getEducationalOccupationalCredentialSchema({
    name: 'Accredited Education and Training Programmes',
    description:
      'Accredited programmes recognised by ETDP SETA, QCTO and SAQA.',
    credentialCategory: 'Professional Certificate',
    url: `${BASE_URL}/courses`,
    recognizedBy: ['ETDP SETA', 'QCTO', 'SAQA'],
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(credentialSchema) }}
      />
      <Breadcrumb />
      <PageHeader
        title="Our Programs"
        details="Choose from our wide range of industry-recognized programs designed to advance your career."
      />
      <OurPrograms />
    </>
  )
}
