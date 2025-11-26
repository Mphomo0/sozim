import React, { useEffect } from 'react'
import { Modal } from './Modal'
import { CategoryForm } from './CategoryForm'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  courseCategorySchema,
  CourseCategory,
  CourseCategoryInput,
} from './types'

export function EditCategoryModal({
  isOpen,
  onClose,
  category,
  onEdit,
}: {
  isOpen: boolean
  onClose: () => void
  category: CourseCategory | null
  onEdit: (data: CourseCategoryInput) => Promise<void>
}) {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseCategoryInput>({
    resolver: zodResolver(courseCategorySchema),
  })

  useEffect(() => {
    if (category) reset(category)
  }, [category, reset])

  return (
    <Modal
      title="Edit Category"
      description="Modify the selected category."
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <button
          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg"
          onClick={handleSubmit(onEdit)}
        >
          Save Changes
        </button>
      }
    >
      <CategoryForm register={register} errors={errors} />
    </Modal>
  )
}
