'use client'

import React from 'react'
import { DashboardHeader } from '@/components/sections/dashboard/DashboardHeader'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface BreadcrumbStep {
  label: string
  href?: string
}

interface DashboardPageLayoutProps {
  children: React.ReactNode
  title: string
  description?: string
  breadcrumbs: BreadcrumbStep[]
  action?: React.ReactNode
  className?: string
}

export function DashboardPageLayout({
  children,
  title,
  description,
  breadcrumbs,
  action,
  className,
}: DashboardPageLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-slate-50/50 dark:bg-slate-950/50">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-600/5 to-transparent pointer-events-none z-[-1]" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none z-[-1]" />
      <div className="absolute top-1/2 -left-24 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none z-[-1]" />

      <DashboardHeader breadcrumbs={breadcrumbs} />

      <motion.main 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn("flex-1 p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full", className)}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
          <div className="space-y-1 w-full">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              {title}
            </h1>
            {description && (
              <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl">
                {description}
              </p>
            )}
          </div>
          {action && (
            <div className="flex items-center gap-3 w-full flex-wrap">
              {action}
            </div>
          )}
        </div>

        <div className="relative">
          {children}
        </div>
      </motion.main>
    </div>
  )
}
