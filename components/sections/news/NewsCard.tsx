import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'

interface NewsCardProps {
  title: string
  slug: string
  excerpt?: string
  featuredImage?: string
  publishedAt?: number
  categoryNames?: { _id: string; name: string; slug: string }[]
}

export function NewsCard({ title, slug, excerpt, featuredImage, publishedAt, categoryNames }: NewsCardProps) {
  return (
    <article className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      {featuredImage && (
        <Link href={`/news/${slug}`} className="block overflow-hidden">
          <Image
            src={featuredImage}
            alt={title}
            width={800}
            height={450}
            className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
      )}
      <div className="p-6">
        {categoryNames && categoryNames.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {categoryNames.map((cat) => (
              <Link
                key={cat._id}
                href={`/news/category/${cat.slug}`}
                className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 hover:bg-indigo-100 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
          <Link href={`/news/${slug}`}>{title}</Link>
        </h3>
        {excerpt && (
          <p className="text-sm text-gray-500 line-clamp-3 mb-4">{excerpt}</p>
        )}
        <div className="flex items-center justify-between">
          {publishedAt && (
            <time className="text-xs text-gray-400" dateTime={new Date(publishedAt).toISOString()}>
              {format(publishedAt, 'MMMM d, yyyy')}
            </time>
          )}
          <Link
            href={`/news/${slug}`}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 group-hover:translate-x-1 transition-all"
          >
            Read More →
          </Link>
        </div>
      </div>
    </article>
  )
}
