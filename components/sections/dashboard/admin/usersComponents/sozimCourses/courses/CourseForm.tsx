'use client'

import { useEffect, useState } from 'react'
import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { CourseInput } from './types'

type Category = {
  _id: string
  name: string
}

type CourseFormProps = {
  register: UseFormRegister<CourseInput>
  errors: FieldErrors<CourseInput>
}

export function CourseForm({ register, errors }: CourseFormProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch categories from API
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories') // adjust endpoint if needed
        if (!res.ok) throw new Error('Failed to fetch categories')
        const data: Category[] = await res.json()
        setCategories(data)
      } catch (error) {
        console.error('Failed to fetch categories', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return (
    <div className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          {...register('name')}
          className="w-full p-3 border border-gray-300 rounded-lg"
          placeholder="e.g., Computer Science"
        />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Code */}
      <div>
        <label className="block text-sm font-medium mb-1">Code</label>
        <input
          {...register('code')}
          className="w-full p-3 border border-gray-300 rounded-lg"
          placeholder="e.g., CS"
        />
        {errors.code && (
          <p className="text-sm text-red-600">{errors.code.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Description (optional)
        </label>
        <textarea
          {...register('description')}
          className="w-full p-3 border border-gray-300 rounded-lg h-32 resize-none"
          placeholder="Write description..."
        />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* Duration */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Duration (optional)
        </label>
        <input
          {...register('duration')}
          className="w-full p-3 border border-gray-300 rounded-lg"
          placeholder="e.g., 6 months"
        />
        {errors.duration && (
          <p className="text-sm text-red-600">{errors.duration.message}</p>
        )}
      </div>

      {/* Open for applications */}
      <div className="flex items-center gap-2">
        <input
          {...register('isOpen')}
          type="checkbox"
          className="h-4 w-4"
          defaultChecked={true} // default to true if undefined
        />
        <label className="text-sm">Open for applications</label>
      </div>

      {/* Category ID */}
      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        {loading ? (
          <p className="text-sm text-gray-500">Loading categories...</p>
        ) : (
          <select
            {...register('categoryId', { required: 'Category is required' })}
            className="w-full p-3 border border-gray-300 rounded-lg"
            defaultValue=""
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        )}
        {errors.categoryId && (
          <p className="text-sm text-red-600">{errors.categoryId.message}</p>
        )}
      </div>
    </div>
  )
}
