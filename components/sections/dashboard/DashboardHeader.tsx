import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'

interface BreadcrumbStep {
  label: string
  href?: string
}

interface DashboardHeaderProps {
  breadcrumbs: BreadcrumbStep[]
}

export function DashboardHeader({ breadcrumbs }: DashboardHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 transition-all duration-200">
      <div className="flex items-center gap-2 px-4 w-full">
        <SidebarTrigger className="-ml-1 hover:bg-accent hover:text-accent-foreground transition-colors" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/dashboard" className="transition-colors hover:text-primary">
                Sozim Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            {breadcrumbs.map((step, index) => (
              <React.Fragment key={index}>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  {step.href ? (
                    <BreadcrumbLink href={step.href} className="transition-colors hover:text-primary">
                      {step.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="font-semibold text-foreground">
                      {step.label}
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
}
