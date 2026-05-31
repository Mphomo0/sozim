import { Metadata } from 'next'
import Link from 'next/link'
import { getCachedNewsPosts, getCachedNewsCategories } from '@/lib/newsQueries'
import Breadcrumb from '@/components/global/Breadcrumb'
import PageHeader from '@/components/global/PageHeader'
import { getWebPageSchema, getBreadcrumbSchema } from '@/lib/seo/schemas'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Categories | News | Sozim',
  description: 'Browse news articles by category. Explore industry insights, company updates, and educational resources organised by topic.',
  openGraph: {
    title: 'Categories | News | Sozim',
    description: 'Browse news articles by category.',
    url: 'https://www.sozim.co.za/news/category',
    siteName: 'Sozim',
  },
  alternates: {
    canonical: 'https://www.sozim.co.za/news/category',
  },
}

export default async function NewsCategoryIndexPage() {
  const [posts, categories] = await Promise.all([
    getCachedNewsPosts(),
    getCachedNewsCategories(),
  ])

  const postCountMap = new Map<string, number>()
  posts.forEach((p) => {
    p.categoryIds.forEach((cId) => {
      postCountMap.set(cId, (postCountMap.get(cId) || 0) + 1)
    })
  })

  const categoriesWithCount = categories
    .map((c) => ({
      ...c,
      postCount: postCountMap.get(c._id) || 0,
    }))
    .sort((a, b) => b.postCount - a.postCount)

  const breadcrumbItems = [
    { name: 'Home', url: 'https://www.sozim.co.za' },
    { name: 'News', url: 'https://www.sozim.co.za/news' },
    { name: 'Categories', url: 'https://www.sozim.co.za/news/category' },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify(getWebPageSchema({
          name: 'Categories | News | Sozim',
          description: 'Browse news articles by category.',
          url: 'https://www.sozim.co.za/news/category',
          type: 'CollectionPage',
          breadcrumb: breadcrumbItems,
        }))
      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify(getBreadcrumbSchema(breadcrumbItems))
      }} />

      <Breadcrumb />
      <PageHeader
        title="News Categories"
        details="Browse news articles by topic. Click a category to see all articles in that topic."
      />

      <section className="py-12 md:py-16 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {categoriesWithCount.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoriesWithCount.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/news/category/${cat.slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all"
                >
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{cat.description}</p>
                  )}
                  <span className="inline-block mt-4 text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    {cat.postCount} {cat.postCount === 1 ? 'article' : 'articles'}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-lg text-gray-500">No categories yet.</p>
              <Link href="/news" className="text-sm text-indigo-600 hover:text-indigo-700 mt-2 inline-block">
                View all news →
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
