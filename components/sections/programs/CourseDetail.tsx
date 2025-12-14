'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Clock,
  GraduationCap,
  CheckCircle,
  ArrowLeft,
  BookOpen,
  ToolCase,
  Briefcase,
} from 'lucide-react'

interface Module {
  title: string
  nqfLevel: number
  credits: number
}

interface Modules {
  knowledgeModules: Module[]
  practicalSkillModules: Module[]
  workExperienceModules: Module[]
}

interface Course {
  name: string
  description: string
  duration: string
  level: string
  qualification?: string
  modules: Modules
  creditTotals: {
    knowledge: number
    practical: number
    workExperience: number
  }
  entryRequirements: string[]
}

export default function CourseDetail() {
  const params = useParams()
  const courseId = params?.id

  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<
    'knowledge' | 'practical' | 'work'
  >('knowledge')

  const handleTabChange = (tab: 'knowledge' | 'practical' | 'work') => {
    setActiveTab(tab)
  }

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/courses/${courseId}`)
        const data = await res.json()
        setCourse(data.data ?? data)
      } catch (err) {
        console.error(err)
        setCourse(null)
      }
      setLoading(false)
    }

    if (courseId) fetchCourse()
  }, [courseId])

  if (loading)
    return (
      <div className="p-10 text-center text-lg text-gray-600">Loading...</div>
    )

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Course Not Found</h1>
          <Button asChild>
            <Link href="/courses">Back to Courses</Link>
          </Button>
        </div>
      </div>
    )
  }

  const moduleSections = [
    {
      key: 'knowledge',
      title: 'Knowledge Modules',
      modules: course.modules.knowledgeModules,
      icon: <BookOpen className="h-6 w-6 text-blue-700" />,
    },
    {
      key: 'practical',
      title: 'Practical Skill Modules',
      modules: course.modules.practicalSkillModules,
      icon: <ToolCase className="h-6 w-6 text-yellow-700" />,
    },
    {
      key: 'work',
      title: 'Work Experience Modules',
      modules: course.modules.workExperienceModules,
      icon: <Briefcase className="h-6 w-6 text-yellow-700" />,
    },
  ]

  return (
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link
            href="/courses"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Link>
        </Button>

        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          <div className="flex-1 space-y-4">
            <h1 className="text-4xl font-extrabold text-gray-900">
              {course.name}
            </h1>
            {course.qualification && (
              <Badge className="text-sm px-3 py-1 rounded-full bg-purple-100 text-purple-800">
                {course.qualification}
              </Badge>
            )}
            <p className="text-gray-700 text-lg">{course.description}</p>

            {/* Info badges */}
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2 bg-white shadow-md px-4 py-2 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-gray-800">
                  {course.duration}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white shadow-md px-4 py-2 rounded-lg">
                <GraduationCap className="h-5 w-5 text-green-600" />
                <span className="font-medium text-gray-800">
                  {course.level}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex space-x-6 border-b-2 border-gray-300">
            {moduleSections.map((section) => (
              <button
                key={section.key}
                onClick={() => handleTabChange(section.key as any)}
                className={`px-6 py-3 text-lg font-semibold ${
                  activeTab === section.key
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  {section.icon}
                  {section.title}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {moduleSections.map((section) => (
            <div
              key={section.key}
              className={activeTab === section.key ? 'block' : 'hidden'}
            >
              <Card className="rounded-xl shadow-md hover:shadow-xl transition-shadow bg-white mb-6">
                <CardContent className="px-6 py-4 bg-gray-50 rounded-b-xl">
                  <ul className="space-y-3">
                    {section.modules.map((mod, idx) => (
                      <li
                        key={idx}
                        className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
                      >
                        <span className="font-medium text-gray-800">
                          {mod.title}
                        </span>
                        <span
                          className={`text-sm font-semibold px-2 py-1 rounded-full ${
                            section.key === 'knowledge'
                              ? 'bg-blue-100 text-blue-800'
                              : section.key === 'practical'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          Level{mod.nqfLevel} | {mod.credits}credits
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Entry Requirements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white shadow-md rounded-xl">
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-900">
                Entry Requirements
              </h2>
            </CardHeader>
            <CardContent className="px-6 py-4">
              <ul className="space-y-3">
                {course.entryRequirements.map((req, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-gray-700"
                  >
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          {/* Apply Card */}
          <div className="w-full lg:w-1/3">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg rounded-xl">
              <CardHeader>
                <h3 className="text-2xl font-bold text-blue-700">
                  Ready to Apply?
                </h3>
              </CardHeader>
              <CardContent className="mt-2">
                <Button
                  asChild
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
                  size="lg"
                >
                  <Link href="/student">Apply Now</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
