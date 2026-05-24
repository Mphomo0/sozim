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
  getItemListSchema,
} from '@/lib/seo/schemas'
import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'

const BASE_URL = 'https://www.sozim.co.za'

export const metadata: Metadata = {
  title: 'Courses | Sozim - Accredited Education & Training College Bloemfontein',
  description:
    'Explore ETDP SETA accredited courses at Sozim in Bloemfontein. Enrol in Library and Information Science (LIS) and Education Training and Development (ETD) programmes.',
  keywords: [
    'accredited courses Bloemfontein',
    'SAQA accredited courses South Africa',
    'library and information science courses',
    'ETD courses South Africa',
    'LIS programmes Bloemfontein',
    'ETDP SETA accredited training',
    'career development programs',
    'online courses South Africa',
    'accredited training college Bloemfontein',
    'skills development courses Free State',
  ],
  openGraph: {
    title: 'Courses | Sozim - Accredited Education and Training College',
    description:
      'Explore ETDP SETA accredited courses at Sozim in Bloemfontein. Enrol in LIS and ETD programmes.',
    url: `${BASE_URL}/courses`,
    siteName: 'Sozim',
    type: 'website',
    locale: 'en_ZA',
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
  twitter: {
    card: 'summary_large_image',
    title: 'Courses | Sozim - Accredited Education & Training College',
    description: 'ETDP SETA accredited LIS and ETD courses in Bloemfontein.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: `${BASE_URL}/courses`,
  },
}

const courseFAQs = [
  {
    question: 'What courses does Sozim offer?',
    answer:
      'Sozim offers ETDP SETA accredited programmes in Library and Information Science (LIS) and Education Training and Development (ETD). Courses include Library Assistant (NQF 3), Learning and Development Facilitator, Assessment Practitioner, and professional skills development programmes.',
  },
  {
    question: 'Are Sozim courses accredited in South Africa?',
    answer:
      'Yes. All Sozim programmes are accredited by the ETDP SETA, registered with the QCTO, and aligned to SAQA standards. Graduates receive certificates recognised by South African employers and institutions.',
  },
  {
    question: 'How long do Sozim courses take to complete?',
    answer:
      'Short certificate courses take 4–8 weeks. Comprehensive accredited programmes run 3–6 months. Both full-time and part-time options are available, along with online and contact learning formats.',
  },
  {
    question: 'Do I receive a certificate after completing a Sozim course?',
    answer:
      'Yes. Graduates receive a certificate of completion. Accredited programmes also qualify for SAQA-registered credentials recognised for employment, further education, and professional development.',
  },
  {
    question: 'Can I study online from anywhere in South Africa?',
    answer:
      'Yes. Sozim offers online learning for most programmes. The virtual learning environment delivers the same accredited curriculum as campus courses, with flexible scheduling for working professionals.',
  },
  {
    question: 'What are the entry requirements for Sozim courses?',
    answer:
      'Beginner courses have no formal prerequisites. Advanced programmes may require prior study or foundational knowledge. Check individual course pages for specific requirements.',
  },
  {
    question: 'Do you offer career support after completing a course?',
    answer:
      'Yes. Sozim provides career pathway guidance, professional development resources, and industry connections. Our career pathways section outlines progression routes from each programme into employment.',
  },
  {
    question: 'How much do Sozim courses cost?',
    answer:
      'Fees are quoted in ZAR and vary by programme level and duration. Flexible payment plans are available. Contact admin@sozim.co.za or call (+27) 83 668 0104 for a fee schedule.',
  },
]

export default async function CoursesPage() {
  const [initialCourses, initialCategories] = await Promise.all([
    fetchQuery(api.courses.getCourses),
    fetchQuery(api.categories.getCategories),
  ])

  const courseSchema = getCourseSchema({
    name: 'Accredited Education and Training Programmes',
    description:
      'ETDP SETA accredited education and training programmes at Sozim in Bloemfontein. LIS and ETD programmes for career advancement.',
    url: `${BASE_URL}/courses`,
  })

  // Dynamic ItemList from real course data — tells Google exactly what courses exist
  const itemListSchema = initialCourses.length > 0
    ? getItemListSchema(
        initialCourses.map((course) => ({
          name: course.name,
          url: `${BASE_URL}/courses/${course._id}`,
          description: course.description,
        }))
      )
    : null

  const faqSchema = getFAQSchema(courseFAQs)
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Our Programs', url: `${BASE_URL}/courses` },
  ])
  const webPageSchema = getWebPageSchema({
    name: 'Courses | Sozim - Accredited Education and Training College',
    description:
      'Explore ETDP SETA accredited courses at Sozim in Bloemfontein. Enrol in LIS and ETD programmes.',
    url: `${BASE_URL}/courses`,
    type: 'CollectionPage',
    speakable: ['h1', 'h2'],
    breadcrumb: [
      { name: 'Home', url: BASE_URL },
      { name: 'Courses', url: `${BASE_URL}/courses` },
    ],
  })
  const articleSchema = getArticleSchema({
    headline: 'Accredited Courses - Education and Training College Bloemfontein',
    description:
      'Explore ETDP SETA accredited courses at Sozim in Bloemfontein. Enrol in LIS and ETD programmes.',
    datePublished: '2026-03-28',
    dateModified: '2026-05-24',
    url: `${BASE_URL}/courses`,
    keywords: [
      'courses South Africa',
      'accredited courses Bloemfontein',
      'LIS courses',
      'ETD courses',
      'training college',
    ],
  })
  const credentialSchema = getEducationalOccupationalCredentialSchema({
    name: 'Accredited Education and Training Programmes',
    description: 'Accredited programmes recognised by ETDP SETA, QCTO and SAQA.',
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
      {itemListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}
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
      <OurPrograms initialCourses={initialCourses} initialCategories={initialCategories} />
    </>
  )
}
