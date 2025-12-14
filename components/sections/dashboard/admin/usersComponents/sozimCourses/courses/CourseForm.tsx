'use client'

import { useEffect, useState } from 'react'
import {
  UseFormRegister,
  FieldErrors,
  Control,
  useFieldArray,
} from 'react-hook-form'
import { CourseInput } from './types'

type Category = {
  _id: string
  name: string
}

type CourseFormProps = {
  register: UseFormRegister<CourseInput>
  errors: FieldErrors<CourseInput>
  control: Control<CourseInput>
}

export function CourseForm({ register, errors, control }: CourseFormProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories')
        if (!res.ok) throw new Error('Failed to fetch categories')
        const data: Category[] = await res.json()
        setCategories(data)
      } catch (err) {
        console.error('Failed to fetch categories', err)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  // Field arrays
  const knowledgeFA = useFieldArray({
    control,
    name: 'modules.knowledgeModules',
  })
  const practicalFA = useFieldArray({
    control,
    name: 'modules.practicalSkillModules',
  })
  const workFA = useFieldArray({
    control,
    name: 'modules.workExperienceModules',
  })
  const entryReqFA = useFieldArray({
    control,
    name: 'entryRequirements' as any,
  })

  return (
    <div className="space-y-6">
      {/* NAME */}
      <div>
        <label className="block text-sm font-medium mb-1">Course Name</label>
        <input
          {...register('name')}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* CODE */}
      <div>
        <label className="block text-sm font-medium mb-1">Code</label>
        <input
          {...register('code')}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        {errors.code && (
          <p className="text-sm text-red-600">{errors.code.message}</p>
        )}
      </div>

      {/* QUALIFICATION */}
      <div>
        <label className="block text-sm font-medium mb-1">Qualification</label>
        <input
          {...register('qualification')}
          className="w-full p-3 border border-gray-300 rounded-lg"
          placeholder="e.g., Bachelor's"
        />
        {errors.qualification && (
          <p className="text-sm text-red-600">{errors.qualification.message}</p>
        )}
      </div>

      {/* LEVEL */}
      <div>
        <label className="block text-sm font-medium mb-1">Level</label>
        <input
          {...register('level')}
          className="w-full p-3 border border-gray-300 rounded-lg"
          placeholder="e.g., 7"
        />
        {errors.level && (
          <p className="text-sm text-red-600">{errors.level.message}</p>
        )}
      </div>

      {/* DESCRIPTION */}
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          {...register('description')}
          className="w-full p-3 border border-gray-300 rounded-lg h-44"
        />
      </div>

      {/* DURATION */}
      <div>
        <label className="block text-sm font-medium mb-1">Duration</label>
        <input
          {...register('duration')}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        {errors.duration && (
          <p className="text-sm text-red-600">{errors.duration.message}</p>
        )}
      </div>

      {/* OPEN */}
      <div className="flex items-center gap-2">
        <input {...register('isOpen')} type="checkbox" />
        <label>Open for Applications</label>
      </div>

      {/* CATEGORY */}
      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        {loading ? (
          <p className="text-sm text-gray-500">Loading categories...</p>
        ) : (
          <select
            {...register('categoryId')}
            className="w-full p-3 border border-gray-300 rounded-lg"
            defaultValue=""
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        )}
        {errors.categoryId && (
          <p className="text-sm text-red-600">{errors.categoryId.message}</p>
        )}
      </div>

      {/* MODULES */}
      {['knowledge', 'practicalSkill', 'workExperience'].map((type) => {
        const fieldArray =
          type === 'knowledge'
            ? knowledgeFA
            : type === 'practicalSkill'
            ? practicalFA
            : workFA
        const title =
          type === 'knowledge'
            ? 'Knowledge Modules'
            : type === 'practicalSkill'
            ? 'Practical Skill Modules'
            : 'Work Experience Modules'
        const fieldName =
          type === 'knowledge'
            ? 'modules.knowledgeModules'
            : type === 'practicalSkill'
            ? 'modules.practicalSkillModules'
            : 'modules.workExperienceModules'

        return (
          <div key={type} className="border p-4 rounded-lg">
            <h3 className="font-bold mb-3">{title}</h3>
            {fieldArray.fields.map((field, index) => (
              <div key={field.id} className="mb-4 border-b pb-4">
                <input
                  {...register(`${fieldName}.${index}.title` as const)}
                  placeholder="Module title"
                  className="w-full p-2 border rounded mb-2"
                />
                <input
                  {...register(`${fieldName}.${index}.nqfLevel` as const)}
                  placeholder="NQF Level"
                  className="w-full p-2 border rounded mb-2"
                />
                <input
                  {...register(`${fieldName}.${index}.credits` as const)}
                  placeholder="Credits"
                  className="w-full p-2 border rounded"
                />
                <button
                  type="button"
                  className="text-red-600 text-sm mt-2"
                  onClick={() => fieldArray.remove(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="px-3 py-2 bg-indigo-600 text-white text-sm rounded"
              onClick={() =>
                fieldArray.append({
                  title: '',
                  nqfLevel: undefined,
                  credits: undefined,
                })
              }
            >
              + Add {title.slice(0, -1)}
            </button>
          </div>
        )
      })}

      {/* ENTRY REQUIREMENTS */}
      <div className="border p-4 rounded-lg">
        <h3 className="font-bold mb-3">Entry Requirements</h3>
        {entryReqFA.fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-3 mb-3">
            <input
              {...register(`entryRequirements.${index}` as const)}
              className="w-full p-2 border rounded"
              placeholder="e.g., Grade 12 certificate"
            />
            <button
              type="button"
              className="text-red-600 text-sm"
              onClick={() => entryReqFA.remove(index)}
            >
              X
            </button>
          </div>
        ))}
        <button
          type="button"
          className="px-3 py-2 bg-indigo-600 text-white text-sm rounded"
          onClick={() => entryReqFA.append('')}
        >
          + Add Entry Requirement
        </button>
      </div>
    </div>
  )
}
