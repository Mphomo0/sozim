import { MetadataRoute } from 'next'
import { getCachedCourses } from '@/lib/queries'
import { getCachedNewsPosts, getCachedNewsTags } from '@/lib/newsQueries'

export const revalidate = 86400 // regenerate sitemap once per day

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.sozim.co.za'
  const lastModified = new Date()

  let coursePages: MetadataRoute.Sitemap = []
  try {
    const courses = await getCachedCourses()
    // Courses without a slug are still indexable at their ID URL — include
    // them so every linked course page is in the sitemap.
    coursePages = courses.map((course) => ({
      url: `${baseUrl}/courses/${course.slug ?? course._id}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))
  } catch {
    // sitemap still generates without course pages if Convex is unreachable
  }

  let newsPages: MetadataRoute.Sitemap = []
  try {
    const posts = await getCachedNewsPosts()
    newsPages = posts.map((post) => ({
      url: `${baseUrl}/news/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  } catch {}

  // News category pages are noindexed thin archives — kept out of the
  // sitemap until each category has enough posts.

  let newsTagPages: MetadataRoute.Sitemap = []
  try {
    const tags = await getCachedNewsTags()
    newsTagPages = tags.map((tag) => ({
      url: `${baseUrl}/news/tag/${tag.slug}`,
      lastModified: new Date(tag.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }))
  } catch {}

  return [
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...coursePages,
    {
      url: `${baseUrl}/news`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...newsPages,
    ...newsTagPages,
    // /welcome-message is noindexed — deliberately excluded from the sitemap.
    {
      url: `${baseUrl}/career-pathway`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/campus`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/library`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact-learning`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/apply`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/call-me-back`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]
}
