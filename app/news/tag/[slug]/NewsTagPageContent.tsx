'use client'

import Link from 'next/link'
import Breadcrumb from '@/components/global/Breadcrumb'
import PageHeader from '@/components/global/PageHeader'
import { NewsCard } from '@/components/sections/news/NewsCard'
import { NewsSidebar } from '@/components/sections/news/NewsSidebar'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useEffect, useState } from 'react'
import type { Doc } from '@/convex/_generated/dataModel'

export function NewsTagPageContent({
  tag,
  categories,
}: {
  tag: Doc<'newsTags'>
  categories: Doc<'newsCategories'>[]
}) {
  const allPosts = useQuery(api.newsPosts.getNewsPostsByTagSlug, { slug: tag.slug })
  const allTags = useQuery(api.newsTags.getNewsTags)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (allPosts !== undefined && allTags !== undefined) {
      setLoading(false)
    }
  }, [allPosts, allTags])

  const tagPostCountMap = new Map<string, number>()
  ;(allPosts || []).forEach((p) => {
    p.tagIds.forEach((tId) => {
      tagPostCountMap.set(tId, (tagPostCountMap.get(tId) || 0) + 1)
    })
  })
  const tagsWithCount = (allTags || []).filter((t) => (tagPostCountMap.get(t._id) || 0) > 0)

  const postCountMap = new Map<string, number>()
  ;(allPosts || []).forEach((p) => {
    p.categoryIds.forEach((cId) => {
      postCountMap.set(cId, (postCountMap.get(cId) || 0) + 1)
    })
  })
  const categoriesWithCount = categories.map((c) => ({
    ...c,
    postCount: postCountMap.get(c._id) || 0,
  }))

  const recentPosts = (allPosts || []).slice(0, 5).map((p) => ({
    title: p.title,
    slug: p.slug,
    publishedAt: p.publishedAt,
  }))

  return (
    <>
      <Breadcrumb />
      <PageHeader
        title={`Tag: ${tag.name}`}
        details={tag.description || `Browse news articles tagged with "${tag.name}".`}
      />

      <section className="py-12 md:py-16 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              {loading ? (
                <div className="text-center py-20">
                  <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
                </div>
              ) : allPosts && allPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {allPosts.map((post) => {
                    const postCategories = categories.filter((c) =>
                      post.categoryIds.includes(c._id)
                    ).map((c) => ({ _id: c._id, name: c.name, slug: c.slug }))

                    return (
                      <NewsCard
                        key={post._id}
                        title={post.title}
                        slug={post.slug}
                        excerpt={post.excerpt}
                        featuredImage={post.featuredImage}
                        publishedAt={post.publishedAt}
                        categoryNames={postCategories}
                      />
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-lg text-gray-500">No articles with this tag yet.</p>
                  <Link href="/news" className="text-sm text-indigo-600 hover:text-indigo-700 mt-2 inline-block">
                    View all news →
                  </Link>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <NewsSidebar
                categories={categoriesWithCount}
                tags={tagsWithCount}
                recentPosts={recentPosts}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
