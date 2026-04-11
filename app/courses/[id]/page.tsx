import type { Metadata } from 'next'
import CourseDetail from '@/components/sections/programs/CourseDetail'
import PageHeader from '@/components/global/PageHeader'
import { getBreadcrumbSchema, getCourseSchema } from '@/lib/seo/schemas'

const BASE_URL = 'https://www.sozim.co.za'

export const metadata: Metadata = {
  title: 'Course Details | Accredited Education and Training College in Bloemfontein',
  description:
    'View detailed information about our accredited programmes in LIS and ETD. Enrol in courses that advance your career.',
  keywords: [
    'course details',
    'accredited programmes',
    'LIS courses',
    'ETD courses',
    'Bloemfontein training',
    'SAQA courses',
  ],
  openGraph: {
    title: 'Course Details | Sozim - Accredited Education and Training College',
    description:
      'View detailed information about our accredited programmes in LIS and ETD.',
    url: `${BASE_URL}/courses`,
    siteName: 'Sozim',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Course Details - Sozim',
        type: 'image/jpeg',
      },
    ],
  },
  alternates: {
    canonical: `${BASE_URL}/courses`,
  },
}

export default function SingleCourse() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Courses', url: `${BASE_URL}/courses` },
    { name: 'Course Details', url: `${BASE_URL}/courses` },
  ])
  const courseSchema = getCourseSchema({
    name: 'Accredited Education and Training Programmes',
    description: 'Accredited programmes in LIS and ETD at Sozim College.',
    url: `${BASE_URL}/courses`,
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <PageHeader
        title="Course Details"
        details="Choose from our wide range of industry-recognized programs designed to advance your career."
      />
      <CourseDetail />
    </>
  )
}
