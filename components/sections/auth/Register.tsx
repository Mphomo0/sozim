'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import Link from 'next/link'
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Mail,
  Phone,
  Calendar,
  MapPin,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

// Validation schema
export const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(
      /^(\+?\d{1,3}[- ]?)?(\d{9,12})$/,
      'Please enter a valid international or South African phone number'
    ),
  alternativeNumber: z
    .string()
    .optional()
    .refine(
      (val) => val === undefined || val.match(/^(\+?\d{1,3}[- ]?)?(\d{9,12})$/),
      'Please enter a valid alternative number'
    )
    .or(z.literal('')), // Allow empty string
  dob: z.string().min(1, 'Date of birth is required'),
  idNumber: z.string().min(13, 'ID number is required'),
  nationality: z.string().min(1, 'Nationality is required'),
  email: z.email('Please enter a valid email'),
  address: z.string().min(1, 'Address is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[^A-Za-z0-9]/,
      'Password must contain at least one special character'
    ),
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const router = useRouter()

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!res.ok) {
        console.error(result.error)
        alert(result.error || 'Failed to create user')
        return
      }

      toast.success(result.message || 'User created successfully!')
      router.push('/login')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Something went wrong')
    }
  }

  return (
    <div className="bg-gray-50">
      <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
        <div className="max-w-[800px] w-full">
          <Link href="#">
            <Image
              src="https://ik.imagekit.io/vzofqg2fg/images/SozimLogo.webp"
              alt="Sozim Logo"
              width={160}
              height={90}
              className="w-auto h-auto mb-8 mx-auto block"
              priority
            />
          </Link>

          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-gray-200 shadow-sm">
            <h1 className="text-slate-900 text-center text-3xl font-semibold">
              Create an account
            </h1>

            {/* Hook Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full mt-12 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label className="text-slate-900 text-sm font-medium mb-2 block">
                    First Name
                  </label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Enter first name"
                      {...register('firstName')}
                      className="w-full pl-9 pr-3 py-3 border border-slate-300 rounded-md text-sm text-slate-900 outline-blue-600"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="text-slate-900 text-sm font-medium mb-2 block">
                    Last Name
                  </label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Enter last name"
                      {...register('lastName')}
                      className="w-full pl-9 pr-3 py-3 border border-slate-300 rounded-md text-sm text-slate-900 outline-blue-600"
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-slate-900 text-sm font-medium mb-2 block">
                  Email
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    placeholder="Enter email address"
                    {...register('email')}
                    className="w-full pl-9 pr-3 py-3 border border-slate-300 rounded-md text-sm text-slate-900 outline-blue-600"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Phone */}
                <div>
                  <label className="text-slate-900 text-sm font-medium mb-2 block">
                    Phone Number
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="absolute left-3 text-gray-400 w-4 h-4" />
                    <input
                      type="tel"
                      placeholder="e.g. +27821234567"
                      {...register('phone')}
                      className="w-full pl-9 pr-3 py-3 border border-slate-300 rounded-md text-sm text-slate-900 outline-blue-600"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Alternative Number */}
                <div>
                  <label className="text-slate-900 text-sm font-medium mb-2 block">
                    Alternative Number
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="absolute left-3 text-gray-400 w-4 h-4" />
                    <input
                      type="tel"
                      placeholder="Optional alternative phone number"
                      {...register('alternativeNumber')}
                      className="w-full pl-9 pr-3 py-3 border border-slate-300 rounded-md text-sm text-slate-900 outline-blue-600"
                    />
                  </div>
                  {errors.alternativeNumber && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.alternativeNumber.message}
                    </p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="text-slate-900 text-sm font-medium mb-2 block">
                    Date of Birth
                  </label>
                  <div className="relative flex items-center">
                    <Calendar className="absolute left-3 text-gray-400 w-4 h-4" />
                    <input
                      type="date"
                      {...register('dob')}
                      className="w-full pl-9 pr-3 py-3 border border-slate-300 rounded-md text-sm text-slate-900 outline-blue-600"
                    />
                  </div>
                  {errors.dob && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.dob.message}
                    </p>
                  )}
                </div>
              </div>

              {/* New Row for ID + Nationality */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* ID Number */}
                <div>
                  <label className="text-slate-900 text-sm font-medium mb-2 block">
                    ID Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter ID number"
                    {...register('idNumber')}
                    className="w-full pl-3 pr-3 py-3 border border-slate-300 rounded-md text-sm text-slate-900 outline-blue-600"
                  />
                  {errors.idNumber && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.idNumber.message}
                    </p>
                  )}
                </div>

                {/* Nationality */}
                <div>
                  <label className="text-slate-900 text-sm font-medium mb-2 block">
                    Nationality (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter nationality"
                    {...register('nationality')}
                    className="w-full pl-3 pr-3 py-3 border border-slate-300 rounded-md text-sm text-slate-900 outline-blue-600"
                  />
                  {errors.nationality && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.nationality.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Password */}
              <div className="grid grid-cols-1">
                <div>
                  <label className="text-slate-900 text-sm font-medium mb-2 block">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3 text-gray-400 w-4 h-4" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      {...register('password')}
                      className="w-full pl-9 pr-9 py-3 border border-slate-300 rounded-md text-sm text-slate-900 outline-blue-600"
                    />
                    {showPassword ? (
                      <EyeOff
                        className="absolute right-3 text-gray-400 w-4 h-4 cursor-pointer"
                        onClick={() => setShowPassword(false)}
                      />
                    ) : (
                      <Eye
                        className="absolute right-3 text-gray-400 w-4 h-4 cursor-pointer"
                        onClick={() => setShowPassword(true)}
                      />
                    )}
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="text-slate-900 text-sm font-medium mb-2 block">
                  Address
                </label>
                <div className="relative flex items-start">
                  <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                  <textarea
                    placeholder="Enter your address"
                    {...register('address')}
                    className="w-full pl-9 pr-3 py-3 border border-slate-300 rounded-md text-sm text-slate-900 outline-blue-600 min-h-[120px]"
                  />
                </div>
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <div className="!mt-12">
                <button
                  type="submit"
                  className="w-full py-2 px-4 text-[15px] font-medium tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating account...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
