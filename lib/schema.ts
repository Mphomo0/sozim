import { z } from 'zod'

export const provinces = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'Northern Cape',
  'North West',
  'Western Cape',
] as const

const qualificationSchema = z.object({
  tertiaryQualification: z.enum(
    ['certificate', 'diploma', 'degree', 'postgraduate', 'masters', 'other'],
    { message: 'Required' }
  ),
  tertiaryQualificationOther: z.string().optional(),
  tertiaryQualificationName: z.string().optional(),
  tertiaryInstitution: z.string().optional(),
  yearCommenced: z.string().optional(),
  YearCompletedTertiary: z.string().optional(),
})

export const formSchema = z.object({
  fullNameCompany: z.string().optional(),
  sponsor: z.string().optional(),
  companyReg: z.string().optional(),
  sponsorEmail: z.email().or(z.literal('')).optional(),
  homeAddress: z.string().optional(),
  phoneNumber: z.string().optional(),
  alternativeNumber: z.string().optional(),
  selectYourRace: z.string().optional(),
  genderDebtor: z.string().optional(),
  nationality: z.string().optional(),
  employmentStatus: z.string().optional(),
  employerName: z.string().optional(),
  employmentSector: z.string().optional(),
  employerAddress: z.string().optional(),
  maritalStatus: z.string().optional(),
  status: z.string().optional(),
  deliveryAddress: z.string().optional(),
  provinceDelivery: z.string().optional(),
  postalCodeDelivery: z.string().optional(),
  // Made optional and removed explicit message
  deliveryMethod: z
    .enum(['postnet', 'paxi', 'electronically', 'campus-collect'])
    .optional(),
  // Made optional and removed explicit message
  highestGradeAchieved: z
    .enum(['grade-12-in-progress', 'grade-12-completed', 'other'])
    .optional(),
  highestGradeOther: z.string().optional(),
  yearCompleted: z.string().optional(),
  schoolAttended: z.string().optional(),
  schoolProvince: z.string().optional(),
  // Removed minimum requirement, made optional
  qualifications: z.array(qualificationSchema).optional(),
  // Made optional and removed explicit message
  qualificationType: z.enum(['undergraduate', 'postgraduate']).optional(),
  // Removed minimum length requirement, made optional
  courseId: z.string().optional(),
  // Made optional and removed explicit message
  socioEconomicStatus: z
    .enum([
      'employed',
      'unemployed-seeking',
      'unemployed-not-seeking',
      'pensioner',
      'student',
      'disabled',
    ])
    .optional(),
  // Made optional and removed explicit message
  homeLanguage: z
    .enum([
      'afrikaans',
      'english',
      'isindebele',
      'isixhosa',
      'isizulu',
      'sepedi',
      'siswati',
      'xitsonga',
      'setswana',
      'tshivenda',
      'other',
    ])
    .optional(),
  homeLanguageOther: z
    .string()
    .optional()
    .refine(
      (val) => val === undefined || val.trim().length > 0,
      'Please specify your home language'
    ),
  // Made optional and removed explicit message
  gender: z.enum(['male', 'female', 'not-disclose']).optional(),
  // Made optional and removed explicit message
  race: z
    .enum(['african', 'coloured', 'indian-asian', 'white', 'other'])
    .optional(),
  raceOther: z
    .string()
    .optional()
    .refine(
      (val) => val === undefined || val.trim().length > 0,
      'Please specify your race'
    ),
  // Made optional and removed explicit message
  specialNeeds: z.enum(['yes', 'none']).optional(),
  disabilities: z
    .object({
      seeing: z.enum(['1', '2', '3', '4', '5', '6']).optional(),
      hearing: z.enum(['1', '2', '3', '4', '5', '6']).optional(),
      communication: z.enum(['1', '2', '3', '4', '5', '6']).optional(),
      physical: z.enum(['1', '2', '3', '4', '5', '6']).optional(),
      emotional: z.enum(['1', '2', '3', '4', '5', '6']).optional(),
      intellectual: z.enum(['1', '2', '3', '4', '5', '6']).optional(),
    })
    .partial()
    .optional(),
  examRequirements: z.string().max(200, 'Max 200 characters').optional(),
  documents: z.array(
    z.object({
      url: z.url(),
      fileId: z.string().min(1, 'File ID is required'),
    })
  ),
  applicantId: z.string().optional(),
  // USER SCHEMA REMAINS AS REQUIRED
  user: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    idNumber: z
      .string()
      .min(13, 'ID Number must be 13 digits')
      .max(13, 'ID Number must be 13 digits'),
    phone: z
      .string()
      .min(10, 'Cellphone must be 10 digits')
      .max(10, 'Cellphone must be 10 digits'),
    alternativeNumber: z.string().optional(),
    email: z.email('Invalid email address'),
    address: z.string().min(5, 'Address is required'),
    nationality: z.string().min(1, 'Nationality is required'),
    dob: z
      .string()
      .min(1, 'Date of Birth is required')
      .refine(
        (value) => !Number.isNaN(Date.parse(value)),
        'Invalid date format'
      )
      .refine((value) => {
        const date = new Date(value)
        const today = new Date()
        const age =
          today.getFullYear() -
          date.getFullYear() -
          (today <
          new Date(today.getFullYear(), date.getMonth(), date.getDate())
            ? 1
            : 0)

        return age >= 16
      }, 'You must be at least 16 years old'),
  }),
})

export type FormValues = z.infer<typeof formSchema>
export type DisabilityKey = keyof NonNullable<FormValues['disabilities']>
