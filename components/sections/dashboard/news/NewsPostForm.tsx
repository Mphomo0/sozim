'use client'

import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { NewsPostInput } from './NewsPostFormTypes'
import { Input } from '@/components/ui/input'
import { RichTextEditor } from './RichTextEditor'
import { ImageUpload } from './ImageUpload'
import { useCallback } from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { FileText, Hash, Tag, Search, ImageIcon, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface NewsPostFormProps {
  register: UseFormRegister<NewsPostInput>
  errors: FieldErrors<NewsPostInput>
  setValue: UseFormSetValue<NewsPostInput>
  watch: UseFormWatch<NewsPostInput>
}

export function NewsPostForm({ register, errors, setValue, watch }: NewsPostFormProps) {
  const title = watch('title')
  const slug = watch('slug')
  const content = watch('content')
  const featuredImage = watch('featuredImage')
  const seoTitle = watch('seoTitle')
  const seoDescription = watch('seoDescription')
  const categoryIds = watch('categoryIds')
  const tagIds = watch('tagIds')

  const categories = useQuery(api.newsCategories.getNewsCategories)
  const tags = useQuery(api.newsTags.getNewsTags)

  const autoGenerateSlug = useCallback((title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }, [])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setValue('title', newTitle)
    if (!slug || slug === autoGenerateSlug(title || '')) {
      setValue('slug', autoGenerateSlug(newTitle))
    }
  }

  const handleExcerptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newExcerpt = e.target.value
    setValue('excerpt', newExcerpt)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Title & Status */}
      <div className="space-y-6 bg-white/50 border border-gray-100 p-6 sm:p-8 rounded-2xl shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-6">
          <FileText className="text-indigo-600 w-5 h-5" />
          <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Article Details</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Title *</label>
            <Input
              {...register('title')}
              onChange={handleTitleChange}
              className="h-11 bg-white border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl text-base"
              placeholder="e.g. How to Choose the Right Industrial Supplier in South Africa"
            />
            {errors.title && <p className="text-xs text-red-500 font-medium">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Slug</label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                {...register('slug')}
                className="pl-10 h-11 bg-white border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl font-mono text-sm"
                placeholder="auto-generated-from-title"
              />
            </div>
            {errors.slug && <p className="text-xs text-red-500 font-medium">{errors.slug.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <select
              {...register('status')}
              className="w-full h-11 px-3 bg-white border border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl text-sm transition-all"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            {errors.status && <p className="text-xs text-red-500 font-medium">{errors.status.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Published Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="datetime-local"
                {...register('publishedAt')}
                className="w-full pl-10 h-11 bg-white border border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl text-sm transition-all"
              />
            </div>
          </div>
        </div>

        {/* Excerpt */}
        <div className="space-y-2 pt-2">
          <label className="text-sm font-medium text-gray-700">
            Excerpt
            <span className="text-xs text-gray-400 ml-2">({(watch('excerpt') || '').length}/300 recommended)</span>
          </label>
            <textarea
              {...register('excerpt')}
              onChange={handleExcerptChange}
              className="w-full p-4 bg-white border border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl h-24 resize-y transition-all text-sm"
              placeholder="Brief summary for search results and social sharing..."
            />
          {errors.excerpt && <p className="text-xs text-red-500 font-medium">{errors.excerpt.message}</p>}
        </div>
      </div>

      {/* Featured Image */}
      <div className="space-y-6 bg-white/50 border border-gray-100 p-6 sm:p-8 rounded-2xl shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-6">
          <ImageIcon className="text-indigo-600 w-5 h-5" />
          <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Featured Image</h2>
        </div>
        <ImageUpload
          value={featuredImage}
          onChange={(url) => setValue('featuredImage', url)}
        />
      </div>

      {/* Content */}
      <div className="space-y-6 bg-white/50 border border-gray-100 p-6 sm:p-8 rounded-2xl shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-6">
          <FileText className="text-indigo-600 w-5 h-5" />
          <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Content *</h2>
        </div>
        <RichTextEditor
          content={content}
          onChange={(html) => setValue('content', html)}
        />
        {errors.content && <p className="text-xs text-red-500 font-medium">{errors.content.message}</p>}
      </div>

      {/* Categories */}
      <div className="space-y-6 bg-white/50 border border-gray-100 p-6 sm:p-8 rounded-2xl shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-6">
          <Tag className="text-indigo-600 w-5 h-5" />
          <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Categories & Tags</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Categories *</label>
            {!categories ? (
              <div className="h-11 flex items-center px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500">
                Loading categories...
              </div>
            ) : categories.length === 0 ? (
              <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-xl p-3">
                No categories found. Create one first.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const selected = (categoryIds || []).includes(cat._id)
                  return (
                    <button
                      key={cat._id}
                      type="button"
                      onClick={() => {
                        const current = categoryIds || []
                        setValue('categoryIds', selected
                          ? current.filter((id) => id !== cat._id)
                          : [...current, cat._id]
                        )
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                        selected
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
                      }`}
                    >
                      {cat.name}
                    </button>
                  )
                })}
              </div>
            )}
            {errors.categoryIds && <p className="text-xs text-red-500 font-medium">{errors.categoryIds.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Tags</label>
            {!tags ? (
              <div className="h-11 flex items-center px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500">
                Loading tags...
              </div>
            ) : tags.length === 0 ? (
              <div className="text-sm text-gray-400 bg-gray-50 border border-gray-200 rounded-xl p-3">
                No tags available.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                  const selected = (tagIds || []).includes(tag._id)
                  return (
                    <button
                      key={tag._id}
                      type="button"
                      onClick={() => {
                        const current = tagIds || []
                        setValue('tagIds', selected
                          ? current.filter((id) => id !== tag._id)
                          : [...current, tag._id]
                        )
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                        selected
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:text-emerald-600'
                      }`}
                    >
                      {tag.name}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SEO */}
      <div className="space-y-6 bg-white/50 border border-gray-100 p-6 sm:p-8 rounded-2xl shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-6">
          <Search className="text-indigo-600 w-5 h-5" />
          <h2 className="text-lg font-semibold text-gray-900 tracking-tight">SEO Metadata</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              SEO Title
              <span className={`text-xs ml-2 ${(seoTitle || '').length > 60 ? 'text-red-500' : 'text-gray-400'}`}>
                ({(seoTitle || '').length}/60)
              </span>
            </label>
            <Input
              {...register('seoTitle')}
              className="h-11 bg-white border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl"
              placeholder="Custom title for search engines"
            />
            {errors.seoTitle && <p className="text-xs text-red-500 font-medium">{errors.seoTitle.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              SEO Description
              <span className={`text-xs ml-2 ${(seoDescription || '').length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                ({(seoDescription || '').length}/160)
              </span>
            </label>
            <textarea
              {...register('seoDescription')}
              className="w-full p-3 bg-white border border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl h-20 resize-none transition-all text-sm"
              placeholder="Meta description for search results"
            />
            {errors.seoDescription && <p className="text-xs text-red-500 font-medium">{errors.seoDescription.message}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
