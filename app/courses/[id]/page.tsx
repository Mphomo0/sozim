import type { Metadata } from 'next'
import CourseDetail from '@/components/sections/programs/CourseDetail'
import PageHeader from '@/components/global/PageHeader'
import { getBreadcrumbSchema, getCourseSchema } from '@/lib/seo/schemas'
import { getCachedCourses, getCachedCourseById } from '@/lib/queries'
import type { Id } from '@/convex/_generated/dataModel'

const BASE_URL = 'https://www.sozim.co.za'

export const revalidate = 3600 // re-render at most once per hour

export async function generateStaticParams() {
  try {
    const courses = await getCachedCourses()
    return courses.map((course) => ({ id: course._id }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const isConvexId = id && id.length === 32

  if (!isConvexId) {
    return {
      title: 'Course Not Found | Sozim',
      robots: { index: false, follow: false },
    }
  }

  try {
    const course = await getCachedCourseById(id as Id<'courses'>)

    if (!course) {
      return {
        title: 'Course Not Found | Sozim',
        robots: { index: false, follow: false },
      }
    }

    const courseUrl = `${BASE_URL}/courses/${id}`
    const title = `${course.name} | Sozim`
    const description =
      course.description ||
      `Learn about ${course.name} at Sozim, an accredited education and training college in Bloemfontein.`

    return {
      title,
      description,
      keywords: [
        course.name,
        'accredited course South Africa',
        'Bloemfontein training',
        'SAQA course',
        course.level || '',
        'Sozim College',
      ].filter(Boolean),
      openGraph: {
        title,
        description,
        url: courseUrl,
        siteName: 'Sozim',
        type: 'website',
        images: [
          {
            url: '/og-image.jpg',
            width: 1200,
            height: 630,
            alt: `${course.name} - Sozim`,
            type: 'image/jpeg',
          },
        ],
      },
      alternates: {
        canonical: courseUrl,
      },
    }
  } catch {
    return {
      title: 'Course Details | Sozim - Accredited Education & Training College',
      description:
        'View detailed information about our accredited programmes in LIS and ETD.',
    }
  }
}

export default async function SingleCourse({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const isConvexId = id && id.length === 32

  let initialCourse = null
  if (isConvexId) {
    try {
      // getCachedCourseById deduplicates with the generateMetadata call above —
      // Convex is only queried once per request regardless.
      initialCourse = await getCachedCourseById(id as Id<'courses'>)
    } catch {
      // fall through — CourseDetail handles the null case
    }
  }

  const courseUrl = `${BASE_URL}/courses/${id}`
  const courseName = initialCourse?.name || 'Course Details'
  const courseDescription =
    initialCourse?.description ||
    'Accredited programmes in LIS and ETD at Sozim College.'

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Courses', url: `${BASE_URL}/courses` },
    { name: courseName, url: courseUrl },
  ])
  const courseSchema = getCourseSchema({
    name: courseName,
    description: courseDescription,
    url: courseUrl,
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
        title={courseName}
        details="Choose from our wide range of industry-recognized programs designed to advance your career."
      />
      <CourseDetail initialCourse={initialCourse} />
    </>
  )
}
