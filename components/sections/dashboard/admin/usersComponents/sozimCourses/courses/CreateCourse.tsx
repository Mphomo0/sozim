'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { courseSchema, CourseInput } from './types'
import { toast } from 'react-toastify'
import { CourseForm } from './CourseForm'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export function CreateCourse() {
  const router = useRouter()
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CourseInput>({
    resolver: zodResolver(courseSchema) as any,
    defaultValues: {
      name: '',
      code: '',
      description: '',
      duration: '',
      isOpen: true,
      categoryId: '',
      qualification: '',
      level: '',
      modules: {
        knowledgeModules: [],
        practicalSkillModules: [],
        workExperienceModules: [],
      },
      entryRequirements: [],
      creditTotals: {},
    },
  })

  const onSubmit = async (data: CourseInput) => {
    try {
      const cleanedModules = {
        knowledgeModules:
          data.modules?.knowledgeModules?.filter((m) => m.title.trim()) || [],
        practicalSkillModules:
          data.modules?.practicalSkillModules?.filter((m) => m.title.trim()) ||
          [],
        workExperienceModules:
          data.modules?.workExperienceModules?.filter((m) => m.title.trim()) ||
          [],
      }

      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          modules: cleanedModules,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to create')
      }

      toast.success('Course created successfully')
      router.push('/dashboard/admin/courses')
      router.refresh()
    } catch (err) {
      console.error(err)
      toast.error('Failed to create course')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 gap-8">
        <CourseForm register={register} errors={errors} control={control} />
      </div>

      <div className="flex justify-end gap-4 pt-8 border-t border-gray-100">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/dashboard/admin/courses')}
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
            'Create Course'
          )}
        </Button>
      </div>
    </form>
  )
}
