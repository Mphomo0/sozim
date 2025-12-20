'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Users, CheckCircle, BookOpen, Award } from 'lucide-react'
import Link from 'next/link'

interface Category {
  _id: string
  name: string
}

interface Course {
  _id: string
  name: string
  code: string
  description: string
  duration: string
  isOpen: boolean
  categoryId: { name: string }
  creditTotals: {
    knowledge: number
    practical: number
    workExperience: number
  }
  entryRequirements: string[]
  qualification?: string
  level?: string
  modules: {
    knowledgeModules: { title: string; nqfLevel: number; credits: number }[]
    practicalSkillModules: {
      title: string
      nqfLevel: number
      credits: number
    }[]
    workExperienceModules: {
      title: string
      nqfLevel: number
      credits: number
    }[]
  }
}

export default function OurPrograms() {
  const [courses, setCourses] = useState<Course[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoryResponse = await fetch('/api/categories')
        const categoriesData = await categoryResponse.json()
        setCategories(categoriesData)

        // Fetch courses
        const courseResponse = await fetch('/api/courses')
        const coursesData = await courseResponse.json()
        setCourses(coursesData.data)

        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredCourses =
    selectedCategory === 'All'
      ? courses
      : courses.filter((course) => course.categoryId?.name === selectedCategory)

  if (loading) return <div className="text-center h-96">Loading...</div>

  return (
    <>
      {/* CATEGORY FILTERS */}
      <section className="border-b bg-card py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category._id}
                variant="outline"
                size="sm"
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name}
              </Button>
            ))}

            {/* ALL BUTTON */}
            <Button
              key="All"
              variant="outline"
              size="sm"
              onClick={() => setSelectedCategory('All')}
            >
              All
            </Button>
          </div>
        </div>
      </section>

      {/* COURSES GRID */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => {
              // Flatten modules into a preview list of titles
              const allModules = [
                ...(course.modules?.knowledgeModules || []),
                ...(course.modules?.practicalSkillModules || []),
                ...(course.modules?.workExperienceModules || []),
              ]

              const moduleTitles = allModules.map((m) => m.title)

              return (
                <Card
                  key={course._id}
                  className="group flex flex-col overflow-hidden transition-all hover:shadow-xl"
                >
                  <CardHeader>
                    <div className="mb-3 flex items-center justify-between text-sm">
                      <Badge variant="secondary">
                        {course.categoryId?.name || 'Uncategorized'}
                      </Badge>
                      <Badge variant="outline">
                        {course.level || 'NQF Level ?'}
                      </Badge>
                    </div>

                    <CardTitle className="group-hover:text-primary transition-colors">
                      {course.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex-1">
                    <p className="mb-4 text-sm text-muted-foreground">
                      {course.description}
                    </p>

                    <div className="mb-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                    </div>

                    {/* MODULE PREVIEW */}
                    <div className="mb-4">
                      <h4 className="mb-2 font-semibold text-sm">
                        Course Modules:
                      </h4>

                      {moduleTitles.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          No modules added yet.
                        </p>
                      ) : (
                        <ul className="space-y-1">
                          {moduleTitles.slice(0, 3).map((title, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 text-sm text-muted-foreground"
                            >
                              <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                              <span>{title}</span>
                            </li>
                          ))}

                          {moduleTitles.length > 3 && (
                            <li className="text-sm text-primary">
                              +{moduleTitles.length - 3} more modules
                            </li>
                          )}
                        </ul>
                      )}
                    </div>

                    {/* ENTRY REQUIREMENTS */}
                    <div className="mb-4">
                      <h4 className="mb-2 font-semibold text-sm">
                        Requirements:
                      </h4>

                      {course.entryRequirements?.length ? (
                        <ul className="space-y-1">
                          {course.entryRequirements.map((req, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 text-sm text-muted-foreground"
                            >
                              <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-secondary" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No entry requirements.
                        </p>
                      )}
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="mt-6 flex gap-2">
                      <Link href="/student" className="flex-1">
                        <Button className="w-full bg-blue-900 text-white">
                          Apply Now
                        </Button>
                      </Link>

                      <Link href={`/courses/${course._id}`}>
                        <Button variant="outline" size="icon">
                          <BookOpen className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA FOOTER */}
      <section className="border-t bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <Award className="mx-auto mb-4 h-12 w-12 text-primary" />
            <h2 className="mb-4 text-3xl font-bold">
              Not Sure Which Course to Choose?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Our expert advisors are here to help you find the perfect program
              for your career goals.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/contact">
                <Button size="lg">Contact an Advisor</Button>
              </Link>

              <Link href="/student">
                <Button size="lg" variant="outline">
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
