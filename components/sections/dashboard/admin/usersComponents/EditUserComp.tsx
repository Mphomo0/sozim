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
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { updateUserInClerk } from '@/app/actions/user.actions'

interface FormValues {
  firstName: string
  lastName: string
  email: string
  phone?: string
  alternativeNumber?: string
  dob?: string
  password?: string
  address?: string
  idNumber?: string
  nationality?: string
  role?: string
}

export default function EditUserComp() {
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

  const userId = typeof _id === 'string' ? (_id as Id<'users'>) : undefined
  const user = useQuery(api.users.getUserById, userId ? { id: userId } : 'skip')
  const updateUser = useMutation(api.users.updateUser)

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        alternativeNumber: user.alternativeNumber || '',
        dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
        address: user.address || '',
        idNumber: user.idNumber || '',
        nationality: user.nationality || '',
        role: user.role || 'USER',
      })
    }
  }, [user, reset])

  // Submit handler
  async function onSubmit(form: FormValues) {
    if (!userId || !user) return
    try {
      const payload: Record<string, string | undefined> = {}

      Object.entries(form).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          payload[key] = value
        }
      })

      if (Object.keys(payload).length === 0) {
        toast.info('No changes to save.')
        return
      }

      const clerkPayload: {
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
        password?: string;
      } = {}

      if (payload.firstName) clerkPayload.firstName = payload.firstName
      if (payload.lastName) clerkPayload.lastName = payload.lastName
      if (payload.email) clerkPayload.email = payload.email
      if (payload.phone) clerkPayload.phone = payload.phone
      if (payload.password) clerkPayload.password = payload.password

      if (user.clerkId && Object.keys(clerkPayload).length > 0) {
        const clerkRes = await updateUserInClerk(user.clerkId, clerkPayload)

        if (!clerkRes.success) {
           toast.error(clerkRes.error || "Failed updating authentication layer")
           return
        }
      }

      await updateUser({ 
        id: userId, 
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        phone: payload.phone,
        address: payload.address,
        dob: payload.dob,
        alternativeNumber: payload.alternativeNumber,
        idNumber: payload.idNumber,
        nationality: payload.nationality,
        role: payload.role,
      })

      toast.success('User updated successfully')
      router.push('/dashboard/admin/users')
    } catch (error) {
      console.error(error)
      toast.error('Failed to update user')
    }
  }

  if (user === undefined) return <p className="p-5 text-center">Loading user...</p>

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        {/* Alternative Number */}
        <div>
          <label className="text-slate-900 text-sm font-medium mb-2 block">
            Alternative Phone Number
          </label>
          <div className="relative flex items-center">
            <Phone className="absolute left-3 text-gray-400 w-4 h-4" />
            <input
              type="tel"
              placeholder="Optional alternative phone"
              {...register('alternativeNumber')}
              className="w-full pl-9 pr-3 py-3 border border-slate-300 rounded-md text-sm text-slate-900 outline-blue-600"
            />
          </div>
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
              className="w-full pl-9 pr-3 py-3 border border-slate-300 rounded-md text-sm text-slate-900 outline-blue-600"
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
      </div>

      {/* ID Number */}
      <div>
        <label className="text-slate-900 text-sm font-medium mb-2 block">
          ID Number
        </label>
        <div className="relative flex items-center">
          <User className="absolute left-3 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Enter ID number"
            {...register('idNumber')}
            className="w-full pl-9 pr-3 py-3 border border-slate-300 rounded-md text-sm text-slate-900 outline-blue-600"
          />
        </div>
      </div>

      {/* Nationality */}
      <div>
        <label className="text-slate-900 text-sm font-medium mb-2 block">
          Nationality
        </label>
        <input
          type="text"
          placeholder="Enter nationality"
          {...register('nationality')}
          className="w-full px-3 py-3 border border-slate-300 rounded-md text-sm text-slate-900 outline-blue-600"
        />
      </div>

      {/* Role */}
      <div>
        <label className="text-slate-900 text-sm font-medium mb-2 block">
          Role
        </label>
        <select
          {...register('role')}
          className="w-full px-3 py-3 border border-slate-300 rounded-md text-sm text-slate-900 outline-blue-600 bg-white"
        >
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
          <option value="MODERATOR">Moderator</option>
        </select>
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
