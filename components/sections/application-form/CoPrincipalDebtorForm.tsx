'use client'
import { UseFormReturn } from 'react-hook-form'
import { FormValues } from '@/lib/schema'
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

type Props = {
  form: UseFormReturn<FormValues>
}

export default function CoPrincipalDebtorSection({ form }: Props) {
  return (
    <div className="space-y-6 p-6 border rounded-xl bg-gray-50">
      <h2 className="font-bold text-3xl text-primary border-b pb-2">
        Co-Principal Debtor Personal Information
      </h2>
      <p className="text-gray-600 text-sm">
        * To be completed by the Parent/Legal Guardian of a minor Student,
        and/or by any other party(other than the student) who take
        responsibility for the payment of the student's fees in terms of the
        Registration Agreement.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field>
          <FieldLabel htmlFor="fullNameCompany">Full Name/Company</FieldLabel>
          <Input
            id="fullNameCompany"
            placeholder="Full Name/Company"
            {...form.register('fullNameCompany')}
          />
          <FieldError>
            {form.formState.errors.fullNameCompany?.message}
          </FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="sponsor">(Sponsor) Name</FieldLabel>
          <Input
            id="sponsor"
            placeholder="Sponsor Name"
            {...form.register('sponsor')}
          />
          <FieldError>{form.formState.errors.sponsor?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="companyReg">ID/Company Reg No:</FieldLabel>
          <Input
            id="companyReg"
            placeholder="ID/Company Reg No:"
            {...form.register('companyReg')}
          />
          <FieldError>{form.formState.errors.companyReg?.message}</FieldError>
        </Field>

        {/* NEW SPONSOR EMAIL FIELD */}
        <Field>
          <FieldLabel htmlFor="sponsorEmail">Sponsor Email</FieldLabel>
          <Input
            id="sponsorEmail"
            type="email"
            placeholder="e.g. sponsor@example.com"
            {...form.register('sponsorEmail')}
          />
          <FieldError>{form.formState.errors.sponsorEmail?.message}</FieldError>
        </Field>
        {/* END NEW FIELD */}

        <Field className="md:col-span-2">
          <FieldLabel htmlFor="homeAddress">Home Address</FieldLabel>
          <Textarea
            id="homeAddress"
            placeholder="Home Address"
            {...form.register('homeAddress')}
          />
          <FieldError>{form.formState.errors.homeAddress?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="phoneNumber">Phone number</FieldLabel>
          <Input
            id="phoneNumber"
            placeholder="Phone Number"
            {...form.register('phoneNumber')}
          />
          <FieldError>{form.formState.errors.phoneNumber?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="alternativeNumber">
            Alternative Phone number
          </FieldLabel>
          <Input
            id="alternativeNumber"
            placeholder="Enter your phone number."
            {...form.register('alternativeNumber')}
          />
          <FieldError>
            {form.formState.errors.alternativeNumber?.message}
          </FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="Select Your Race">Race</FieldLabel>
          <Select {...form.register('selectYourRace')}>
            <SelectTrigger id="Select Your Race">
              <SelectValue placeholder="Select Your Race" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="african">African</SelectItem>
              <SelectItem value="coloured">Coloured</SelectItem>
              <SelectItem value="indian/asian">Indian/Asian</SelectItem>
              <SelectItem value="white">White</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <FieldError>
            {form.formState.errors.selectYourRace?.message}
          </FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="genderDebtor">Gender</FieldLabel>
          <Select
            onValueChange={(value) => form.setValue('genderDebtor', value)}
            defaultValue={form.getValues('genderDebtor')}
          >
            <SelectTrigger id="genderDebtor">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <FieldError>{form.formState.errors.genderDebtor?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="nationality">Nationality</FieldLabel>
          <Input
            id="nationality"
            placeholder="e.g South African"
            {...form.register('nationality')}
          />
          <FieldError>{form.formState.errors.nationality?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="employmentStatus">Employment Status</FieldLabel>
          <Input
            id="employmentStatus"
            placeholder="e.g unemployed"
            {...form.register('employmentStatus')}
          />
          <FieldError>
            {form.formState.errors.employmentStatus?.message}
          </FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="employerName">Employer Name</FieldLabel>
          <Input
            id="employerName"
            placeholder="e.g Pick N Pay"
            {...form.register('employerName')}
          />
          <FieldError>{form.formState.errors.employerName?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="employmentSector">Employment Sector</FieldLabel>
          <Input
            id="employmentSector"
            placeholder="e.g Government"
            {...form.register('employmentSector')}
          />
          <FieldError>
            {form.formState.errors.employmentSector?.message}
          </FieldError>
        </Field>

        <Field className="md:col-span-2">
          <FieldLabel htmlFor="employerAddress">Employer Address</FieldLabel>
          <Textarea
            id="employerAddress"
            placeholder="Employer Address"
            {...form.register('employerAddress')}
          />
          <FieldError>
            {form.formState.errors.employerAddress?.message}
          </FieldError>
        </Field>

        <Field className="md:col-span-2">
          <FieldLabel htmlFor="maritalStatus">Marital Status</FieldLabel>
          <Input
            id="maritalStatus"
            placeholder="e.g Divorced"
            {...form.register('maritalStatus')}
          />
          <FieldError>
            {form.formState.errors.maritalStatus?.message}
          </FieldError>
        </Field>
      </div>
    </div>
  )
}
