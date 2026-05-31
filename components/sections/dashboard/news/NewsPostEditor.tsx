'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { newsPostSchema, NewsPostInput } from './NewsPostFormTypes'
import { toast } from 'react-toastify'
import { NewsPostForm } from './NewsPostForm'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface NewsPostEditorProps {
  postId?: Id<'newsPosts'>
}

export function NewsPostEditor({ postId }: NewsPostEditorProps) {
  const router = useRouter()
  const createNewsPost = useMutation(api.newsPosts.createNewsPost)
  const updateNewsPost = useMutation(api.newsPosts.updateNewsPost)
  const existingPost = useQuery(
    api.newsPosts.getNewsPostById,
    postId ? { id: postId } : 'skip'
  )

  const form = useForm<NewsPostInput>({
    resolver: zodResolver(newsPostSchema) as any,
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featuredImage: '',
      status: 'draft',
      categoryIds: [],
      tagIds: [],
      seoTitle: '',
      seoDescription: '',
      publishedAt: '',
    },
  })

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = form

  useEffect(() => {
    if (existingPost && existingPost._id) {
      setValue('title', existingPost.title)
      setValue('slug', existingPost.slug)
      setValue('excerpt', existingPost.excerpt || '')
      setValue('content', existingPost.content)
      setValue('featuredImage', existingPost.featuredImage || '')
      setValue('status', existingPost.status as 'draft' | 'published')
      setValue('publishedAt', existingPost.publishedAt ? new Date(existingPost.publishedAt).toISOString().slice(0, 16) : '')
      setValue('seoTitle', existingPost.seoTitle || '')
      setValue('seoDescription', existingPost.seoDescription || '')
      setValue('categoryIds', existingPost.categoryIds || [])
      setValue('tagIds', existingPost.tagIds || [])
    }
  }, [existingPost, setValue])

  const onSubmit = async (data: NewsPostInput) => {
    try {
      const publishedAt = data.publishedAt ? new Date(data.publishedAt).getTime() : undefined

      if (postId) {
        await updateNewsPost({
          id: postId,
          title: data.title,
          content: data.content,
          status: data.status,
          slug: data.slug || undefined,
          excerpt: data.excerpt || undefined,
          featuredImage: data.featuredImage || undefined,
          publishedAt,
          seoTitle: data.seoTitle || undefined,
          seoDescription: data.seoDescription || undefined,
          categoryIds: data.categoryIds as Id<'newsCategories'>[],
          tagIds: (data.tagIds || []) as Id<'newsTags'>[],
        })
        toast.success('Article updated successfully')
      } else {
        await createNewsPost({
          title: data.title,
          slug: data.slug || undefined,
          excerpt: data.excerpt || undefined,
          content: data.content,
          featuredImage: data.featuredImage || undefined,
          status: data.status,
          publishedAt,
          seoTitle: data.seoTitle || undefined,
          seoDescription: data.seoDescription || undefined,
          categoryIds: data.categoryIds as Id<'newsCategories'>[],
          tagIds: (data.tagIds || []) as Id<'newsTags'>[],
        })
        toast.success('Article created successfully')
      }
      router.push('/dashboard/news')
      router.refresh()
    } catch (err) {
      console.error(err)
      toast.error(err instanceof Error ? err.message : 'Failed to save article')
    }
  }

  if (postId && existingPost === undefined) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <NewsPostForm
        register={register}
        errors={errors}
        setValue={setValue}
        watch={watch}
      />

      <div className="flex justify-end gap-4 pt-8 border-t border-gray-100">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/dashboard/news')}
          className="px-6 h-11 text-gray-600 hover:bg-gray-50 border-gray-200 rounded-xl"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-11 rounded-xl font-medium shadow-sm transition-all active:scale-95"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            postId ? 'Update Article' : 'Create Article'
          )}
        </Button>
      </div>
    </form>
  )
}
