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
import { CheckCircle, Zap, BookOpen, Clock, Users, Globe } from 'lucide-react'
import { JSX } from 'react'

// Icon map for reuse
const iconMap: Record<string, JSX.Element> = {
  assessor: <CheckCircle className="w-5 h-5 mr-2 text-red-500" />,
  facilitator: <Users className="w-5 h-5 mr-2 text-indigo-500" />,
  library: <BookOpen className="w-5 h-5 mr-2 text-teal-500" />,
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
    <ScrollArea className="h-[calc(100vh-140px)] md:h-[calc(100vh-150px)] lg:h-[calc(100vh-160px)] p-4">
      {/* Header */}
      <div className="flex items-center mb-6 border-b pb-4">
        {iconMap[pathway.id]}
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white break-words">
          {pathway.title}
        </h2>
      </div>

      {/* Summary */}
      <Card className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 border-l-4 border-l-primary">
        <p className="text-gray-700 dark:text-gray-300 italic mb-4">
          {pathway.description}
        </p>

        <div className="flex flex-wrap gap-4 text-sm font-medium">
          <Badge className="bg-primary hover:bg-primary/90 text-white">
            <Zap className="w-3 h-3 mr-1" /> NQF Level: {pathway.n_q_f_level}
          </Badge>

          <Badge variant="outline" className="text-gray-900 dark:text-white">
            <Clock className="w-3 h-3 mr-1" /> Credits: {pathway.credits}
          </Badge>
        </div>
      </Card>

      {/* Steps */}
      <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        Career Progression
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pathway.steps.map((step, index) => (
          <div key={index} className="flex flex-col">
            <StepCard step={step} />

            {index < pathway.steps.length - 1 && (
              <div className="h-4 w-1 bg-primary/20 self-center hidden md:block" />
            )}
          </div>
        ))}
      </div>

      {/* Registration */}
      {pathway.registration && (
        <>
          <Separator className="my-10" />

          <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            Professional Registration & Compliance
          </h3>

          <div className="flex flex-wrap gap-3">
            {pathway.registration.map((reg, index) => (
              <Badge
                key={index}
                variant="outline"
                className="p-2 border-primary text-primary dark:text-primary dark:border-primary/60"
              >
                <Globe className="w-4 h-4 mr-2" />
                {reg}
              </Badge>
            ))}
          </div>
        </>
      )}
    </ScrollArea>
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
    <div className="container mx-auto py-6 md:py-10 px-2 sm:px-4">
      <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
        {/* Mobile ShadCN Select */}
        <div className="md:hidden mb-4">
          <Select value={tabValue} onValueChange={setTabValue}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a pathway" />
            </SelectTrigger>
            <SelectContent>
              {careerPathways.map((pathway) => (
                <SelectItem key={pathway.id} value={pathway.id}>
                  <div className="flex items-center">
                    {iconMap[pathway.id]}
                    {pathway.title.split('(')[0].trim()}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sticky Desktop Tabs */}
        <div className="hidden md:block sticky top-0 z-10 bg-white/80 dark:bg-black/50 backdrop-blur mb-6">
          <div className="flex justify-start md:justify-center w-full overflow-x-auto p-1 relative">
            <TabsList className="relative flex gap-2 p-1 bg-gray-100 dark:bg-gray-900 rounded-lg whitespace-nowrap">
              {/* Sliding underline */}
              <div
                className="absolute bottom-0 h-[3px] bg-primary transition-all duration-300"
                style={{
                  width: `${100 / careerPathways.length}%`,
                  transform: `translateX(${
                    careerPathways.findIndex((p) => p.id === tabValue) * 100
                  }%)`,
                }}
              />

              {careerPathways.map((pathway) => (
                <TabsTrigger
                  key={pathway.id}
                  value={pathway.id}
                  className="
                    py-3 px-4 font-semibold transition-all duration-300 rounded-md 
                    flex items-center gap-2
                    data-[state=active]:text-primary
                    hover:bg-primary/10 dark:hover:bg-primary/20
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
        {careerPathways.map((pathway) => (
          <TabsContent key={pathway.id} value={pathway.id}>
            <PathwayDetail pathway={pathway} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
