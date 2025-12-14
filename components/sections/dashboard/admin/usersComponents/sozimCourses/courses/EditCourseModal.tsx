'use client'

import { useEffect } from 'react'
import { Modal } from './Modal'
import { CourseForm } from './CourseForm'
import { useForm, Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { courseSchema, CourseInput, Course } from './types'
import { toast } from 'react-toastify'

type EditCourseModalProps = {
  isOpen: boolean
  onClose: () => void
  course: Course | null
  onEdit: (data: CourseInput) => Promise<void>
}

export function EditCourseModal({
  isOpen,
  onClose,
  course,
  onEdit,
}: EditCourseModalProps) {
  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors },
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

  // Load course data into the form when the course is available
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
        categoryId:
          typeof course.categoryId === 'string'
            ? course.categoryId
            : course.categoryId?._id || '',
        modules: {
          knowledgeModules: course.modules?.knowledgeModules || [], // Default to empty array if undefined
          practicalSkillModules: course.modules?.practicalSkillModules || [], // Default to empty array if undefined
          workExperienceModules: course.modules?.workExperienceModules || [], // Default to empty array if undefined
        },
        creditTotals: course.creditTotals || {},
        entryRequirements: course.entryRequirements || [],
      })
    }
  }, [course, reset])

  const onSubmit = async (data: CourseInput) => {
    console.log('Form data submitted: ', data) // Log the entire form data

    if (!course) return
    try {
      await onEdit(data)
      toast.success('Course updated successfully')
      onClose()
    } catch {
      toast.error('Failed to update course')
    }
  }

  return (
    <Modal
      title="Edit Course"
      description="Modify the selected course."
      isOpen={isOpen}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
        <CourseForm register={register} errors={errors} control={control} />
        <div className="mt-6">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  )
}
