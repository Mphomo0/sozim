import type { Metadata } from 'next'
import PageHeader from '@/components/global/PageHeader'
import OurPrograms from '@/components/sections/programs/OurPrograms'
import Breadcrumb from '@/components/global/Breadcrumb'
import { getFAQSchema, getBreadcrumbSchema, getCourseSchema, getWebPageSchema, getArticleSchema, getEducationalOccupationalCredentialSchema } from '@/lib/seo/schemas'

const BASE_URL = 'https://www.sozim.co.za'

export const metadata: Metadata = {
  title: 'Courses',
  description:
    'Explore accredited trading courses and professional training at Sozim. Enrol in forex, stock markets, and financial trading courses in South Africa.',
  keywords: [
    'trading courses South Africa',
    'forex trading courses',
    'stock market training South Africa',
    'professional trading education',
    'accredited trading courses SA',
    'trading for beginners South Africa',
    'online trading courses',
    'trading certification South Africa',
  ],
  openGraph: {
    title: 'Courses | Sozim',
    description:
      'Enrol in accredited trading and professional training courses in South Africa. Beginner to advanced programmes.',
    url: `${BASE_URL}/courses`,
    siteName: 'Sozim',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Sozim Trading Courses',
        type: 'image/jpeg',
      },
    ],
  },
  alternates: {
    canonical: `${BASE_URL}/courses`,
  },
  authors: [{ name: 'Sozim Team' }],
  other: {
    'author': 'Sozim Team',
    'published': '2026-03-28',
    'modified': '2026-03-28',
  },
}

const courseSchema = getCourseSchema({
  name: 'Trading and Professional Education Programmes',
  description:
    'Comprehensive trading education and professional training courses covering forex trading, stock markets, financial analysis, and career development skills in South Africa.',
  url: `${BASE_URL}/courses`,
})

const courseFAQs = [
  {
    question: 'What trading courses does Sozim offer?',
    answer:
      'Sozim Trading and Consultancy offers a range of accredited trading and professional training programmes. Our courses cover forex trading fundamentals, advanced trading strategies, financial market analysis, and professional development skills. Courses range from beginner to advanced levels, designed to meet the needs of students at every stage of their trading journey.',
  },
  {
    question: 'Are Sozim trading courses accredited in South Africa?',
    answer:
      'Yes, our trading and professional education programmes are designed to meet South African Qualifications Authority (SAQA) standards. Upon successful completion, students receive accredited credentials that are recognised by employers and institutions across South Africa. We are committed to providing quality education that meets national standards.',
  },
  {
    question: 'How long do trading courses take to complete?',
    answer:
      'Course duration varies depending on the programme selected. Short certificate courses can be completed in 4-8 weeks, while more comprehensive programmes may run for 3-6 months. We offer both full-time and part-time study options, as well as online learning formats to accommodate different schedules.',
  },
  {
    question: 'Do I receive a certificate after completing a trading course?',
    answer:
      'Yes, students who successfully complete any of our trading programmes receive a certificate of completion. Accredited programmes also qualify for SAQA-registered credentials that can be used for employment, further education, or professional development. Certificates are issued upon meeting all course requirements.',
  },
  {
    question: 'Can I study trading courses online from anywhere in South Africa?',
    answer:
      'Absolutely. Sozim offers online learning options for most of our trading courses, making quality education accessible to students across South Africa. Our virtual learning environment provides the same comprehensive curriculum as our in-person courses, with flexible scheduling to suit working professionals and full-time students.',
  },
  {
    question: 'What are the entry requirements for Sozim trading courses?',
    answer:
      'Entry requirements vary by course level. Beginner courses typically have no formal prerequisites — just a keen interest in learning about financial markets. Advanced programmes may require foundational knowledge or prior completion of introductory courses. Check individual course pages for specific requirements.',
  },
  {
    question: 'Do you offer job placement or trading mentorship after completing a course?',
    answer:
      'While we do not guarantee job placement, we provide comprehensive career guidance and support. Our programmes include access to career pathway resources, industry connections, and professional development support. Some advanced courses may include mentorship components — check individual programme details for specifics.',
  },
  {
    question: 'How much do trading courses cost in South Africa at Sozim?',
    answer:
      'Course fees vary depending on the programme length and accreditation level. We offer competitive pricing for South African students and provide payment plan options for certain courses. Contact our admissions team or visit the individual course pages for detailed fee structures and available payment options.',
  },
]

export default function CoursesPage() {
  const faqSchema = getFAQSchema(courseFAQs)
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Our Programs', url: `${BASE_URL}/courses` },
  ])
  const webPageSchema = getWebPageSchema({
    name: 'Courses | Sozim',
    description: 'Explore accredited trading courses and professional training at Sozim. Enrol in forex, stock markets, and financial trading courses in South Africa.',
    url: `${BASE_URL}/courses`,
    lastModified: '2026-03-28',
    breadcrumb: [
      { name: 'Home', url: BASE_URL },
      { name: 'Our Programs', url: `${BASE_URL}/courses` },
    ],
    speakable: ['h1', 'h2', 'p'],
  })
  const articleSchema = getArticleSchema({
    headline: 'Accredited Trading Courses and Professional Training South Africa',
    description: 'Comprehensive trading education and professional training courses covering forex trading, stock markets, financial analysis, and career development skills in South Africa.',
    author: 'Sozim Team',
    datePublished: '2026-03-28',
    dateModified: '2026-03-28',
    url: `${BASE_URL}/courses`,
    keywords: ['trading courses South Africa', 'forex trading courses', 'accredited trading courses SA'],
  })
  const credentialSchema = getEducationalOccupationalCredentialSchema({
    name: 'Trading and Professional Education Programmes',
    description: 'Accredited trading education and professional training courses recognized by ETDP SETA, QCTO, and SAQA.',
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
