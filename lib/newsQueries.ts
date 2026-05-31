import { cache } from 'react'
import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'

export const getCachedNewsPosts = cache(() =>
  fetchQuery(api.newsPosts.getPublishedNewsPosts, {})
)

export const getCachedNewsPostBySlug = cache((slug: string) =>
  fetchQuery(api.newsPosts.getNewsPostBySlug, { slug })
)

export const getCachedNewsCategories = cache(() =>
  fetchQuery(api.newsCategories.getNewsCategories)
)

export const getCachedNewsTags = cache(() =>
  fetchQuery(api.newsTags.getNewsTags)
)

export const getCachedNewsCategoryBySlug = cache((slug: string) =>
  fetchQuery(api.newsCategories.getNewsCategoryBySlug, { slug })
)

export const getCachedNewsTagBySlug = cache((slug: string) =>
  fetchQuery(api.newsTags.getNewsTagBySlug, { slug })
)

export const getCachedNewsPostsByCategorySlug = cache((slug: string) =>
  fetchQuery(api.newsPosts.getNewsPostsByCategorySlug, { slug })
)

export const getCachedNewsPostsByTagSlug = cache((slug: string) =>
  fetchQuery(api.newsPosts.getNewsPostsByTagSlug, { slug })
)

export const getCachedRelatedNewsPosts = cache((postId: string, limit?: number) =>
  fetchQuery(api.newsPosts.getRelatedNewsPosts, {
    postId: postId as any,
    limit,
  })
)
