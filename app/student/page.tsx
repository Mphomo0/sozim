'use client'

import { useUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React, { useState } from 'react'
import ApplicationStatusCard from '@/components/sections/students/ApplicationStatusCard'
import NewApplicationCard from '@/components/sections/students/NewApplicationCard'
import { Button } from '@/components/ui/button'
import { Plus, X, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function StudentPage() {
  const { user, isLoaded } = useUser()
  const [showApplication, setShowApplication] = useState(false)

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!user) {
    redirect('/login')
  }

  // Role check would ideally be in middleware, but maintaining existing logic flow
  // Note: user.publicMetadata.role check from client-side Clerk user object
  if (user.publicMetadata?.role && user.publicMetadata.role !== 'USER') {
    redirect('/dashboard')
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-6 sm:space-y-12 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Welcome back, {user.firstName || 'Student'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
            Manage your applications and track your progress.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
          <Info className="mt-0.5 h-5 w-5 shrink-0" />
          <span>
            Before creating an application, please update your profile by clicking on the <strong>user icon</strong> in the top-right corner.
          </span>
        </div>
        
        
        <Button 
          onClick={() => setShowApplication(!showApplication)}
          variant={showApplication ? "outline" : "default"}
          className="h-12 sm:h-14 px-4 sm:px-8 rounded-2xl font-bold shadow-xl transition-all duration-300 active:scale-95 text-sm sm:text-base"
        >
          {showApplication ? (
            <>
              <X className="mr-2 h-5 w-5 text-red-500" />
              <span className="hidden sm:inline">Cancel Application</span>
              <span className="sm:hidden">Cancel</span>
            </>
          ) : (
            <>
              <Plus className="mr-2 h-5 w-5" />
              <span className="hidden sm:inline">Add New Application</span>
              <span className="sm:hidden">Apply</span>
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <AnimatePresence mode="wait">
          {showApplication ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.98, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <NewApplicationCard onSuccess={() => setShowApplication(false)} />
            </motion.div>
          ) : (
            <motion.div
              key="status"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <ApplicationStatusCard />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
