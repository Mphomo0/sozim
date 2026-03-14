'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Users, CheckCircle, BookOpen, Award } from 'lucide-react'
import Link from 'next/link'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { motion, AnimatePresence } from 'motion/react'

export default function OurPrograms() {
  const [selectedCategory, setSelectedCategory] = useState('All')

  const coursesReq = useQuery(api.courses.getCourses)
  const categoriesReq = useQuery(api.categories.getCategories)

  const loading = coursesReq === undefined || categoriesReq === undefined
  const courses = coursesReq || []
  const categories = categoriesReq || []

  const getCategoryName = (course: any) => {
    const cat = categories.find(
      (c) => 
        c._id === course.actualCategoryId || 
        c.mongoId === course.categoryId || 
        c._id === course.categoryId
    )
    return cat ? cat.name : 'Uncategorized'
  }

  const filteredCourses =
    selectedCategory === 'All'
      ? courses
      : courses.filter((course) => getCategoryName(course) === selectedCategory)

  if (loading) return <div className="text-center h-96">Loading...</div>

  return (
    <>
      {/* CATEGORY FILTERS */}
      <section className="bg-slate-50 py-8 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-center flex-wrap gap-3">
            {/* ALL BUTTON */}
            <Button
              key="All"
              variant={selectedCategory === 'All' ? 'default' : 'outline'}
              className={`rounded-full px-6 transition-all duration-300 ${selectedCategory === 'All' ? 'bg-blue-600 text-white shadow-md' : 'bg-white hover:bg-blue-50'}`}
              size="sm"
              onClick={() => setSelectedCategory('All')}
            >
              All Programs
            </Button>
            
            {categories.map((category) => (
              <Button
                key={category._id}
                variant={selectedCategory === category.name ? 'default' : 'outline'}
                className={`rounded-full px-6 transition-all duration-300 max-sm:w-auto ${selectedCategory === category.name ? 'bg-blue-600 text-white shadow-md' : 'bg-white hover:bg-blue-50'}`}
                size="sm"
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* COURSES GRID */}
      <section className="py-20 relative bg-slate-50/50">
        <div className="container mx-auto px-4">
          <motion.div 
            layout
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence>
            {filteredCourses.map((course) => {
              // Flatten modules into a preview list of titles
              const allModules = [
                ...(course.modules?.knowledgeModules || []),
                ...(course.modules?.practicalSkillModules || []),
                ...(course.modules?.workExperienceModules || []),
              ]

              const moduleTitles = allModules.map((m) => m.title)

              return (
                <motion.div
                  key={course._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card
                    className="group h-full flex flex-col overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 border border-slate-200/60 bg-white/80 backdrop-blur-sm relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    
                    <CardHeader className="relative z-10 pb-4">
                      <div className="mb-4 flex items-center justify-between text-sm">
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1 rounded-full font-semibold">
                          {getCategoryName(course)}
                        </Badge>
                        <Badge variant="outline" className="text-slate-600 border-slate-300 rounded-full px-3 py-1">
                          {course.level || 'NQF Level ?'}
                        </Badge>
                      </div>

                      <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors duration-300 line-clamp-2">
                        {course.name}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col relative z-10">
                      <p className="mb-6 text-base text-slate-600 line-clamp-3 leading-relaxed">
                        {course.description}
                      </p>

                      <div className="mb-6 flex flex-wrap gap-4 text-sm font-medium text-slate-700 bg-slate-50 py-3 px-4 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-blue-500" />
                          <span>{course.duration}</span>
                        </div>
                      </div>

                      {/* MODULE PREVIEW */}
                      <div className="mb-6 flex-1">
                        <h4 className="mb-3 font-bold text-sm tracking-wide text-slate-900 uppercase">
                          Course Modules
                        </h4>

                        {moduleTitles.length === 0 ? (
                          <p className="text-sm text-slate-500 italic">
                            No modules added yet.
                          </p>
                        ) : (
                          <ul className="space-y-2.5">
                            {moduleTitles.slice(0, 3).map((title, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed"
                              >
                                <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0 text-green-500" />
                                <span>{title}</span>
                              </li>
                            ))}

                            {moduleTitles.length > 3 && (
                              <li className="text-sm font-semibold text-blue-600 mt-2 pl-8">
                                +{moduleTitles.length - 3} more modules
                              </li>
                            )}
                          </ul>
                        )}
                      </div>

                      {/* ENTRY REQUIREMENTS */}
                      <div className="mb-8">
                        <h4 className="mb-3 font-bold text-sm tracking-wide text-slate-900 uppercase">
                          Requirements
                        </h4>

                        {course.entryRequirements?.length ? (
                          <ul className="space-y-2.5">
                            {course.entryRequirements.slice(0, 2).map((req, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed"
                              >
                                <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0 text-sky-500" />
                                <span>{req}</span>
                              </li>
                            ))}
                            {course.entryRequirements.length > 2 && (
                              <li className="text-sm text-sky-600 pl-8">
                                +{course.entryRequirements.length - 2} more
                              </li>
                            )}
                          </ul>
                        ) : (
                          <p className="text-sm text-slate-500 italic">
                            No entry requirements.
                          </p>
                        )}
                      </div>

                      {/* ACTION BUTTONS */}
                      <div className="mt-auto flex gap-3 pt-6 border-t border-slate-100">
                        <Link href="/student" className="flex-1">
                          <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white shadow-md hover:shadow-lg transition-all rounded-xl h-11">
                            Apply Now
                          </Button>
                        </Link>

                        <Link href={`/courses/${course._id}`}>
                          <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-slate-300 hover:border-blue-500 hover:text-blue-600 transition-colors">
                            <BookOpen className="h-5 w-5" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* CTA FOOTER */}
      <section className="relative bg-slate-900 py-24 overflow-hidden mt-12">
        <div className="absolute inset-0 bg-[url('https://ik.imagekit.io/vzofqg2fg/images/abstract-bg.jpg')] bg-cover bg-center opacity-10 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/90 to-blue-950/80" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center text-white">
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 shadow-[0_0_40px_rgba(56,189,248,0.3)]">
              <Award className="h-10 w-10 text-white" />
            </div>
            <h2 className="mb-6 text-4xl font-extrabold tracking-tight md:text-5xl">
              Not Sure Which Course to Choose?
            </h2>
            <p className="mb-10 text-xl font-light text-slate-300 leading-relaxed">
              Our expert advisors are here to help you find the perfect program
              for your career goals. Let's build your future together.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/contact">
                <Button size="lg" className="h-14 px-8 rounded-full text-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all duration-300 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 border-0 text-white w-full sm:w-auto">
                  Contact an Advisor
                </Button>
              </Link>

              <Link href="/student">
                <Button size="lg" variant="outline" className="h-14 px-8 rounded-full text-lg bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white/20 hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto">
                  Start Application
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
