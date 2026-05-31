import { MetadataRoute } from 'next'
import { getCachedCourses } from '@/lib/queries'
import {
  getCachedNewsPosts,
  getCachedNewsCategories,
  getCachedNewsTags,
} from '@/lib/newsQueries'

export const revalidate = 86400 // regenerate sitemap once per day

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.sozim.co.za'
  const lastModified = new Date()

  let coursePages: MetadataRoute.Sitemap = []
  try {
    const courses = await getCachedCourses()
    coursePages = courses.map((course) => ({
      url: `${baseUrl}/courses/${course._id}`,
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

  let newsCategoryPages: MetadataRoute.Sitemap = []
  try {
    const categories = await getCachedNewsCategories()
    newsCategoryPages = [
      { url: `${baseUrl}/news/category`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
      ...categories.map((cat) => ({
        url: `${baseUrl}/news/category/${cat.slug}`,
        lastModified: new Date(cat.updatedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
    ]
  } catch {}

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
    ...newsCategoryPages,
    ...newsTagPages,
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
