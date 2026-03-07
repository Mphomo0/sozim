'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  courseCategorySchema,
  CourseCategory,
  CourseCategoryInput,
} from './types'
import { toast } from 'react-toastify'
import { CategoryForm } from './CategoryForm'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export function EditCategory() {
  const router = useRouter()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CourseCategoryInput>({
    resolver: zodResolver(courseCategorySchema),
  })

  useEffect(() => {
    async function fetchCategory() {
      if (!id) return
      try {
        const res = await fetch(`/api/categories/${id}`)
        if (!res.ok) throw new Error('Failed to fetch category')
        const data = await res.json()
        reset(data)
      } catch (err) {
        console.error(err)
        toast.error('Failed to load category')
        router.push('/dashboard/admin/courses/category')
      } finally {
        setLoading(false)
      }
    }
    fetchCategory()
  }, [id, reset, router])

  const onSubmit = async (data: CourseCategoryInput) => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name.trim(),
          code: data.code.trim(),
          description: data.description?.trim() || undefined,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Update failed')
      }

      toast.success('Category updated successfully')
      router.push('/dashboard/admin/courses/category')
      router.refresh()
    } catch (err) {
      console.error(err)
      toast.error(err instanceof Error ? err.message : 'Failed to update category')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
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
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </form>
  )
}
