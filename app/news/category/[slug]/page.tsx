import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCachedNewsCategoryBySlug, getCachedNewsTags } from '@/lib/newsQueries'
import { NewsCategoryPageContent } from './NewsCategoryPageContent'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCachedNewsCategoryBySlug(slug)

  if (!category) {
    return { title: 'Not Found | Sozim' }
  }

  const title = category.seoTitle || `${category.name} News | Sozim`
  const description = category.seoDescription || category.description || `Browse news articles in the ${category.name} category.`

  return {
    title,
    description,
    openGraph: { title, description, url: `https://www.sozim.co.za/news/category/${category.slug}`, siteName: 'Sozim' },
    alternates: { canonical: `https://www.sozim.co.za/news/category/${category.slug}` },
  }
}

export default async function NewsCategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = await getCachedNewsCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  const tags = await getCachedNewsTags()

  return <NewsCategoryPageContent category={category} tags={tags} />
}
