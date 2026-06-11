import Link from 'next/link'
import { NewsCard } from '@/components/sections/news/NewsCard'

interface NewsPost {
  _id: string
  title: string
  slug: string
  excerpt?: string
  featuredImage?: string
  publishedAt?: number
  categoryIds: string[]
}

interface NewsCategory {
  _id: string
  name: string
  slug: string
}

interface LatestNewsProps {
  posts: NewsPost[]
  categories: NewsCategory[]
}

export default function LatestNews({ posts, categories }: LatestNewsProps) {
  const latestPosts = posts.slice(0, 4)

  if (latestPosts.length === 0) return null

  // js-index-maps: O(1) lookup per post instead of O(categories) filter per post
  const categoryById = new Map(categories.map((c) => [c._id, c]))

  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600 mb-2">
              Latest News
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              News &amp; Updates
            </h2>
            <p className="mt-3 text-gray-500 max-w-xl">
              Stay informed with the latest news, industry insights, and updates
              from Sozim College.
            </p>
          </div>
          <Link
            href="/news"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-indigo-600 text-sm font-semibold text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors"
          >
            View All News
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestPosts.map((post) => {
            const postCategories = post.categoryIds
              .map((id) => categoryById.get(id))
              .filter((c): c is NewsCategory => c !== undefined)

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

        <div className="mt-10 flex justify-center">
          <Link
            href="/news"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Load More News
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
