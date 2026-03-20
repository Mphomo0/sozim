'use client'

import React, { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm, Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { courseSchema, CourseInput, Course } from './types'
import { toast } from 'react-toastify'
import { CourseForm } from './CourseForm'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'

export function EditCourse() {
  const router = useRouter()
  const { id } = useParams()
  
  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CourseInput>({
    resolver: zodResolver(courseSchema) as unknown as Resolver<CourseInput>,
    defaultValues: {
      name: '',
      code: '',
      description: '',
      duration: '',
      isOpen: true,
      categoryId: '',
      qualification: '',
      level: '',
      creditTotals: {},
      modules: {
        knowledgeModules: [],
        practicalSkillModules: [],
        workExperienceModules: [],
      },
      entryRequirements: [],
    },
  })

  // Convex queries structure
  const courseId = typeof id === 'string' ? (id as Id<'courses'>) : undefined
  const course = useQuery(api.courses.getCourseById, courseId ? { id: courseId } : "skip")
  const updateCourseMut = useMutation(api.courses.updateCourse)

  useEffect(() => {
    if (course) {
      reset({
        name: course.name,
        code: course.code,
        description: course.description || '',
        duration: course.duration || '',
        isOpen: course.isOpen ?? true,
        qualification: course.qualification || '',
        level: course.level || '',
        categoryId: typeof course.categoryId === 'string' ? course.categoryId : course.actualCategoryId || '',
        modules: {
          knowledgeModules: course.modules?.knowledgeModules || [],
          practicalSkillModules: course.modules?.practicalSkillModules || [],
          workExperienceModules: course.modules?.workExperienceModules || [],
        },
        creditTotals: course.creditTotals || {},
        entryRequirements: course.entryRequirements || [],
      })
    }
  }, [course, reset])

  const onSubmit = async (data: CourseInput) => {
    if (!courseId) return

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

      await updateCourseMut({
        id: courseId,
        name: data.name,
        code: data.code,
        description: data.description,
        duration: data.duration,
        isOpen: data.isOpen,
        qualification: data.qualification,
        level: data.level,
        categoryId: data.categoryId,
        modules: cleanedModules,
        creditTotals: data.creditTotals,
        entryRequirements: data.entryRequirements,
      })

      toast.success('Course updated successfully')
      router.push('/dashboard/admin/courses')
    } catch (err) {
      console.error(err)
      toast.error('Failed to update course')
    }
  }

  if (course === undefined) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in duration-500">
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
