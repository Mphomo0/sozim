'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'

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
    email: z.string().email('Invalid email'),
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
        (val) =>
          val === undefined || val.match(/^(\+?\d{1,3}[- ]?)?(\d{9,12})$/),
        'Please enter a valid alternative number'
      )
      .or(z.literal('')), // Allow empty string
    dob: z.string().min(1, 'Date of birth is required'),
    address: z.string().min(1, 'Address is required'),
    idNumber: z.string().min(1, 'ID number is required'),
    nationality: z.string().min(1, 'Nationality is required'),
    password: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.password && data.password.length > 0) {
        return (
          data.password.length >= 8 &&
          /[A-Z]/.test(data.password) &&
          /[a-z]/.test(data.password) &&
          /[0-9]/.test(data.password) &&
          /[^A-Za-z0-9]/.test(data.password)
        )
      }
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
  alternativeNumber?: string
  dob?: string
  address?: string
  idNumber?: string
  nationality?: string
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
        if (!res.ok) throw new Error('Failed to fetch user data')
        const data = await res.json()
        setUser(data)

        reset({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phone: data.phone || '',
          alternativeNumber: data.alternativeNumber || '',
          dob: data.dob ? data.dob.substring(0, 10) : '',
          address: data.address || '',
          idNumber: data.idNumber || '',
          nationality: data.nationality || '',
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
    if (!payload.password || payload.password.length === 0)
      delete payload.password

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message || 'Failed to update profile.')
        return
      }

      toast.success('Profile updated successfully!')
      setUser(data)
      setOpen(false)
      reset({ ...values, password: '' })
    } catch (err) {
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
            <strong>FullName:</strong> {user.firstName} {user.lastName}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          {user.phone && (
            <p>
              <strong>Phone:</strong> {user.phone}
            </p>
          )}
          {user.alternativeNumber && (
            <p>
              <strong>Alt Phone:</strong> {user.alternativeNumber}
            </p>
          )}
          {user.dob && (
            <p>
              <strong>DOB:</strong> {new Date(user.dob).toLocaleDateString()}
            </p>
          )}
          {user.address && (
            <p>
              <strong>Address:</strong> {user.address}
            </p>
          )}
          {user.idNumber && (
            <p>
              <strong>ID Number:</strong> {user.idNumber}
            </p>
          )}
          {user.nationality && (
            <p>
              <strong>Nationality:</strong> {user.nationality}
            </p>
          )}
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4">Edit Profile</Button>
          </DialogTrigger>

          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Your Information</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <div>
                <label className="block mb-1 font-medium">First Name</label>
                <Input placeholder="First Name" {...register('firstName')} />
                {errors.firstName && (
                  <p className="text-red-600 text-sm">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">Last Name</label>
                <Input placeholder="Last Name" {...register('lastName')} />
                {errors.lastName && (
                  <p className="text-red-600 text-sm">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="Email"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-red-600 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">Phone</label>
                <Input placeholder="Phone" {...register('phone')} />
                {errors.phone && (
                  <p className="text-red-600 text-sm">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  Alternative Number
                </label>
                <Input
                  placeholder="Alternative Number"
                  {...register('alternativeNumber')}
                />
                {errors.alternativeNumber && (
                  <p className="text-red-600 text-sm">
                    {errors.alternativeNumber.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">Date of Birth</label>
                <Input type="date" placeholder="DOB" {...register('dob')} />
                {errors.dob && (
                  <p className="text-red-600 text-sm">{errors.dob.message}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">Address</label>
                <Input placeholder="Address" {...register('address')} />
                {errors.address && (
                  <p className="text-red-600 text-sm">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">ID Number</label>
                <Input placeholder="ID Number" {...register('idNumber')} />
                {errors.idNumber && (
                  <p className="text-red-600 text-sm">
                    {errors.idNumber.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">Nationality</label>
                <Input placeholder="Nationality" {...register('nationality')} />
                {errors.nationality && (
                  <p className="text-red-600 text-sm">
                    {errors.nationality.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  New Password (optional)
                </label>
                <Input
                  type="password"
                  placeholder="Password"
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
