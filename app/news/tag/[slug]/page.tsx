import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCachedNewsTagBySlug, getCachedNewsCategories } from '@/lib/newsQueries'
import { NewsTagPageContent } from './NewsTagPageContent'
import { metaTitle, metaDescription } from '@/lib/seo/meta'

// Pure ISR — no generateStaticParams so that Convex's fetchQuery doesn't
// conflict with Next.js's static/dynamic boundary enforcement in production.
export const revalidate = 3600

interface TagPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params
  const tag = await getCachedNewsTagBySlug(slug)

  if (!tag) {
    return { title: 'Not Found' }
  }

  // Root layout template appends " | Sozim" — don't add it here.
  const title = metaTitle(`${tag.name} News & Articles`)
  const description = metaDescription(
    tag.description,
    `Browse news articles tagged ${tag.name} from Sozim College, Bloemfontein — accredited education and training updates for South African students.`,
  )

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.sozim.co.za/news/tag/${tag.slug}`,
      siteName: 'Sozim',
      type: 'website',
      images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: `${tag.name} Articles – Sozim` }],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
      images: ['/og-image.jpg'],
      site: '@sozimtrading',
    },
    alternates: { canonical: `https://www.sozim.co.za/news/tag/${tag.slug}` },
    robots: { index: true, follow: true },
  }
}

export default async function NewsTagPage({ params }: TagPageProps) {
  const { slug } = await params
  const tag = await getCachedNewsTagBySlug(slug)

  if (!tag) {
    notFound()
  }

  const categories = await getCachedNewsCategories()

  return <NewsTagPageContent tag={tag} categories={categories} />
}
