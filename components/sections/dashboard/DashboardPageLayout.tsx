'use client'

import React from 'react'
import { DashboardHeader } from '@/components/sections/dashboard/DashboardHeader'
import { cn } from '@/lib/utils'

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
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Background Texture Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-[-1]"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
        }}
      />

      <DashboardHeader breadcrumbs={breadcrumbs} />

      <main className={cn("flex-1 p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full", className)}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 drop-shadow-sm">
              {title}
            </h1>
            {description && (
              <p className="text-gray-500 mt-1 font-medium italic">
                {description}
              </p>
            )}
          </div>
          {action && (
            <div className="flex items-center gap-3">
              {action}
            </div>
          )}
        </div>

        {children}
      </main>
    </div>
  )
}
