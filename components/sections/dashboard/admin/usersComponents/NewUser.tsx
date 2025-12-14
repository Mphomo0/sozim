'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  User,
  Mail,
  Eye,
  EyeOff,
  Lock,
  Phone,
  Calendar,
  MapPin,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

// Zod schema with missing fields added
const newUserSchema = z.object({
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
  email: z.email('Please enter a valid email'),
  address: z.string().min(1, 'Address is required'),
  idNumber: z.string().optional(),
  nationality: z.string().optional(),
  password: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val || // <-- allow empty
        (val.length >= 8 &&
          /[A-Z]/.test(val) &&
          /[a-z]/.test(val) &&
          /[0-9]/.test(val) &&
          /[^A-Za-z0-9]/.test(val)),
      {
        message:
          'Password must be at least 8 chars, include upper, lower, number, and special character',
      }
    ),
})

type NewUserFormData = z.infer<typeof newUserSchema>

export default function NewUser() {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewUserFormData>({
    resolver: zodResolver(newUserSchema),
  })

  const onSubmit = async (data: NewUserFormData) => {
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
        alert(result.error || 'Failed to create user')
        return
      }

      toast.success(result.message || 'User created successfully!')
      router.push('/dashboard/admin/users')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Something went wrong')
    }
  }

  return (
    <div className="bg-white w-full md:w-[800px] mx-auto mt-4 py-8 rounded-lg shadow-md px-8">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        {/* Name fields */}
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
                className="w-full pl-9 pr-3 py-3 border rounded-md"
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
                className="w-full pl-9 pr-3 py-3 border rounded-md"
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
              className="w-full pl-9 pr-3 py-3 border rounded-md"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Phone + Alt Phone + DOB */}
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
                className="w-full pl-9 pr-3 py-3 border rounded-md"
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
              Alternative Number (optional)
            </label>
            <div className="relative flex items-center">
              <Phone className="absolute left-3 text-gray-400 w-4 h-4" />
              <input
                type="tel"
                placeholder="Optional alternative number"
                {...register('alternativeNumber')}
                className="w-full pl-9 pr-3 py-3 border rounded-md"
              />
            </div>
            {errors.alternativeNumber && (
              <p className="text-red-500 text-xs mt-1">
                {errors.alternativeNumber.message}
              </p>
            )}
          </div>

          {/* DOB */}
          <div>
            <label className="text-slate-900 text-sm font-medium mb-2 block">
              Date of Birth
            </label>
            <div className="relative flex items-center">
              <Calendar className="absolute left-3 text-gray-400 w-4 h-4" />
              <input
                type="date"
                {...register('dob')}
                className="w-full pl-9 pr-3 py-3 border rounded-md"
              />
            </div>
            {errors.dob && (
              <p className="text-red-500 text-xs mt-1">{errors.dob.message}</p>
            )}
          </div>
        </div>

        {/* ID Number + Nationality */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ID Number */}
          <div>
            <label className="text-slate-900 text-sm font-medium mb-2 block">
              ID Number (optional)
            </label>
            <input
              type="text"
              placeholder="Enter ID number"
              {...register('idNumber')}
              className="w-full pl-3 pr-3 py-3 border rounded-md"
            />
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
              className="w-full pl-3 pr-3 py-3 border rounded-md"
            />
          </div>
        </div>

        {/* Password */}
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
              className="w-full pl-9 pr-9 py-3 border rounded-md"
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
              className="w-full pl-9 pr-3 py-3 border rounded-md min-h-[120px]"
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
            className="w-full py-2 px-4 text-[15px] font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating user...' : 'Create User'}
          </button>
        </div>
      </form>
    </div>
  )
}
