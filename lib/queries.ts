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
