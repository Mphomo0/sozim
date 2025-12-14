import { z } from 'zod'

const moduleItem = z.object({
  title: z.string().min(1, 'Module title is required'),
  nqfLevel: z.coerce.number().optional(),
  credits: z.coerce.number().optional(),
})

export const courseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  description: z.string().optional(),
  duration: z.string(),
  isOpen: z.boolean(),
  categoryId: z.string().min(1, 'Category is required'),
  entryRequirements: z.array(z.string()),
  qualification: z.string().optional(),
  level: z.string().optional(),

  modules: z
    .object({
      knowledgeModules: z.array(moduleItem).optional(),
      practicalSkillModules: z.array(moduleItem).optional(),
      workExperienceModules: z.array(moduleItem).optional(),
    })
    .optional(),

  creditTotals: z
    .object({
      knowledge: z.number().optional(),
      practical: z.number().optional(),
      workExperience: z.number().optional(),
      total: z.number().optional(),
    })
    .optional(),
})

export type CourseInput = z.infer<typeof courseSchema>

// The manual Course type now aligns better with CourseInput
export type Course = {
  _id: string
  name: string
  code: string
  description?: string
  duration: string
  isOpen: boolean
  categoryId: string | { _id: string; name: string }
  qualification?: string
  level?: string

  modules?: {
    knowledgeModules?: { title: string; nqfLevel?: number; credits?: number }[]
    practicalSkillModules?: {
      title: string
      nqfLevel?: number
      credits?: number
    }[]
    workExperienceModules?: {
      title: string
      nqfLevel?: number
      credits?: number
    }[]
  }

  creditTotals?: {
    knowledge?: number
    practical?: number
    workExperience?: number
    total?: number
  }

  entryRequirements: string[]
}
