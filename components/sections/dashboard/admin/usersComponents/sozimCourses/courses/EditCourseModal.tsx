'use client'

import React, { useEffect } from 'react'
import { Modal } from './Modal'
import { CourseForm } from './CourseForm'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { courseSchema, Course, CourseInput } from './types'
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
    formState: { errors },
  } = useForm<CourseInput>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
      duration: '',
      isOpen: true,
      categoryId: '',
    },
  })

  // Populate form when course changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (course) {
      reset({
        name: course.name,
        code: course.code,
        description: course.description || '',
        duration: course.duration || '',
        isOpen: course.isOpen ?? true,
        categoryId:
          typeof course.categoryId === 'string'
            ? course.categoryId
            : course.categoryId?._id || '',
      })
    }
  }, [course, reset])

  // Submit handler
  const onSubmit = async (data: CourseInput) => {
    if (!course) return
    try {
      await onEdit(data)
      toast.success('Course updated successfully')
      onClose()
    } catch (error: unknown) {
      toast.error('Failed to update course')
    }
  }

  return (
    <Modal
      title="Edit Course"
      description="Modify the selected course."
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <button
          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg"
          onClick={handleSubmit(onSubmit)}
        >
          Save Changes
        </button>
      }
    >
      <CourseForm register={register} errors={errors} />
    </Modal>
  )
}
