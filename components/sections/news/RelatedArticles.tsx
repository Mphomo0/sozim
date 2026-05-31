import Link from 'next/link'
import Image from 'next/image'

interface RelatedArticle {
  _id: string
  title: string
  slug: string
  excerpt?: string
  featuredImage?: string
  publishedAt?: number
}

export function RelatedArticles({ articles }: { articles: RelatedArticle[] }) {
  if (articles.length === 0) return null

  return (
    <section className="mt-16 pt-12 border-t border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Link
            key={article._id}
            href={`/news/${article.slug}`}
            className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all"
          >
            {article.featuredImage && (
              <div className="overflow-hidden">
                <Image
                  src={article.featuredImage}
                  alt={article.title}
                  width={400}
                  height={225}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 text-sm">
                {article.title}
              </h3>
              {article.excerpt && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{article.excerpt}</p>
              )}
              {article.publishedAt && (
                <time className="text-xs text-gray-400 mt-2 block">
                  {new Date(article.publishedAt).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' })}
                </time>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
