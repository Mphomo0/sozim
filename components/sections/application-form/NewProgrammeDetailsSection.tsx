'use client'

import { useState, useEffect, useRef } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useUser } from '@clerk/nextjs'
import { FormValues } from '@/lib/schema'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

type Props = {
  form: UseFormReturn<FormValues>
  isAdmin?: boolean
}

interface Course {
  _id: string
  name: string
  isOpen: boolean
}

import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

export default function NewProgrammeDetailsSection({ form, isAdmin: isAdminProp }: Props) {
  const { user, isLoaded } = useUser()

  const isAdminFromUser = 
    isLoaded && 
    user && 
    user.publicMetadata?.role === 'ADMIN'

  const isAdmin = isAdminProp !== undefined ? isAdminProp : isAdminFromUser

  const coursesRaw = useQuery(api.courses.getCourses)
  const allCourses = coursesRaw || []
  const courses = isAdmin ? allCourses : allCourses.filter((c) => c.isOpen)
  
  const [courseKey, setCourseKey] = useState(0)
  const courseValue = form.watch('courseId')
  const prevCourseRef = useRef(courseValue)

  useEffect(() => {
    if (prevCourseRef.current !== courseValue && courseValue) {
      prevCourseRef.current = courseValue
      setCourseKey(k => k + 1)
    }
  }, [courseValue])

  const selectedCourse = allCourses.find((c) => c._id === courseValue)
  const isSelectedCourseClosed = courseValue && selectedCourse && !selectedCourse.isOpen

  return (
    <div className="space-y-6 p-6 border rounded-xl bg-gray-50">
      <h2 className="font-bold text-3xl text-primary border-b pb-2">
        New Programme Details
      </h2>
      <p className="text-gray-600 text-sm">* What you would like to study?</p>

      {/* Qualification Type */}
      <Field>
        <FieldLabel>Qualification Type</FieldLabel>
        <RadioGroup
          value={form.watch('qualificationType') || ''}
          onValueChange={(value) =>
            form.setValue(
              'qualificationType',
              value as 'undergraduate' | 'postgraduate'
            )
          }
          className="space-y-4"
        >
          <label className="flex items-start gap-3 p-3 border rounded-lg bg-white hover:bg-gray-100">
            <RadioGroupItem value="undergraduate" id="undergraduate" />
            <p className="font-medium">Undergraduate</p>
          </label>

          <label className="flex items-start gap-3 p-3 border rounded-lg bg-white hover:bg-gray-100">
            <RadioGroupItem value="postgraduate" id="postgraduate" />
            <p className="font-medium">Postgraduate</p>
          </label>
        </RadioGroup>
        <FieldError>
          {form.formState.errors.qualificationType?.message}
        </FieldError>
      </Field>

      {/* Programme Name */}
      <Field>
        <FieldLabel htmlFor="courseId">Programme Name</FieldLabel>
        <Select
          key={courseKey}
          onValueChange={(value) => form.setValue('courseId', value)}
          value={courseValue || ''}
        >
          <SelectTrigger id="programmeName">
            <SelectValue placeholder="Select a programme" />
          </SelectTrigger>
          <SelectContent>
            {courses.length === 0 && !isAdmin ? (
              <div className="px-2 py-4 text-sm text-gray-500 text-center">
                No programmes currently open for applications
              </div>
            ) : (
              courses.map((course) => (
                <SelectItem key={course._id} value={course._id}>
                  {course.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        <FieldError>{form.formState.errors.courseId?.message}</FieldError>
      </Field>

      {/* Closed course warning */}
      {isSelectedCourseClosed && !isAdmin && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-800 font-medium">
            Applications for this programme are currently closed. Please select a different programme or contact us for more information.
          </p>
        </div>
      )}

      {/* Programme Status – ADMIN ONLY */}
      {isAdmin && (
        <Field>
          <FieldLabel htmlFor="status">Programme Status</FieldLabel>
          <Select
            onValueChange={(value) =>
              form.setValue(
                'status',
                value as 'PENDING' | 'APPROVED' | 'REJECTED'
              )
            }
            value={form.getValues('status') || ''}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <FieldError>{form.formState.errors.status?.message}</FieldError>
        </Field>
      )}
    </div>
  )
}
