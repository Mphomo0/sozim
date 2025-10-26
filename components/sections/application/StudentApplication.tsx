'use client'

import { CheckCircle2, FileText, Upload } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

const programs = [
  'Business Management',
  'Financial Management',
  'Marketing Management',
  'Human Resources Management',
  'Project Management',
  'Supply Chain Management',
]

const steps = [
  { number: 1, title: 'Personal Information', active: true },
  { number: 2, title: 'Program Selection', active: false },
  { number: 3, title: 'Documents Upload', active: false },
  { number: 4, title: 'Review & Submit', active: false },
]

const applicationFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  idNumber: z
    .string()
    .length(13, 'ID number must be exactly 13 digits')
    .regex(/^\d{13}$/, 'ID number must contain only digits'),
  dob: z.date({ message: 'Date of birth is required' }),
  email: z.email('Invalid email address'), // Fixed
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^\d+$/, 'Phone number must contain only digits'), // Enhanced
  alternativePhone: z
    .string()
    .regex(/^\d+$/, 'Phone number must contain only digits')
    .optional()
    .or(z.literal('')), // Allow empty string
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  province: z.string().min(1, 'Province is required'),
  postalCode: z
    .string()
    .length(4, 'Postal code must be exactly 4 digits')
    .regex(/^\d{4}$/, 'Postal code must contain only digits'), // SA postal codes
  programOfInterest: z.string().min(1, 'Program selection is required'), // Fixed naming
  intakeDate: z.string().min(1, 'Intake date is required'),
  highestQualification: z.string().min(1, 'Qualification is required'),
  termsAccepted: z.literal(true, {
    message: 'You must accept the terms and conditions',
  }),
  documents: z
    .array(
      z.instanceof(File, {
        message: 'Each document must be a valid file',
      })
    )
    .min(1, 'Please upload all required documents'),
})

type ApplicationFormData = z.infer<typeof applicationFormSchema>

export default function StudentApplication() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationFormSchema),
  })

  const onSubmit = (data: ApplicationFormData) => {
    console.log('Form Data:', data)
    // Add API call or toast here
  }

  return (
    <>
      {/* Progress Steps */}
      <section className="border-b bg-card py-6">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${
                        step.active
                          ? 'bg-gradient-to-r from-slate-950 to-sky-700 text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {step.number}
                    </div>
                    <span
                      className={`hidden md:block text-sm font-medium ${
                        step.active
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="mx-4 h-0.5 w-12 bg-border md:w-24" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Please provide your personal details as they appear on your
                  official documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                  {/* Personal Details */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        placeholder="Enter your first name"
                        {...register('firstName')}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-red-500">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        placeholder="Enter your last name"
                        {...register('lastName')}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-red-500">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="idNumber">ID Number *</Label>
                      <Input
                        id="idNumber"
                        placeholder="Enter your ID number"
                        {...register('idNumber')}
                      />
                      {errors.idNumber && (
                        <p className="text-sm text-red-500">
                          {errors.idNumber.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth *</Label>
                      <Input id="dob" type="date" {...register('dob')} />
                      {errors.dob && (
                        <p className="text-sm text-red-500">
                          {errors.dob.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      {...register}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+27 XX XXX XXXX"
                        {...register('phone')}
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-500">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="altPhone">Alternative Phone</Label>
                      <Input
                        id="altPhone"
                        type="tel"
                        placeholder="+27 XX XXX XXXX"
                        {...register('alternativePhone')}
                      />
                      {errors.alternativePhone && (
                        <p className="text-sm text-red-500">
                          {errors.alternativePhone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <Label htmlFor="address">Physical Address *</Label>
                    <Textarea
                      id="address"
                      placeholder="Enter your full address"
                      rows={3}
                      {...register('address')}
                    />
                    {errors.address && (
                      <p className="text-sm text-red-500">
                        {errors.address.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        placeholder="City"
                        {...register('city')}
                      />
                      {errors.city && (
                        <p className="text-sm text-red-500">
                          {errors.city.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="province">Province *</Label>
                      <Controller
                        name="province"
                        control={control}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger id="province" className="w-full">
                              <SelectValue placeholder="Select province" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="gauteng">Gauteng</SelectItem>
                              <SelectItem value="western-cape">
                                Western Cape
                              </SelectItem>
                              <SelectItem value="eastern-cape">
                                Eastern Cape
                              </SelectItem>
                              <SelectItem value="kwazulu-natal">
                                KwaZulu-Natal
                              </SelectItem>
                              <SelectItem value="free-state">
                                Free State
                              </SelectItem>
                              <SelectItem value="limpopo">Limpopo</SelectItem>
                              <SelectItem value="mpumalanga">
                                Mpumalanga
                              </SelectItem>
                              <SelectItem value="north-west">
                                North West
                              </SelectItem>
                              <SelectItem value="northern-cape">
                                Northern Cape
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.province && (
                        <p className="text-sm text-red-500">
                          {errors.province.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="postal">Postal Code *</Label>
                      <Input
                        id="postal"
                        placeholder="0000"
                        {...register('postalCode')}
                      />
                      {errors.postalCode && (
                        <p className="text-sm text-red-500">
                          {errors.postalCode.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Program Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="program">Program of Interest *</Label>
                    <Controller
                      name="programOfInterest"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger id="program" className="w-full">
                            <SelectValue placeholder="Select a program" />
                          </SelectTrigger>
                          <SelectContent>
                            {programs.map((program) => (
                              <SelectItem
                                key={program}
                                value={program
                                  .toLowerCase()
                                  .replace(/\s+/g, '-')}
                              >
                                {program}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.programOfInterest && (
                      <p className="text-sm text-red-500">
                        {errors.programOfInterest.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="intake">Preferred Intake Date *</Label>
                    <Controller
                      name="intakeDate"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger id="intake" className="w-full">
                            <SelectValue placeholder="Select intake date" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="jan-2025">
                              January 2025
                            </SelectItem>
                            <SelectItem value="apr-2025">April 2025</SelectItem>
                            <SelectItem value="jul-2025">July 2025</SelectItem>
                            <SelectItem value="oct-2025">
                              October 2025
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.intakeDate && (
                      <p className="text-sm text-red-500">
                        {errors.intakeDate.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="education">Highest Qualification *</Label>
                    <Controller
                      name="highestQualification"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger id="education" className="w-full">
                            <SelectValue placeholder="Select qualification" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="grade12">
                              Grade 12 / Matric
                            </SelectItem>
                            <SelectItem value="certificate">
                              Certificate
                            </SelectItem>
                            <SelectItem value="diploma">Diploma</SelectItem>
                            <SelectItem value="degree">Degree</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.highestQualification && (
                      <p className="text-sm text-red-500">
                        {errors.highestQualification.message}
                      </p>
                    )}
                  </div>

                  {/* Document Upload */}
                  <div className="space-y-2">
                    <Label>Upload Required Documents *</Label>
                    <Controller
                      name="documents"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <div className="rounded-lg border-2 border-dashed p-6">
                          <div className="text-center">
                            <Upload className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 font-semibold">
                              Upload Required Documents
                            </h3>
                            <p className="mb-4 text-sm text-muted-foreground">
                              Please upload: ID Copy, Matric Certificate, Proof
                              of Residence
                            </p>
                            <input
                              type="file"
                              id="document-upload"
                              multiple
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => {
                                const files = Array.from(e.target.files || [])
                                onChange(files)
                              }}
                              className="hidden"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() =>
                                document
                                  .getElementById('document-upload')
                                  ?.click()
                              }
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              Choose Files
                            </Button>

                            {value && value.length > 0 && (
                              <div className="mt-4 space-y-2 text-left">
                                <p className="text-sm font-medium">
                                  Selected files:
                                </p>
                                {value.map((file: File, index: number) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between rounded bg-muted p-2 text-sm"
                                  >
                                    <span className="truncate">
                                      {file.name}
                                    </span>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const newFiles = value.filter(
                                          (_: File, i: number) => i !== index
                                        )
                                        onChange(newFiles)
                                      }}
                                    >
                                      ×
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    />
                    {errors.documents && (
                      <p className="text-sm text-red-500">
                        {errors.documents.message}
                      </p>
                    )}
                  </div>

                  {/* Terms and Conditions */}
                  <div className="flex items-start gap-2">
                    <Checkbox id="terms" />
                    <label
                      htmlFor="terms"
                      className="text-sm text-muted-foreground"
                    >
                      I agree to the terms and conditions and confirm that the
                      information provided is accurate *
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4">
                    <Button type="button" variant="outline" className="flex-1">
                      Save as Draft
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-slate-950 to-sky-700 hover:from-slate-900 hover:to-sky-600"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Submit Application
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Help Section */}
            <Card className="mt-8">
              <CardContent className="p-6">
                <h3 className="mb-2 font-semibold">Need Help?</h3>
                <p className="text-sm text-muted-foreground">
                  If you have any questions about the application process,
                  please contact our admissions office at{' '}
                  <a
                    href="mailto:admissions@sozim.co.za"
                    className="text-primary hover:underline"
                  >
                    admissions@sozim.co.za
                  </a>{' '}
                  or call us at{' '}
                  <a
                    href="tel:+27111234567"
                    className="text-primary hover:underline"
                  >
                    +27 11 123 4567
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}
