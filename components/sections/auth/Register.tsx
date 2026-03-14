'use client'

import { SignUp } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'motion/react'

export default function Register() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-slate-950 px-4 py-20">
      {/* Background academic pattern/overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent" />
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="reg-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" opacity="0.1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#reg-grid)" />
        </svg>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full flex flex-col items-center"
      >
        <Link href="/" className="mb-12 hover:scale-105 transition-transform duration-300">
          <Image
            src="https://ik.imagekit.io/vzofqg2fg/images/SozimLogo.webp"
            alt="Sozim Logo"
            width={180}
            height={100}
            className="w-auto h-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            priority
          />
        </Link>
        <div className="bg-white/5 backdrop-blur-xl p-4 rounded-3xl border border-white/10 shadow-2xl">
          <SignUp 
            signInUrl="/login" 
            fallbackRedirectUrl="/dashboard"
            appearance={{
              elements: {
                card: "bg-white shadow-2xl rounded-2xl border-0",
                headerTitle: "text-slate-900 font-extrabold",
                headerSubtitle: "text-slate-500",
                socialButtonsBlockButton: "border-slate-200 hover:bg-slate-50 transition-colors",
                formButtonPrimary: "bg-slate-900 hover:bg-blue-700 transition-all shadow-lg",
                footerActionLink: "text-blue-600 hover:text-blue-700 font-bold"
              }
            }}
          />
        </div>
      </motion.div>

      <div className="mt-12 text-slate-500 font-medium text-sm relative z-10">
        Already have an account? <Link href="/login" className="text-blue-400 hover:text-blue-300 font-bold underline underline-offset-4">Sign In</Link>
      </div>
    </div>
  )
}
