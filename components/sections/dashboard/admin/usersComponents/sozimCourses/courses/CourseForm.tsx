'use client'

import { useEffect, useState } from 'react'
import {
  UseFormRegister,
  FieldErrors,
  Control,
  useFieldArray,
} from 'react-hook-form'
import { CourseInput } from './types'
import { Trash2, X, Plus, BookOpen, Clock, Settings, ShieldAlert, GraduationCap, LayoutList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

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
  const categoriesReq = useQuery(api.categories.getCategories)
  const loading = categoriesReq === undefined
  const categories = categoriesReq || []

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
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* SECTION: BASIC INFO */}
      <div className="space-y-6 bg-white/50 border border-gray-100 p-6 sm:p-8 rounded-2xl shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-6">
          <BookOpen className="text-indigo-600 w-5 h-5" />
          <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Basic Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* NAME */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Course Name</label>
            <Input
              {...register('name')}
              className="h-11 bg-white border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl"
              placeholder="e.g. Higher Certificate in Wealth Management"
            />
            {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>}
          </div>

          {/* CODE */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Course Code</label>
            <Input
              {...register('code')}
              className="h-11 bg-white border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl font-mono text-sm"
              placeholder="e.g. HC-WM-01"
            />
            {errors.code && <p className="text-xs text-red-500 font-medium">{errors.code.message}</p>}
          </div>

          {/* QUALIFICATION */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Qualification</label>
            <Input
              {...register('qualification')}
              className="h-11 bg-white border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl"
              placeholder="e.g. Higher Certificate"
            />
            {errors.qualification && <p className="text-xs text-red-500 font-medium">{errors.qualification.message}</p>}
          </div>

          {/* LEVEL */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">NQF Level</label>
            <Input
              {...register('level')}
              className="h-11 bg-white border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl"
              placeholder="e.g. 5"
            />
            {errors.level && <p className="text-xs text-red-500 font-medium">{errors.level.message}</p>}
          </div>
          
          {/* DURATION */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Duration</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                {...register('duration')}
                className="pl-10 h-11 bg-white border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl"
                placeholder="e.g. 12 Months"
              />
            </div>
            {errors.duration && <p className="text-xs text-red-500 font-medium">{errors.duration.message}</p>}
          </div>

          {/* CATEGORY */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Category</label>
            {loading ? (
              <div className="h-11 flex items-center px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500">
                Loading categories...
              </div>
            ) : (
              <select
                {...register('categoryId')}
                className="w-full h-11 px-3 bg-white border border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl text-sm transition-all"
                defaultValue=""
              >
                <option value="" disabled>Select a categorization</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            )}
            {errors.categoryId && <p className="text-xs text-red-500 font-medium">{errors.categoryId.message}</p>}
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-2 pt-2">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            {...register('description')}
            className="w-full p-4 bg-white border border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl h-32 resize-y transition-all text-sm"
            placeholder="Write a comprehensive overview of this course..."
          />
        </div>

        {/* SETTINGS (IsOpen) */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">Application Status</span>
            <span className="text-xs text-gray-500">Allow users to apply for this course immediately.</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" {...register('isOpen')} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
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

      {/* SECTION: MODULES */}
      <div className="space-y-6 bg-white/50 border border-gray-100 p-6 sm:p-8 rounded-2xl shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-6">
          <LayoutList className="text-indigo-600 w-5 h-5" />
          <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Curriculum Structure</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {['knowledge', 'practicalSkill', 'workExperience'].map((type) => {
            const fieldArray =
              type === 'knowledge' ? knowledgeFA : type === 'practicalSkill' ? practicalFA : workFA
            const title =
              type === 'knowledge' ? 'Knowledge Modules' : type === 'practicalSkill' ? 'Practical Skill Modules' : 'Work Experience'
            const fieldName =
              type === 'knowledge' ? 'modules.knowledgeModules' : type === 'practicalSkill' ? 'modules.practicalSkillModules' : 'modules.workExperienceModules'

            return (
              <div key={type} className="flex flex-col border border-gray-100 bg-white/40 rounded-xl overflow-hidden">
                <div className="bg-gray-50/50 px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
                  <Badge variant="outline" className="bg-white text-xs">{fieldArray.fields.length}</Badge>
                </div>
                <div className="p-4 flex-1 flex flex-col gap-4">
                  {fieldArray.fields.length === 0 ? (
                    <div className="text-center py-6 text-sm text-gray-400 italic">No modules added yet.</div>
                  ) : (
                    fieldArray.fields.map((field, index) => (
                      <div key={field.id} className="relative group bg-white border border-gray-100 p-3 rounded-lg shadow-sm hover:shadow-md hover:border-indigo-100 transition-all space-y-3">
                        <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="h-6 w-6 rounded-full shadow-sm"
                            onClick={() => fieldArray.remove(index)}
                            title="Remove module"
                          >
                            <X size={12} />
                          </Button>
                        </div>
                        <Input
                          {...register(`${fieldName}.${index}.title` as const)}
                          placeholder="Module Title"
                          className="h-9 text-sm rounded-md border-gray-200 focus:border-indigo-500"
                        />
                        <div className="flex gap-2">
                           <Input
                            {...register(`${fieldName}.${index}.nqfLevel` as const)}
                            placeholder="Lvl"
                            className="h-9 w-1/3 text-sm rounded-md border-gray-200"
                          />
                          <Input
                            {...register(`${fieldName}.${index}.credits` as const)}
                            placeholder="Credits"
                            className="h-9 w-2/3 text-sm rounded-md border-gray-200"
                          />
                        </div>
                      </div>
                    ))
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-auto border-dashed border-gray-300 text-gray-600 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/50"
                    onClick={() => fieldArray.append({ title: '', nqfLevel: undefined, credits: undefined })}
                  >
                    <Plus size={14} className="mr-1" /> Add Module
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* SECTION: ENTRY REQUIREMENTS */}
      <div className="space-y-6 bg-white/50 border border-gray-100 p-6 sm:p-8 rounded-2xl shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-6">
          <ShieldAlert className="text-indigo-600 w-5 h-5" />
          <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Entry Requirements</h2>
        </div>

        <div className="space-y-3 max-w-2xl">
          {entryReqFA.fields.length === 0 ? (
             <div className="text-sm text-gray-400 italic py-2">No entry requirements specified.</div>
          ) : (
            entryReqFA.fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-3 animate-in slide-in-from-left-2 duration-300">
                <div className="h-2 w-2 rounded-full bg-indigo-200 shrink-0" />
                <Input
                  {...register(`entryRequirements.${index}` as const)}
                  className="flex-1 h-10 bg-white border-gray-200 focus:border-indigo-500 rounded-xl text-sm"
                  placeholder="e.g. National Senior Certificate (Grade 12)"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-rose-600 hover:bg-rose-50 h-10 w-10 shrink-0 rounded-xl"
                  onClick={() => entryReqFA.remove(index)}
                  title="Remove requirement"
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            ))
          )}
          
          <Button
            type="button"
            variant="ghost"
            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-2 mt-2 font-medium text-sm"
            onClick={() => entryReqFA.append('')}
          >
            <Plus size={16} className="mr-2" /> Add Requirement
          </Button>
        </div>
      </div>
    </div>
  )
}
