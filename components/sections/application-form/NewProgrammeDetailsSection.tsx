'use client'

import { useState, useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useSession } from 'next-auth/react'
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
}

interface Course {
  _id: string
  name: string
}

export default function NewProgrammeDetailsSection({ form }: Props) {
  const [courses, setCourses] = useState<Course[]>([])

  const { data: session, status } = useSession()

  const isAdmin = status === 'authenticated' && session?.user?.role === 'ADMIN'

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses')
      const data = await response.json()
      setCourses(data.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

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
          value={form.watch('qualificationType')}
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
          onValueChange={(value) => form.setValue('courseId', value)}
          defaultValue={form.getValues('courseId')}
        >
          <SelectTrigger id="programmeName">
            <SelectValue placeholder="Select a programme" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((course) => (
              <SelectItem key={course._id} value={course._id}>
                {course.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError>{form.formState.errors.courseId?.message}</FieldError>
      </Field>

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
            defaultValue={form.getValues('status')}
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
