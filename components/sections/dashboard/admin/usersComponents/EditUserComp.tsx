'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useRouter, useParams } from 'next/navigation'
import {
  User,
  Mail,
  Phone,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  MapPin,
} from 'lucide-react'

interface FormValues {
  firstName: string
  lastName: string
  email: string
  phone?: string
  dob?: string
  password?: string
  address?: string
}

interface EditUserCompProps {
  _id: string
}

export default function EditUserComp() {
  const [loading, setLoading] = useState(true)
  const [showPassword, setShowPassword] = useState(false)

  const router = useRouter()
  const params = useParams()

  const _id = params.id

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>()

  // Load user data
  async function loadUser() {
    try {
      const res = await fetch(`/api/users/${_id}`)
      if (!res.ok) throw new Error('Failed to load user')
      const data = await res.json()
      reset({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        phone: data.phone || '',
        dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : '',
        address: data.address || '',
      })
    } catch (error) {
      console.error(error)
      toast.error('Failed to load user')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Only fetch data if _id is provided
    if (_id) {
      loadUser()
    }
  }, [_id])

  // Submit handler
  async function onSubmit(form: FormValues) {
    try {
      const payload: Partial<FormValues> = {}

      // Only include values that are NOT undefined or an empty string.
      // This prevents the password field from sending "" and overwriting the hash.
      Object.entries(form).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          payload[key as keyof FormValues] = value
        }
      })

      // Check if there's any data to update
      if (Object.keys(payload).length === 0) {
        toast.info('No changes to save.')
        return
      }

      // Use the PATCH route to update the user
      const res = await fetch(`/api/users/${_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Failed to update user')

      const updatedUser = await res.json()
      toast.success('User updated successfully')
      router.push('/dashboard/admin/users')
    } catch (error) {
      console.error(error)
      toast.error('Failed to update user')
    }
  }

  if (loading) {
    return <p className="p-5 text-center">Loading user...</p>
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white w-full mt-4 space-y-6 p-8 rounded-xl py-12 mb-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Name */}
        <div>
          <label
            htmlFor="firstName"
            className="text-slate-900 text-sm font-medium mb-2 block"
          >
            First Name
          </label>
          <div className="relative flex items-center">
            <User className="absolute left-3 text-gray-400 w-4 h-4" />
            <input
              id="firstName"
              type="text"
              placeholder="Enter first name"
              {...register('firstName', { required: 'First name is required' })}
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
          <label
            htmlFor="lastName"
            className="text-slate-900 text-sm font-medium mb-2 block"
          >
            Last Name
          </label>
          <div className="relative flex items-center">
            <User className="absolute left-3 text-gray-400 w-4 h-4" />
            <input
              id="lastName"
              type="text"
              placeholder="Enter last name"
              {...register('lastName', { required: 'Last name is required' })}
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
        <label
          htmlFor="email"
          className="text-slate-900 text-sm font-medium mb-2 block"
        >
          Email
        </label>
        <div className="relative flex items-center">
          <Mail className="absolute left-3 text-gray-400 w-4 h-4" />
          <input
            id="email"
            type="email"
            placeholder="Enter email address"
            {...register('email', { required: 'Email is required' })}
            className="w-full pl-9 pr-3 py-3 border border-slate-300 rounded-md text-sm text-slate-900 outline-blue-600"
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="text-slate-900 text-sm font-medium mb-2 block"
          >
            Phone Number
          </label>
          <div className="relative flex items-center">
            <Phone className="absolute left-3 text-gray-400 w-4 h-4" />
            <input
              id="phone"
              type="tel"
              placeholder="e.g. +27821234567"
              {...register('phone')}
              className="w-full pl-9 pr-3 py-3 border border-slate-300 rounded-md text-sm text-slate-900 outline-blue-600"
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div>
          <label
            htmlFor="dob"
            className="text-slate-900 text-sm font-medium mb-2 block"
          >
            Date of Birth
          </label>
          <div className="relative flex items-center">
            <Calendar className="absolute left-3 text-gray-400 w-4 h-4" />
            <input
              id="dob"
              type="date"
              {...register('dob')}
              className="w-full pl-9 pr-3 py-3 border border-slate-300 rounded-md text-sm text-slate-900 outline-blue-600"
            />
          </div>
          {errors.dob && (
            <p className="text-red-500 text-xs mt-1">{errors.dob.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="text-slate-900 text-sm font-medium mb-2 block"
          >
            Password
          </label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3 text-gray-400 w-4 h-4" />
            <input
              id="password"
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
        <label
          htmlFor="address"
          className="text-slate-900 text-sm font-medium mb-2 block"
        >
          Address
        </label>
        <div className="relative flex items-start">
          <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
          <textarea
            id="address"
            placeholder="Enter your address"
            {...register('address')}
            className="w-full pl-9 pr-3 py-3 border border-slate-300 rounded-md text-sm text-slate-900 outline-blue-600 min-h-[120px]"
          />
        </div>
        {errors.address && (
          <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
        )}
      </div>

      {/* Submit button */}
      <div className="!mt-12">
        <button
          type="submit"
          className="w-full py-2 px-4 text-[15px] font-medium tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Updating user...' : 'Update User'}
        </button>
      </div>
    </form>
  )
}
