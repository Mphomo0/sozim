import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCachedNewsTags, getCachedNewsTagBySlug, getCachedNewsCategories } from '@/lib/newsQueries'
import { NewsTagPageContent } from './NewsTagPageContent'

export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams() {
  try {
    const tags = await getCachedNewsTags()
    return tags.filter((t) => t.slug).map((t) => ({ slug: t.slug }))
  } catch {
    return []
  }
}

interface TagPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params
  const tag = await getCachedNewsTagBySlug(slug)

  if (!tag) {
    return { title: 'Not Found | Sozim' }
  }

  const title = `Tag: ${tag.name} | Sozim`
  const description = tag.description || `Browse news articles tagged with ${tag.name}.`

  return {
    title,
    description,
    openGraph: { title, description, url: `https://www.sozim.co.za/news/tag/${tag.slug}`, siteName: 'Sozim' },
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
