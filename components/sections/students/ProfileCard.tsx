'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify' // 👈 Import toast

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const ProfileSchema = z
  .object({
    firstName: z.string().min(1, 'Required'),
    lastName: z.string().min(1, 'Required'),
    email: z.email('Invalid email'),
    phone: z
      .string()
      .min(1, 'Phone number is required')
      .regex(
        /^(\+?\d{1,3}[- ]?)?(\d{9,12})$/,
        'Please enter a valid international or South African phone number'
      ),
    dob: z.string().min(1, 'Date of birth is required'),
    address: z.string().min(1, 'Address is required'),
    password: z.string().optional(),
  })
  .refine(
    (data) => {
      // If password is provided, validate its strength
      if (data.password && data.password.length > 0) {
        return (
          data.password.length >= 8 &&
          /[A-Z]/.test(data.password) &&
          /[a-z]/.test(data.password) &&
          /[0-9]/.test(data.password) &&
          /[^A-Za-z0-9]/.test(data.password)
        )
      }
      // If password is empty or undefined, it's valid (optional)
      return true
    },
    {
      message:
        'Password must be at least 8 chars and contain U/L case, number, and special char.',
      path: ['password'],
    }
  )

type ProfileForm = z.infer<typeof ProfileSchema>

interface UserProfile {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  dob?: string
  address?: string
}

export default function ProfileCard() {
  const { data: session } = useSession()
  const userId = session?.user?.id

  const [user, setUser] = useState<UserProfile | null>(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(ProfileSchema),
  })

  useEffect(() => {
    if (!userId) return

    const loadUser = async () => {
      try {
        const res = await fetch(`/api/users/${userId}`)
        if (!res.ok) {
          throw new Error('Failed to fetch user data')
        }
        const data = await res.json()

        setUser(data)

        // populate form values
        reset({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone || '',
          dob: data.dob ? data.dob.substring(0, 10) : '', // Ensure date format is correct
          address: data.address || '',
          password: '',
        })
      } catch (error) {
        console.error('Loading user failed:', error)
        toast.error('Failed to load user profile.')
      }
    }
    loadUser()
  }, [userId, reset])

  if (!session) return <p>Loading session...</p>
  if (!user) return <p>Loading profile...</p>

  const onSubmit = async (values: ProfileForm) => {
    setLoading(true)

    const payload = { ...values }

    // 🔑 Fix: Filter out empty password before sending the PATCH request
    if (!payload.password || payload.password.length === 0) {
      delete payload.password
    }

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload), // Send filtered payload
      })

      const data = await res.json()

      if (!res.ok) {
        // Show server-side error message
        toast.error(data.message || 'Failed to update profile.')
        return
      }

      // Show success toast
      toast.success('Profile updated successfully! 🎉')

      // Update local state with new user data
      setUser(data)
      setOpen(false)

      // Reset the form, explicitly clearing the password field
      reset({ ...values, password: '' })
    } catch (err) {
      // Show generic network/client error
      toast.error('An unexpected error occurred.')
      console.error('Update error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Your Profile</h2>

        <div className="space-y-4">
          <p>
            <strong>Name:</strong> {user.firstName} {user.lastName}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          {user.phone && (
            <p>
              <strong>Phone:</strong> {user.phone}
            </p>
          )}
          {user.dob && (
            <p>
              <strong>DOB:</strong>{' '}
              {new Date(user.dob).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short', // e.g., 'Nov'
                day: 'numeric', // e.g., '23'
              })}
            </p>
          )}
          {user.address && (
            <p>
              <strong>Address:</strong> {user.address}
            </p>
          )}
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4">Edit Profile</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Your Information</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
              {/* FIRST NAME */}
              <div>
                <Input placeholder="First Name" {...register('firstName')} />
                {errors.firstName && (
                  <p className="text-red-600 text-sm">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              {/* LAST NAME */}
              <div>
                <Input placeholder="Last Name" {...register('lastName')} />
                {errors.lastName && (
                  <p className="text-red-600 text-sm">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              {/* EMAIL */}
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-red-600 text-sm">{errors.email.message}</p>
                )}
              </div>

              {/* PHONE */}
              <div>
                <Input placeholder="Phone" {...register('phone')} />
                {errors.phone && (
                  <p className="text-red-600 text-sm">{errors.phone.message}</p>
                )}
              </div>

              {/* DOB */}
              <div>
                <Input type="date" placeholder="DOB" {...register('dob')} />
                {errors.dob && (
                  <p className="text-red-600 text-sm">{errors.dob.message}</p>
                )}
              </div>

              {/* ADDRESS */}
              <div>
                <Input placeholder="Address" {...register('address')} />
                {errors.address && (
                  <p className="text-red-600 text-sm">
                    {errors.address.message}
                  </p>
                )}
              </div>

              {/* PASSWORD */}
              <div>
                <Input
                  type="password"
                  placeholder="New Password (optional)"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-red-600 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Save Changes'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
