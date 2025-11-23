import { z } from 'zod'

// Zod validation schema for frontend forms
export const courseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  description: z.string().optional(),
  duration: z.string(),
  isOpen: z.boolean(),
  categoryId: z.string().min(1, 'Category is required'),
})

export type CourseInput = z.infer<typeof courseSchema>

export type Course = {
  _id: string
  name: string
  code: string
  description?: string
  duration: string
  isOpen: boolean
  categoryId: string | { _id: string; name: string }
}
