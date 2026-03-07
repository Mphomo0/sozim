'use client'
import React from 'react'
import { UseFormRegister, FieldErrors } from 'react-hook-form'
import { CourseCategoryInput } from './types'
import { Input } from '@/components/ui/input'
import { FileType } from 'lucide-react'

export function CategoryForm({
  register,
  errors,
}: {
  register: UseFormRegister<CourseCategoryInput>
  errors: FieldErrors<CourseCategoryInput>
}) {
  return (
    <div className="space-y-6 bg-white/50 border border-gray-100 p-6 sm:p-8 rounded-2xl shadow-sm backdrop-blur-sm animate-in fade-in duration-500">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-6">
        <FileType className="text-indigo-600 w-5 h-5" />
        <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Category Details</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Category Name</label>
          <Input
            {...register('name')}
            className="h-11 bg-white border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl"
            placeholder="e.g. Information Technology"
          />
          {errors.name && (
            <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Category Code</label>
          <Input
            {...register('code')}
            className="h-11 bg-white border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl font-mono text-sm uppercase"
            placeholder="e.g. IT"
          />
          {errors.code && (
            <p className="text-xs text-red-500 font-medium">{errors.code.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <label className="text-sm font-medium text-gray-700">
          Description (Optional)
        </label>
        <textarea
          {...register('description')}
          className="w-full p-4 bg-white border border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl h-32 resize-y transition-all text-sm"
          placeholder="Briefly describe this overarching category..."
        />
        {errors.description && (
          <p className="text-xs text-red-500 font-medium">{errors.description.message}</p>
        )}
      </div>
    </div>
  )
}
