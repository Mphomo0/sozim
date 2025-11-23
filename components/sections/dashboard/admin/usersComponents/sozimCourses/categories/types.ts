import { z } from 'zod'

// Zod validation schema for frontend forms
export const courseCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  description: z.string().optional(),
})

export type CourseCategoryInput = z.infer<typeof courseCategorySchema>

export type CourseCategory = {
  _id: string
  name: string
  code: string
  description?: string
  courses?: string[]
}
