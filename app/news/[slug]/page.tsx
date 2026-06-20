import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { optimizedImageUrl } from '@/lib/image'
import {
  getCachedNewsPostBySlug,
  getCachedNewsCategories,
  getCachedNewsTags,
  getCachedRelatedNewsPosts,
} from '@/lib/newsQueries'
import { RelatedArticles } from '@/components/sections/news/RelatedArticles'
import Breadcrumb from '@/components/global/Breadcrumb'
import {
  getArticleSchema,
  getWebPageSchema,
  getBreadcrumbSchema,
} from '@/lib/seo/schemas'
import { metaTitle, metaDescription, stripMarkup } from '@/lib/seo/meta'

// Pure ISR — no generateStaticParams so that Convex's fetchQuery doesn't
// conflict with Next.js's static/dynamic boundary enforcement in production.
export const revalidate = 3600

interface NewsArticlePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: NewsArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getCachedNewsPostBySlug(slug)

  if (!post || post.status === 'draft') {
    return { title: 'Not Found' }
  }

  // Root layout template appends " | Sozim" — don't add it here.
  const title = metaTitle(post.seoTitle || post.title)
  const description = metaDescription(
    post.seoDescription || post.excerpt || stripMarkup(post.content),
    `${post.title} — news and updates from Sozim College, Bloemfontein.`,
  )

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.sozim.co.za/news/${post.slug}`,
      siteName: 'Sozim',
      type: 'article',
      publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      images: post.featuredImage ? [{ url: post.featuredImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.featuredImage ? [post.featuredImage] : undefined,
    },
    alternates: {
      canonical: `https://www.sozim.co.za/news/${post.slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const { slug } = await params
  const post = await getCachedNewsPostBySlug(slug)

  if (!post || post.status === 'draft') {
    notFound()
  }

  const [categories, tags, relatedPosts] = await Promise.all([
    getCachedNewsCategories(),
    getCachedNewsTags(),
    getCachedRelatedNewsPosts(post._id as any, 3),
  ])

  const postCategories = categories.filter((c) => post.categoryIds.includes(c._id))
  const postTags = tags.filter((t) => post.tagIds.includes(t._id))

  const canonicalUrl = `https://www.sozim.co.za/news/${post.slug}`
  const breadcrumbItems = [
    { name: 'Home', url: 'https://www.sozim.co.za' },
    { name: 'News', url: 'https://www.sozim.co.za/news' },
    { name: post.title, url: canonicalUrl },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify(getArticleSchema({
          headline: post.title,
          description: post.excerpt || post.title,
          datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : new Date(post.createdAt).toISOString(),
          dateModified: new Date(post.updatedAt).toISOString(),
          url: canonicalUrl,
          image: post.featuredImage || 'https://www.sozim.co.za/og-image.jpg',
          keywords: postTags.map((t) => t.name),
          type: 'NewsArticle',
          articleSection: postCategories[0]?.name ?? 'News',
        }))
      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify(getWebPageSchema({
          name: post.title + ' | Sozim',
          description: post.excerpt || post.title,
          url: canonicalUrl,
          breadcrumb: breadcrumbItems,
        }))
      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify(getBreadcrumbSchema(breadcrumbItems))
      }} />

      <Breadcrumb />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {postCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {postCategories.map((cat) => (
              <Link
                key={cat._id}
                href={`/news/category/${cat.slug}`}
                className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100 hover:bg-indigo-100 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
          {post.publishedAt && (
            <time dateTime={new Date(post.publishedAt).toISOString()}>
              {format(post.publishedAt, 'MMMM d, yyyy')}
            </time>
          )}
          <span className="text-gray-300">|</span>
          <span>Sozim Team</span>
        </div>

        {post.featuredImage && (
          <div className="mb-10 rounded-2xl overflow-hidden">
            <Image
              src={optimizedImageUrl(post.featuredImage, 1200) ?? ''}
              alt={post.title}
              width={1200}
              height={675}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        )}

        {post.excerpt && (
          <p className="text-lg text-gray-600 leading-relaxed mb-8 font-medium">
            {post.excerpt}
          </p>
        )}

        <div
          className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-50/50 prose-blockquote:py-1 prose-code:text-indigo-700 prose-code:bg-indigo-50 prose-code:px-1.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100"
          dangerouslySetInnerHTML={{
            __html: post.content
              .replace(/<h1(\s[^>]*)?>/gi, '<h2$1>')
              .replace(/<\/h1>/gi, '</h2>'),
          }}
        />

        {postTags.length > 0 && (
          <div className="mt-10 pt-8 border-t border-gray-100">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Tags:</span>
              {postTags.map((tag) => (
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

        <div className="mt-10 pt-8 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <Link
              href="/news"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              ← Back to News
            </Link>
            <div className="flex items-center gap-4">
              {postCategories.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/news/category/${cat.slug}`}
                  className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
                >
                  More in {cat.name} →
                </Link>
              ))}
            </div>
          </div>
        </div>

        <RelatedArticles articles={relatedPosts.map((p) => ({
          _id: p._id,
          title: p.title,
          slug: p.slug,
          excerpt: p.excerpt,
          featuredImage: p.featuredImage,
          publishedAt: p.publishedAt,
        }))} />
      </article>
    </>
  )
}
