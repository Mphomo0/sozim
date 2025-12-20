'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import Link from 'next/link'
import { Mail, Eye, EyeOff, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { signIn } from 'next-auth/react'

// login schema
const loginSchema = z.object({
  email: z.email('Please enter a valid email'),
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

// Infer TypeScript type from schema
type LoginFormData = z.infer<typeof loginSchema>

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)

  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await signIn('credentials', {
        ...data,
        redirect: false,
      })

      if (result?.ok && !result?.error) {
        toast.success('Successfully signed in!')

        router.push('/dashboard')
      } else {
        toast.error('Invalid credentials')
      }
    } catch (error) {
      console.error(error)
      toast.error(
        (error as Error)?.message || 'Something went wrong. Please try again.'
      )
    }
  }

  return (
    <div className="bg-gray-50">
      <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
        <div className="max-w-[480px] w-full">
          <Link href="/">
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
              Sign in
            </h1>

            {/* Use handleSubmit */}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-12 space-y-6">
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
                    placeholder="Enter Your Email"
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

              {/* Sign In button */}
              <div className="!mt-12">
                <button
                  type="submit"
                  className="w-full py-2 px-4 text-[15px] font-medium tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none cursor-pointer"
                >
                  Sign in
                </button>
              </div>

              <p className="text-slate-900 text-sm !mt-6 text-center">
                Don&apos;t have an account?{' '}
                <Link
                  href="/register"
                  className="text-blue-600 hover:underline ml-1 whitespace-nowrap font-semibold"
                >
                  Register here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
