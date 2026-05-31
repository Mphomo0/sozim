import Link from 'next/link'
import type { NewsCategory, NewsTag } from '@/components/sections/dashboard/news/NewsPostFormTypes'

interface NewsSidebarProps {
  categories: (NewsCategory & { postCount?: number })[]
  tags: (NewsTag & { postCount?: number })[]
  recentPosts: { title: string; slug: string; publishedAt?: number }[]
}

export function NewsSidebar({ categories, tags, recentPosts }: NewsSidebarProps) {
  return (
    <aside className="space-y-8">
      {/* Categories */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Categories</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/news/category/${cat.slug}`}
              className="flex items-center justify-between text-sm text-gray-600 hover:text-indigo-600 transition-colors py-1.5 group"
            >
              <span className="group-hover:translate-x-1 transition-transform">{cat.name}</span>
              {cat.postCount !== undefined && (
                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{cat.postCount}</span>
              )}
            </Link>
          ))}
          {categories.length === 0 && (
            <p className="text-sm text-gray-400">No categories yet.</p>
          )}
        </div>
      </div>

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Recent Articles</h3>
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/news/${post.slug}`}
                className="block group"
              >
                <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                  {post.title}
                </p>
                {post.publishedAt && (
                  <time className="text-xs text-gray-400 mt-1 block">
                    {new Date(post.publishedAt).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </time>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag._id}
                href={`/news/tag/${tag.slug}`}
                className="text-xs font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-all"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}
