import React from 'react'
import { Modal } from './Modal'
import { CategoryForm } from './CategoryForm'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { courseCategorySchema, CourseCategoryInput } from './types'

export function CreateCategoryModal({
  isOpen,
  onClose,
  onCreate,
}: {
  isOpen: boolean
  onClose: () => void
  onCreate: (data: CourseCategoryInput) => Promise<void>
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CourseCategoryInput>({
    resolver: zodResolver(courseCategorySchema),
    defaultValues: { name: '', code: '', description: '' },
  })

  const handleCreate = async (data: CourseCategoryInput) => {
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
          onClick={handleSubmit(handleCreate)}
        >
          Create
        </button>
      }
    >
      <CategoryForm register={register} errors={errors} />
    </Modal>
  )
}
