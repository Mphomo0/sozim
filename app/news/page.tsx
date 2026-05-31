import { Metadata } from 'next'
import Link from 'next/link'
import { getCachedNewsPosts, getCachedNewsCategories, getCachedNewsTags } from '@/lib/newsQueries'
import { NewsCard } from '@/components/sections/news/NewsCard'
import { NewsSidebar } from '@/components/sections/news/NewsSidebar'
import Breadcrumb from '@/components/global/Breadcrumb'
import PageHeader from '@/components/global/PageHeader'
import { getWebPageSchema, getBreadcrumbSchema } from '@/lib/seo/schemas'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'News | Sozim',
  description: 'Latest news, updates, and articles from Sozim Trading and Consultancy. Stay informed about industry insights, company updates, and educational resources.',
  openGraph: {
    title: 'News | Sozim',
    description: 'Latest news and updates from Sozim Trading and Consultancy.',
    url: 'https://www.sozim.co.za/news',
    siteName: 'Sozim',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'News | Sozim',
    description: 'Latest news and updates from Sozim Trading and Consultancy.',
  },
  alternates: {
    canonical: 'https://www.sozim.co.za/news',
  },
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const currentPage = parseInt(pageParam || '1', 10) || 1
  const perPage = 9

  const [posts, categories, tags] = await Promise.all([
    getCachedNewsPosts(),
    getCachedNewsCategories(),
    getCachedNewsTags(),
  ])

  const totalPages = Math.ceil(posts.length / perPage) || 1
  const startIndex = (currentPage - 1) * perPage
  const paginatedPosts = posts.slice(startIndex, startIndex + perPage)

  const postCountMap = new Map<string, number>()
  posts.forEach((p) => {
    p.categoryIds.forEach((cId) => {
      postCountMap.set(cId, (postCountMap.get(cId) || 0) + 1)
    })
  })
  const categoriesWithCount = categories.map((c) => ({
    ...c,
    postCount: postCountMap.get(c._id) || 0,
  }))

  const recentPosts = posts.slice(0, 5).map((p) => ({
    title: p.title,
    slug: p.slug,
    publishedAt: p.publishedAt,
  }))

  const tagPostCountMap = new Map<string, number>()
  posts.forEach((p) => {
    p.tagIds.forEach((tId) => {
      tagPostCountMap.set(tId, (tagPostCountMap.get(tId) || 0) + 1)
    })
  })
  const tagsWithCount = tags
    .filter((t) => (tagPostCountMap.get(t._id) || 0) > 0)

  const breadcrumbItems = [
    { name: 'Home', url: 'https://www.sozim.co.za' },
    { name: 'News', url: 'https://www.sozim.co.za/news' },
  ]

  const articleListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Sozim News Articles',
    description: 'Latest news and updates from Sozim Trading and Consultancy.',
    url: 'https://www.sozim.co.za/news',
    numberOfItems: posts.length,
    itemListElement: posts.slice(0, 10).map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `https://www.sozim.co.za/news/${post.slug}`,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify(getWebPageSchema({
          name: 'News | Sozim',
          description: 'Latest news and updates from Sozim Trading and Consultancy.',
          url: 'https://www.sozim.co.za/news',
          type: 'CollectionPage',
          breadcrumb: breadcrumbItems,
        }))
      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify(getBreadcrumbSchema(breadcrumbItems))
      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify(articleListSchema)
      }} />

      <Breadcrumb />
      <PageHeader
        title="News & Updates"
        details="Latest news, industry insights, and company updates from Sozim."
      />

      <section className="py-12 md:py-16 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              {paginatedPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedPosts.map((post) => {
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
                  <p className="text-lg text-gray-500">No articles published yet.</p>
                  <p className="text-sm text-gray-400 mt-2">Check back soon for updates.</p>
                </div>
              )}

              {totalPages > 1 && (
                <div className="mt-10 flex justify-center">
                  <div className="flex items-center gap-2">
                    {currentPage > 1 && (
                      <Link
                        href={`/news?page=${currentPage - 1}`}
                        className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        Previous
                      </Link>
                    )}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Link
                        key={p}
                        href={`/news?page=${p}`}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          p === currentPage
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {p}
                      </Link>
                    ))}
                    {currentPage < totalPages && (
                      <Link
                        href={`/news?page=${currentPage + 1}`}
                        className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        Next
                      </Link>
                    )}
                  </div>
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
