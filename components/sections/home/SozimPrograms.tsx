'use client'

import { useState, useEffect } from 'react'
import { BookOpen } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Program {
  _id: number
  name: string
  duration: string
  description: string
  categoryId: { name: string }
}

export default function SozimPrograms() {
  // Explicitly type the state as an array of Program objects
  const [programs, setPrograms] = useState<Program[]>([])

  const fetchPrograms = async () => {
    try {
      const response = await fetch('/api/courses')
      const data = await response.json()
      console.log(data)
      setPrograms(data.data) // assuming the data is of type Program[]
    } catch (error) {
      console.error('Error fetching programs:', error)
    }
  }

  useEffect(() => {
    fetchPrograms()
  }, [])

  return (
    <section className="bg-muted/50 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Popular Programs
          </h2>
          <p className="text-lg text-muted-foreground">
            Explore our most sought-after courses designed for career success
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <Card
              key={program._id} // Using _id as the key since that's what your interface has
              className="group overflow-hidden transition-all hover:shadow-xl"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    {program.categoryId.name}
                  </span>
                </div>
                <h3 className="mb-2 text-xl font-semibold group-hover:text-primary transition-colors">
                  {program.name}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground line-clamp-4">
                  {program.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {program.duration}
                  </span>
                  <Link href="/courses">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="group-hover:text-primary"
                    >
                      Learn More →
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/courses">
            <Button size="lg" variant="outline">
              View All Programs
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
