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
  ChevronRight
} from 'lucide-react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { motion, AnimatePresence } from 'motion/react'

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
  const rawCourseId = typeof params?.id === 'string' ? params.id : undefined
  const isConvexId = rawCourseId && rawCourseId.length === 32
  const courseId = isConvexId ? (rawCourseId as Id<'courses'>) : undefined

  const courseData = useQuery(api.courses.getCourseById, courseId ? { id: courseId } : 'skip')

  const [activeTab, setActiveTab] = useState<
    'knowledge' | 'practical' | 'work'
  >('knowledge')

  const handleTabChange = (tab: 'knowledge' | 'practical' | 'work') => {
    setActiveTab(tab)
  }

  const course = (courseData as any)?.data ?? courseData

  if (courseData === undefined && isConvexId)
    return (
      <div className="p-10 text-center text-lg text-gray-600">Loading...</div>
    )

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Course Not Found</h1>
          <p className="text-gray-600 mb-6">
            The course you are looking for might have been moved or this link is outdated.
          </p>
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
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Premium Hero Header for Course Detail */}
      <div className="bg-gradient-to-br from-slate-900 tracking-tight via-blue-900 to-sky-900 py-16 relative overflow-hidden mb-12 shadow-md">
        <div className="absolute inset-0 bg-[url('https://ik.imagekit.io/vzofqg2fg/images/abstract-bg.jpg')] bg-cover opacity-10 mix-blend-overlay" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Button variant="ghost" asChild className="mb-8 text-blue-100 hover:text-white hover:bg-white/10 rounded-full px-6 backdrop-blur-md">
            <Link
              href="/courses"
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Courses
            </Link>
          </Button>

          <div className="flex flex-col lg:flex-row gap-8 text-white">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1 space-y-6"
            >
              {course.qualification && (
                <Badge className="text-sm px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-100 border border-blue-400/30 backdrop-blur-md font-semibold tracking-wide">
                  {course.qualification}
                </Badge>
              )}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight drop-shadow-md">
                {course.name}
              </h1>
              <p className="text-blue-100/90 text-xl font-light leading-relaxed max-w-4xl">
                {course.description}
              </p>

              {/* Info badges */}
              <div className="flex flex-wrap gap-5 mt-8 pt-6 border-t border-white/10">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/10 px-5 py-3 rounded-2xl shadow-lg">
                  <div className="p-2 bg-blue-500/30 rounded-lg">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-blue-200 font-medium uppercase tracking-wider">Duration</span>
                    <span className="font-bold text-white text-lg">{course.duration}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/10 px-5 py-3 rounded-2xl shadow-lg">
                  <div className="p-2 bg-green-500/30 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-green-200 font-medium uppercase tracking-wider">Level</span>
                    <span className="font-bold text-white text-lg">{course.level}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Tab Navigation */}
        <div className="mb-8 overflow-x-auto pb-4 hide-scrollbar">
          <div className="flex space-x-2 md:space-x-4 min-w-max p-1 bg-slate-200/50 rounded-2xl p-2 w-max mx-auto shadow-inner">
            {moduleSections.map((section) => (
              <button
                key={section.key}
                onClick={() => handleTabChange(section.key as any)}
                className={`relative px-6 py-3 text-base md:text-lg font-bold rounded-xl transition-all duration-300 flex items-center gap-2 outline-none ${
                  activeTab === section.key
                    ? 'text-blue-700 bg-white shadow-md'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/80'
                }`}
              >
                {activeTab === section.key && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white rounded-xl shadow-md border border-slate-100"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {section.icon}
                  {section.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-12">
          <AnimatePresence mode="wait">
            {moduleSections.map((section) => (
              activeTab === section.key && (
                <motion.div
                  key={section.key}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="rounded-3xl shadow-xl hover:shadow-2xl transition-shadow bg-white overflow-hidden border border-slate-200/60">
                    <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-100 py-6">
                       <h3 className="text-2xl font-bold flex items-center gap-3">
                         {section.icon} {section.title}
                       </h3>
                    </CardHeader>
                    <CardContent className="p-6 md:p-8 bg-slate-50/30">
                      <ul className="space-y-4">
                        {section.modules.map((mod: any, idx: number) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="group flex flex-col md:flex-row md:items-center justify-between p-5 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-100 hover:bg-blue-50/30 transition-all gap-4"
                          >
                            <div className="flex items-start gap-4">
                              <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                {idx + 1}
                              </div>
                              <span className="font-semibold text-slate-800 text-lg group-hover:text-blue-800 transition-colors">
                                {mod.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 ml-12 md:ml-0">
                              <Badge variant="outline" className="bg-slate-50 text-slate-600 font-medium px-3 py-1.5 rounded-full border-slate-200">
                                Level {mod.nqfLevel}
                              </Badge>
                              <Badge className={`font-semibold px-3 py-1.5 rounded-full shadow-sm ${
                                section.key === 'knowledge'
                                  ? 'bg-blue-100 text-blue-800 border-blue-200'
                                  : section.key === 'practical'
                                  ? 'bg-green-100 text-green-800 border-green-200'
                                  : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                              }`} 
                              variant="outline">
                                {mod.credits} Credits
                              </Badge>
                            </div>
                          </motion.li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>

        {/* Entry Requirements & CTA Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          <Card className="flex-1 bg-white shadow-xl rounded-3xl border border-slate-200/60 overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 py-6">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-500" /> Entry Requirements
              </h2>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.entryRequirements.map((req: string, idx: number) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-slate-700 bg-slate-50/50 p-4 rounded-xl border border-slate-100"
                  >
                    <ChevronRight className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="font-medium leading-relaxed">{req}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Apply Card */}
          <div className="w-full lg:w-1/3">
            <Card className="bg-gradient-to-br from-blue-600 to-sky-700 shadow-2xl rounded-3xl text-white relative overflow-hidden h-full flex flex-col justify-center">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 h-40 w-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-40 w-40 rounded-full bg-blue-900/30 blur-2xl pointer-events-none" />
              
              <CardHeader className="relative z-10 text-center pb-2">
                <h3 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                  Ready to Apply?
                </h3>
                <p className="text-blue-100 mt-2 font-medium">Take the next step in your career.</p>
              </CardHeader>
              <CardContent className="mt-4 relative z-10">
                <Button
                  asChild
                  className="w-full bg-white hover:bg-slate-50 text-blue-700 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 font-bold py-6 text-lg rounded-2xl"
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
