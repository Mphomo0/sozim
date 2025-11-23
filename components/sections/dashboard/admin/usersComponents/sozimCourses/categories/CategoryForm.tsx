'use client'
import React from 'react'
import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { CourseCategoryInput } from './types'

export function CategoryForm({
  register,
  errors,
}: {
  register: UseFormRegister<CourseCategoryInput>
  errors: FieldErrors<CourseCategoryInput>
}) {
  return (
    <div className="space-y-4">
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
    </div>
  )
}
