import { z } from 'zod'

export const newsPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().optional(),
  excerpt: z.string().max(500, 'Excerpt must be under 500 characters').optional(),
  content: z.string().min(1, 'Content is required'),
  featuredImage: z.string().optional(),
  status: z.enum(['draft', 'published']),
  publishedAt: z.string().optional(),
  seoTitle: z.string().max(60, 'SEO title should be under 60 characters').optional(),
  seoDescription: z.string().max(160, 'SEO description should be under 160 characters').optional(),
  categoryIds: z.array(z.string()).min(1, 'At least one category is required'),
  tagIds: z.array(z.string()).default([]),
})

export type NewsPostInput = z.infer<typeof newsPostSchema>

export type NewsPost = {
  _id: string
  _creationTime: number
  title: string
  slug: string
  excerpt?: string
  content: string
  featuredImage?: string
  status: 'draft' | 'published'
  publishedAt?: number
  seoTitle?: string
  seoDescription?: string
  categoryIds: string[]
  tagIds: string[]
  authorId?: string
  createdAt: number
  updatedAt: number
}

export type NewsCategory = {
  _id: string
  _creationTime: number
  name: string
  slug: string
  description?: string
  seoTitle?: string
  seoDescription?: string
  createdAt: number
  updatedAt: number
}

export type NewsTag = {
  _id: string
  _creationTime: number
  name: string
  slug: string
  description?: string
  createdAt: number
  updatedAt: number
}

export const newsCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().optional(),
  description: z.string().optional(),
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
})

export type NewsCategoryInput = z.infer<typeof newsCategorySchema>

export const newsTagSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().optional(),
  description: z.string().optional(),
})

export type NewsTagInput = z.infer<typeof newsTagSchema>
