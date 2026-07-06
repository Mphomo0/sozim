import { cache } from 'react'
import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'

// React cache() deduplicates identical calls within the same request.
// generateMetadata and the page component can both call these without
// double-fetching Convex.

export const getCachedCourses = cache(() =>
  fetchQuery(api.courses.getCourses)
)

export const getCachedCategories = cache(() =>
  fetchQuery(api.categories.getCategories)
)

export const getCachedCourseById = cache((id: Id<'courses'>) =>
  fetchQuery(api.courses.getCourseById, { id })
)

export const getCachedCourseBySlug = cache((slug: string) =>
  fetchQuery(api.courses.getCourseBySlug, { slug })
)

export const getCachedStaleSlugTarget = cache((slug: string) =>
  fetchQuery(api.courses.resolveStaleSlug, { slug })
)

// Convex ID → current slug, for resolving static menu links (lib/courseLinks.ts)
// to live slugs server-side. Returns {} if Convex is unreachable so menus fall
// back to their hardcoded slugs.
export const getCourseSlugMap = cache(
  async (): Promise<Record<string, string>> => {
    try {
      const courses = await getCachedCourses()
      return Object.fromEntries(
        courses.flatMap((c) => (c.slug ? [[c._id, c.slug] as const] : [])),
      )
    } catch {
      return {}
    }
  },
)
