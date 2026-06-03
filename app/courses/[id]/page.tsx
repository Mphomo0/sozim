import type { Metadata } from 'next'
import { permanentRedirect, notFound } from 'next/navigation'
import CourseDetail from '@/components/sections/programs/CourseDetail'
import PageHeader from '@/components/global/PageHeader'
import { getBreadcrumbSchema, getCourseSchema } from '@/lib/seo/schemas'
import { getCachedCourses, getCachedCourseById, getCachedCourseBySlug } from '@/lib/queries'
import type { Id } from '@/convex/_generated/dataModel'

const BASE_URL = 'https://www.sozim.co.za'

export const revalidate = 7200 // re-render at most once per 2 hours
export const dynamicParams = true

export async function generateStaticParams() {
  try {
    const courses = await getCachedCourses()
    // Emit slug-based params for courses that have a slug.
    // Convex-ID paths resolve dynamically via fallback — no need to pre-render them.
    return courses
      .filter((course) => course.slug)
      .map((course) => ({ id: course.slug as string }))
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
  const isConvexId = /^[a-z0-9]{32}$/.test(id)

  try {
    const course = isConvexId
      ? await getCachedCourseById(id as Id<'courses'>)
      : await getCachedCourseBySlug(id)

    if (!course) {
      return {
        title: 'Course Not Found | Sozim',
        robots: { index: false, follow: false },
      }
    }

    const courseUrl = `${BASE_URL}/courses/${course.slug ?? id}`
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
        languages: {
          'en-ZA': courseUrl,
          'en-ZW': courseUrl,
          'en-BW': courseUrl,
        },
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
  const isConvexId = /^[a-z0-9]{32}$/.test(id)

  let initialCourse = null
  try {
    if (isConvexId) {
      // getCachedCourseById deduplicates with the generateMetadata call above —
      // Convex is only queried once per request regardless.
      initialCourse = await getCachedCourseById(id as Id<'courses'>)
    } else {
      initialCourse = await getCachedCourseBySlug(id)
      if (!initialCourse) notFound()
    }
  } catch {
    // fall through — CourseDetail handles the null case
  }

  // If we arrived via a Convex ID but the course has a canonical slug,
  // permanently redirect to the slug URL.
  if (isConvexId && !initialCourse) notFound()

  if (isConvexId && initialCourse?.slug) {
    permanentRedirect(`/courses/${initialCourse.slug}`)
  }

  const courseUrl = `${BASE_URL}/courses/${initialCourse?.slug ?? id}`
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
    level: initialCourse?.level,
    duration: initialCourse?.duration,
    prerequisites: initialCourse?.entryRequirements?.join('; '),
    teaches: [
      ...(initialCourse?.modules?.knowledgeModules?.map((m: { title?: string }) => m.title).filter((t): t is string => Boolean(t)) ?? []),
      ...(initialCourse?.modules?.practicalSkillModules?.map((m: { title?: string }) => m.title).filter((t): t is string => Boolean(t)) ?? []),
    ],
    isOpen: initialCourse?.isOpen,
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
