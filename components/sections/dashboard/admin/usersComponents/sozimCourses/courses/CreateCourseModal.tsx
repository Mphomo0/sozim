'use client'

import React from 'react'
import { Modal } from './Modal'
import { CourseForm } from './CourseForm'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { courseSchema, CourseInput } from './types'
import { toast } from 'react-toastify'

type CreateCourseModalProps = {
  isOpen: boolean
  onClose: () => void
  onCreate: (data: CourseInput) => Promise<void>
}

export function CreateCourseModal({
  isOpen,
  onClose,
  onCreate,
}: CreateCourseModalProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
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
      // Remove empty modules before sending
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

      await onCreate({
        ...data,
        modules: cleanedModules,
      })

      toast.success('Course created successfully')
      reset()
      onClose()
    } catch (err) {
      toast.error('Failed to create course')
    }
  }

  return (
    <Modal
      title="Create New Course"
      isOpen={isOpen}
      onClose={onClose}
      description="Fill in the details for the new course."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
        <CourseForm register={register} errors={errors} control={control} />

        <button
          type="submit"
          className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Create Course
        </button>
      </form>
    </Modal>
  )
}
