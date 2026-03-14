'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from '@/components/ui/select'
import { careerPathways, CareerPathway, PathwayStep } from '@/lib/pathwayData'
import { CheckCircle, Zap, BookOpen, Clock, Users, Globe, ChevronRight } from 'lucide-react'
import { JSX } from 'react'
import { motion, AnimatePresence } from 'motion/react'

// Icon map for reuse
const iconMap: Record<string, JSX.Element> = {
  assessor: <CheckCircle className="w-6 h-6 text-blue-500" />,
  facilitator: <Users className="w-6 h-6 text-indigo-500" />,
  library: <BookOpen className="w-6 h-6 text-emerald-500" />,
}

// --- Step Card ---
const StepCard = ({ step }: { step: PathwayStep }) => (
  <Card
    className="
      shadow-md transition-all 
      hover:shadow-xl hover:-translate-y-1 
      h-full animate-fadeUp
    "
  >
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <CardTitle className="text-lg font-semibold text-primary">
          {step.title}
        </CardTitle>

        {step.n_q_f_level && (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            NQF {step.n_q_f_level}
          </Badge>
        )}
      </div>
    </CardHeader>

    <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
      {step.requirements && (
        <p className="text-sm font-medium flex items-start">
          <CheckCircle className="w-4 h-4 mr-2 mt-1 flex-shrink-0 text-green-600" />
          <span>
            <span className="font-bold">Requirements:</span> {step.requirements}
          </span>
        </p>
      )}

      {Array.isArray(step.description) ? (
        <ul className="list-disc ml-5 space-y-1 text-sm">
          {step.description.map((item, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
      ) : (
        <p
          className="text-sm"
          dangerouslySetInnerHTML={{ __html: step.description }}
        />
      )}
    </CardContent>
  </Card>
)

// --- Pathway Details ---
const PathwayDetail = ({ pathway }: { pathway: CareerPathway }) => {
  return (
    <div className="space-y-12 py-8">
      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="relative overflow-hidden border-slate-200/60 transition-all duration-500 shadow-xl group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardContent className="p-8 md:p-12 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8 pb-8 border-b border-slate-100">
              <div className="flex items-center gap-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-sm border border-blue-100">
                  {iconMap[pathway.id]}
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                    {pathway.title}
                  </h2>
                  <div className="flex flex-wrap gap-4 mt-3">
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-4 py-1 rounded-full font-bold shadow-sm">
                      <Zap className="w-3.5 h-3.5 mr-1.5" /> NQF LEVEL {pathway.n_q_f_level}
                    </Badge>
                    <Badge variant="outline" className="text-slate-600 border-slate-300 px-4 py-1 rounded-full font-semibold">
                      <Clock className="w-3.5 h-3.5 mr-1.5" /> {pathway.credits} CREDITS
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xl font-light text-slate-600 leading-relaxed max-w-4xl italic">
              "{pathway.description}"
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Career Progression Section */}
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
            Career Progression
          </h3>
          <div className="h-1 flex-1 bg-slate-100 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pathway.steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="h-full group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-slate-200/60 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-20 group-hover:opacity-100 transition-opacity duration-500" />
                
                <CardHeader className="pb-4">
                   <div className="flex items-center justify-between mb-4">
                     <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white font-bold shadow-lg">
                       {index + 1}
                     </span>
                     {step.n_q_f_level && (
                       <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 px-3 py-1 rounded-full font-bold">
                         NQF {step.n_q_f_level}
                       </Badge>
                     )}
                   </div>
                   <CardTitle className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                     {step.title}
                   </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  {step.requirements && (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" /> REQUIREMENTS
                      </p>
                      <p className="text-sm font-medium text-slate-600 leading-relaxed">
                        {step.requirements}
                      </p>
                    </div>
                  )}

                  <div className="text-sm font-medium text-slate-600 leading-relaxed pl-1">
                    {Array.isArray(step.description) ? (
                      <ul className="space-y-3">
                        {step.description.map((item, idx) => (
                          <li key={idx} className="flex gap-3 items-start">
                            <ChevronRight className="w-4 h-4 mt-0.5 text-blue-400 shrink-0" />
                            <span dangerouslySetInnerHTML={{ __html: item }} />
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p dangerouslySetInnerHTML={{ __html: step.description }} />
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Registration Section */}
      {pathway.registration && (
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="flex items-center gap-4">
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
              Professional Registration & Compliance
            </h3>
            <div className="h-1 flex-1 bg-slate-100 rounded-full" />
          </div>

          <div className="flex flex-wrap gap-4">
            {pathway.registration.map((reg, index) => (
              <Badge
                key={index}
                className="p-4 bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-sm transition-all text-base font-bold rounded-2xl flex gap-3"
                variant="outline"
              >
                <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Globe className="w-5 h-5" />
                </div>
                {reg}
              </Badge>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

// --- Main Component ---
export default function CareerPathwayComp() {
  const defaultTab = careerPathways[0]?.id || 'assessor'
  const [tabValue, setTabValue] = useState(defaultTab)

  // Smooth scroll to top when tabs switch
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [tabValue])

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto py-16 px-4">
        <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
          {/* Mobile Selector */}
          <div className="md:hidden mb-8">
            <Select value={tabValue} onValueChange={setTabValue}>
              <SelectTrigger className="w-full h-14 rounded-2xl bg-white border-slate-200 shadow-lg">
                <SelectValue placeholder="Choose a pathway" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                {careerPathways.map((pathway) => (
                  <SelectItem key={pathway.id} value={pathway.id}>
                    <div className="flex items-center gap-3">
                      {iconMap[pathway.id]}
                      <span className="font-bold text-slate-800">
                        {pathway.title.split('(')[0].trim()}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sticky Desktop Tabs */}
          <div className="hidden md:block sticky top-24 z-30 mb-12">
            <div className="flex justify-center bg-white/70 backdrop-blur-xl p-2 rounded-[28px] shadow-2xl border border-white/50 max-w-4xl mx-auto">
              <TabsList className="flex gap-2 p-1 bg-slate-100/50 rounded-2xl w-full">
                {careerPathways.map((pathway) => (
                  <TabsTrigger
                    key={pathway.id}
                    value={pathway.id}
                    className="
                      flex-1 py-4 px-6 font-bold transition-all duration-300 rounded-xl
                      flex items-center justify-center gap-3
                      data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-lg
                      data-[state=active]:ring-1 data-[state=active]:ring-slate-100
                      text-slate-500 hover:text-slate-800 hover:bg-slate-100/50
                    "
                  >
                    {iconMap[pathway.id]}
                    {pathway.title.split('(')[0].trim()}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {careerPathways.map((pathway) => (
              <TabsContent key={pathway.id} value={pathway.id} className="outline-none">
                <PathwayDetail pathway={pathway} />
              </TabsContent>
            ))}
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  )
}

