'use client'
import { UseFormReturn } from 'react-hook-form'
import { FormValues } from '@/lib/schema'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

type Props = {
  form: UseFormReturn<FormValues>
  isLoggedIn?: boolean
}

export default function StudentInformationSection({ form }: Props) {
  return (
    <div className='space-y-6 p-6 border rounded-xl bg-gray-50'>
      <h2 className='font-bold text-3xl text-primary border-b pb-2'>
        Student Information
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Field>
          <FieldLabel htmlFor='user.firstName'>First Name</FieldLabel>
          <Input
            id='user.firstName'
            placeholder='Enter first name'
            {...form.register('user.firstName')}
          />
          <FieldError>
            {form.formState.errors.user?.firstName?.message}
          </FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor='user.lastName'>Last Name</FieldLabel>
          <Input
            id='user.lastName'
            placeholder='Enter last name'
            {...form.register('user.lastName')}
          />
          <FieldError>
            {form.formState.errors.user?.lastName?.message}
          </FieldError>
        </Field>

        {/* NEW FIELD: Date of Birth */}
        <Field>
          <FieldLabel htmlFor='user.dob'>Date of Birth</FieldLabel>

          <Input
            type='date'
            id='user.dob'
            {...form.register('user.dob', {
              valueAsDate: true,
            })}
          />

          <FieldError>{form.formState.errors.user?.dob?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor='user.idNumber'>ID Number</FieldLabel>
          <Input
            id='user.idNumber'
            placeholder='Enter your ID number'
            {...form.register('user.idNumber')}
          />
          <FieldError>
            {form.formState.errors.user?.idNumber?.message}
          </FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor='user.phone'>Cellphone Number</FieldLabel>
          <Input
            id='user.phone'
            placeholder='Enter cellphone number'
            {...form.register('user.phone')}
          />
          <FieldError>{form.formState.errors.user?.phone?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor='user.alternativeNumber'>
            Alternative Number
          </FieldLabel>
          <Input
            id='user.alternativeNumber'
            placeholder='Enter alternative number'
            {...form.register('user.alternativeNumber')}
          />
          <FieldError>
            {form.formState.errors.user?.alternativeNumber?.message}
          </FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor='user.email'>Email Address</FieldLabel>
          <Input
            id='user.email'
            placeholder='Enter email'
            {...form.register('user.email')}
          />
          <FieldError>{form.formState.errors.user?.email?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor='user.nationality'>Nationality</FieldLabel>
          <Input
            id='user.nationality'
            placeholder='e.g South African'
            {...form.register('user.nationality')}
          />
          <FieldError>
            {form.formState.errors.user?.nationality?.message}
          </FieldError>
        </Field>

        <Field className='md:col-span-2'>
          <FieldLabel htmlFor='user.address'>Residential Address</FieldLabel>
          <Textarea
            id='user.address'
            placeholder='Enter your address'
            {...form.register('user.address')}
          />
          <FieldError>
            {form.formState.errors.user?.address?.message}
          </FieldError>
        </Field>
      </div>
    </div>
  )
}
