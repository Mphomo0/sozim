import { BookOpen } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const programs = [
  {
    title: 'Business Management',
    duration: '12 months',
    level: 'Diploma',
    description:
      'Comprehensive business management training covering all essential areas',
  },
  {
    title: 'Financial Management',
    duration: '12 months',
    level: 'Diploma',
    description:
      'Master financial planning, analysis, and strategic decision-making',
  },
  {
    title: 'Marketing Management',
    duration: '12 months',
    level: 'Diploma',
    description:
      'Learn modern marketing strategies and digital marketing techniques',
  },
  {
    title: 'Human Resources',
    duration: '12 months',
    level: 'Diploma',
    description:
      'Develop expertise in people management and organizational development',
  },
]

export default function SozimPrograms() {
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {programs.map((program, index) => (
            <Card
              key={index}
              className="group overflow-hidden transition-all hover:shadow-xl"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    {program.level}
                  </span>
                </div>
                <h3 className="mb-2 text-xl font-semibold group-hover:text-primary transition-colors">
                  {program.title}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
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
