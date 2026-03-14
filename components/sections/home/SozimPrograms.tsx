'use client'

import { useState } from 'react'
import { BookOpen } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

export default function SozimPrograms() {
  const coursesRaw = useQuery(api.courses.getCourses)
  const categoriesRaw = useQuery(api.categories.getCategories)

  const programs = coursesRaw || []
  const categories = categoriesRaw || []

  const getCategoryName = (course: any) => {
    const cat = categories.find(
      (c) => 
        c._id === course.actualCategoryId || 
        c.mongoId === course.categoryId || 
        c._id === course.categoryId
    )
    return cat ? cat.name : 'Uncategorized'
  }

  return (
    <section className="bg-slate-50 py-24 relative overflow-hidden">
      {/* Decorative gradient orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-blue-100/30 blur-3xl pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight md:text-5xl bg-gradient-to-r from-slate-900 via-blue-800 to-sky-700 bg-clip-text text-transparent">
            Popular Programs
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
            Explore our most sought-after courses designed for career success
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <Card
              key={program._id}
              className="group relative overflow-hidden border border-slate-200/60 bg-white/80 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 flex flex-col"
            >
              <CardContent className="p-8 flex-1 flex flex-col">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-semibold tracking-wide text-blue-600 uppercase">
                    {getCategoryName(program)}
                  </span>
                </div>
                <h3 className="mb-3 text-2xl font-semibold tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors duration-300">
                  {program.name}
                </h3>
                <p className="mb-8 text-muted-foreground line-clamp-3 leading-relaxed flex-1">
                  {program.description}
                </p>
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100">
                  <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    {program.duration}
                  </span>
                  <Link href="/courses">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors duration-300 font-semibold"
                    >
                      Learn More &rarr;
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-16 text-center">
          <Link href="/courses">
            <Button size="lg" className="h-14 px-8 rounded-full text-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 border-0 text-white">
              View All Programs
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
