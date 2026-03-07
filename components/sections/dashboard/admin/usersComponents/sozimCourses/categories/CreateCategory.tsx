'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { courseCategorySchema, CourseCategoryInput } from './types'
import { toast } from 'react-toastify'
import { CategoryForm } from './CategoryForm'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export function CreateCategory() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CourseCategoryInput>({
    resolver: zodResolver(courseCategorySchema),
    defaultValues: { name: '', code: '', description: '' },
  })

  const onSubmit = async (data: CourseCategoryInput) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name.trim(),
          code: data.code.trim(),
          description: data.description?.trim() || undefined,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Creation failed')
      }

      toast.success('Category created successfully')
      router.push('/dashboard/admin/courses/category')
      router.refresh()
    } catch (err) {
      console.error(err)
      toast.error(err instanceof Error ? err.message : 'Failed to create category')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 gap-8 max-w-2xl">
        <CategoryForm register={register} errors={errors} />
      </div>

      <div className="flex justify-end gap-4 pt-8 border-t border-gray-100 max-w-2xl">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/dashboard/admin/courses/category')}
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
              Creating...
            </>
          ) : (
            'Create Category'
          )}
        </Button>
      </div>
    </form>
  )
}
