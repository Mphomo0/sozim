'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import Link from 'next/link'
import { Mail, Eye, EyeOff, Lock, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { signIn } from 'next-auth/react'

// Updated Schema: Password is optional so Magic Link can work
const loginSchema = z.object({
  email: z.email('Please enter a valid email'),
  password: z.string().optional(),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState<'credentials' | 'magic-link' | null>(
    null
  )
  const router = useRouter()

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  // Handle Password Login
  const onPasswordSubmit = async (data: LoginFormData) => {
    if (!data.password) {
      toast.error('Password is required for this sign-in method')
      return
    }
    setLoading('credentials')
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.ok && !result?.error) {
        toast.success('Successfully signed in!')
        router.push('/dashboard')
      } else {
        toast.error('Invalid credentials')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  // Handle Magic Link Login
  const handleMagicLink = async () => {
    const email = getValues('email')
    if (!email || errors.email) {
      toast.error('Please enter a valid email first')
      return
    }

    setLoading('magic-link')
    try {
      const result = await signIn('nodemailer', {
        email,
        callbackUrl: '/dashboard',
        redirect: false,
      })

      if (result?.ok) {
        toast.success('Check your email for the login link!')
      } else {
        toast.error('Failed to send magic link')
      }
    } catch (error) {
      toast.error('Error sending email')
    } finally {
      setLoading(null)
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

            <form
              onSubmit={handleSubmit(onPasswordSubmit)}
              className="mt-12 space-y-6"
            >
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
                  title="Optional if using Magic Link"
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
                  <button
                    type="button"
                    className="absolute right-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="text-gray-400 w-4 h-4" />
                    ) : (
                      <Eye className="text-gray-400 w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 !mt-10">
                <button
                  type="submit"
                  disabled={!!loading}
                  className="w-full py-2.5 px-4 text-[15px] font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                >
                  {loading === 'credentials'
                    ? 'Signing in...'
                    : 'Sign in with Password'}
                </button>

                <div className="relative flex items-center justify-center">
                  <span className="absolute inset-x-0 h-px bg-gray-200"></span>
                  <span className="relative px-3 text-xs text-gray-400 bg-white uppercase">
                    Or
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleMagicLink}
                  disabled={!!loading}
                  className="w-full py-2.5 px-4 text-[15px] font-medium rounded-md text-blue-600 border border-blue-600 hover:bg-blue-50 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  {loading === 'magic-link'
                    ? 'Sending link...'
                    : 'Email me a Magic Link'}
                </button>
              </div>

              <p className="text-slate-900 text-sm !mt-6 text-center">
                Don&apos;t have an account?{' '}
                <Link
                  href="/register"
                  className="text-blue-600 hover:underline ml-1 font-semibold"
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
