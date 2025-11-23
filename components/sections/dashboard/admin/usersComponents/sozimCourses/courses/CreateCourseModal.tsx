import React from 'react'
import { Modal } from './Modal'
import { CourseForm } from './CourseForm'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { courseSchema, CourseInput } from './types'

export function CreateCourseModal({
  isOpen,
  onClose,
  onCreate,
}: {
  isOpen: boolean
  onClose: () => void
  onCreate: (data: CourseInput) => Promise<void>
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CourseInput>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
      duration: '',
      isOpen: false,
      categoryId: '',
    },
  })

  const handleCreate = async (data: CourseInput) => {
    await onCreate(data)
    reset()
  }

  return (
    <Modal
      title="Create Category"
      description="Add a new course category."
      isOpen={isOpen}
      onClose={() => {
        reset()
        onClose()
      }}
      footer={
        <button
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg"
          onClick={handleSubmit(handleCreate as any)}
        >
          Create
        </button>
      }
    >
      <CourseForm register={register} errors={errors} />
    </Modal>
  )
}
