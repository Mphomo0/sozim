// src/components/UserPersonalDetailsSection.tsx
'use client'
import { UseFormReturn } from 'react-hook-form'
import { FormValues, provinces } from '@/lib/schema'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'react-toastify'

type Props = {
  form: UseFormReturn<FormValues>
}

export default function UserPersonalDetailsSection({ form }: Props) {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = form

  // Helper to watch nationality to auto-set application-level nationality
  const userNationality = watch('user.nationality')

  // Keep the application-level 'nationality' field (for backward compatibility/schema adherence)
  // in sync with the user's main nationality.
  // Note: The Mongoose schema has two `nationality` fields, one in the root and one in `user`.
  // We prioritize the `user.nationality` for this section.

  // You might want to remove the root 'nationality' field from the Mongoose schema if it's redundant.

  return (
    <div className="space-y-6 p-6 border rounded-xl bg-gray-50">
      <h2 className="font-bold text-3xl text-primary border-b pb-2">
        1. Personal Details (Applicant)
      </h2>
      <p className="text-gray-600 text-sm">
        * Please ensure all fields are accurate.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field>
          <FieldLabel htmlFor="firstName">First Name</FieldLabel>
          <Input
            id="firstName"
            placeholder="First Name"
            {...register('user.firstName')}
          />
          <FieldError>{errors.user?.firstName?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
          <Input
            id="lastName"
            placeholder="Last Name"
            {...register('user.lastName')}
          />
          <FieldError>{errors.user?.lastName?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email Address</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="Email Address"
            {...register('user.email')}
          />
          <FieldError>{errors.user?.email?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="idNumber">ID/Passport Number</FieldLabel>
          <Input
            id="idNumber"
            placeholder="ID/Passport Number"
            {...register('user.idNumber')}
          />
          <FieldError>{errors.user?.idNumber?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="dob">Date of Birth</FieldLabel>
          <Input id="dob" type="date" {...register('user.dob')} />
          <FieldError>{errors.user?.dob?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
          <Input
            id="phone"
            placeholder="Phone Number"
            {...register('user.phone')}
          />
          <FieldError>{errors.user?.phone?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="alternativeNumber">
            Alternative Number (Optional)
          </FieldLabel>
          <Input
            id="alternativeNumber"
            placeholder="Alternative Number"
            {...register('user.alternativeNumber')}
          />
          <FieldError>{errors.user?.alternativeNumber?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="nationality">Nationality</FieldLabel>
          <Input
            id="nationality"
            placeholder="e.g. South African"
            {...register('user.nationality')}
          />
          <FieldError>{errors.user?.nationality?.message}</FieldError>
        </Field>

        <Field className="md:col-span-2">
          <FieldLabel htmlFor="address">Residential Address</FieldLabel>
          <Textarea
            id="address"
            placeholder="Residential Address"
            {...register('user.address')}
          />
          <FieldError>{errors.user?.address?.message}</FieldError>
        </Field>
      </div>
    </div>
  )
}
