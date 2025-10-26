import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Users, CheckCircle, BookOpen, Award } from 'lucide-react'
import Link from 'next/link'

const courses = [
  {
    id: 1,
    title: 'Business Management',
    category: 'Business',
    level: 'Diploma',
    duration: '12 months',
    students: '500+',
    description:
      'Comprehensive business management program covering strategic planning, operations, and leadership.',
    modules: [
      'Strategic Management',
      'Operations Management',
      'Business Finance',
      'Marketing Management',
      'Human Resource Management',
      'Project Management',
    ],
    requirements: [
      'Grade 12 certificate or equivalent',
      'Basic computer literacy',
      'English proficiency',
    ],
  },
  {
    id: 2,
    title: 'Financial Management',
    category: 'Finance',
    level: 'Diploma',
    duration: '12 months',
    students: '400+',
    description:
      'Master financial planning, analysis, and strategic financial decision-making for business success.',
    modules: [
      'Financial Accounting',
      'Management Accounting',
      'Financial Planning',
      'Investment Analysis',
      'Risk Management',
      'Corporate Finance',
    ],
    requirements: [
      'Grade 12 certificate with Mathematics',
      'Basic accounting knowledge',
      'Computer literacy',
    ],
  },
  {
    id: 3,
    title: 'Marketing Management',
    category: 'Marketing',
    level: 'Diploma',
    duration: '12 months',
    students: '450+',
    description:
      'Learn modern marketing strategies, digital marketing, and brand management techniques.',
    modules: [
      'Marketing Principles',
      'Digital Marketing',
      'Consumer Behavior',
      'Brand Management',
      'Marketing Research',
      'Social Media Marketing',
    ],
    requirements: [
      'Grade 12 certificate or equivalent',
      'Creative thinking skills',
      'Computer and internet proficiency',
    ],
  },
  {
    id: 4,
    title: 'Human Resources Management',
    category: 'HR',
    level: 'Diploma',
    duration: '12 months',
    students: '380+',
    description:
      'Develop expertise in people management, recruitment, and organizational development.',
    modules: [
      'HR Strategy',
      'Recruitment & Selection',
      'Training & Development',
      'Performance Management',
      'Employment Law',
      'Organizational Behavior',
    ],
    requirements: [
      'Grade 12 certificate or equivalent',
      'Good communication skills',
      'Interest in people management',
    ],
  },
  {
    id: 5,
    title: 'Project Management',
    category: 'Management',
    level: 'Certificate',
    duration: '6 months',
    students: '300+',
    description:
      'Learn essential project management skills and methodologies for successful project delivery.',
    modules: [
      'Project Planning',
      'Risk Management',
      'Budget Management',
      'Team Leadership',
      'Quality Control',
      'Project Execution',
    ],
    requirements: [
      'Grade 12 certificate or equivalent',
      'Basic management understanding',
      'Computer literacy',
    ],
  },
  {
    id: 6,
    title: 'Supply Chain Management',
    category: 'Operations',
    level: 'Certificate',
    duration: '6 months',
    students: '280+',
    description:
      'Master logistics, procurement, and supply chain optimization for business efficiency.',
    modules: [
      'Supply Chain Fundamentals',
      'Procurement Management',
      'Inventory Control',
      'Logistics Management',
      'Warehouse Management',
      'Supply Chain Analytics',
    ],
    requirements: [
      'Grade 12 certificate or equivalent',
      'Analytical thinking skills',
      'Basic computer skills',
    ],
  },
]

const categories = [
  'All',
  'Business',
  'Finance',
  'Marketing',
  'HR',
  'Management',
  'Operations',
]

export default function OurPrograms() {
  return (
    <>
      <section className="border-b bg-card py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center flex-wrap gap-2">
            {categories.map((category) => (
              <Button key={category} variant="outline" size="sm">
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Card
                key={course.id}
                className="group flex flex-col overflow-hidden transition-all hover:shadow-xl"
              >
                <CardHeader>
                  <div className="mb-3 flex items-center justify-between">
                    <Badge variant="secondary">{course.category}</Badge>
                    <Badge variant="outline">{course.level}</Badge>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {course.title}
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
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{course.students}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="mb-2 font-semibold text-sm">
                      Course Modules:
                    </h4>
                    <ul className="space-y-1">
                      {course.modules.slice(0, 3).map((module, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                          <span>{module}</span>
                        </li>
                      ))}
                      {course.modules.length > 3 && (
                        <li className="text-sm text-primary">
                          +{course.modules.length - 3} more modules
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="mb-2 font-semibold text-sm">
                      Requirements:
                    </h4>
                    <ul className="space-y-1">
                      {course.requirements.map((req, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-secondary" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 flex gap-2">
                    <Link href="/apply" className="flex-1">
                      <Button className="w-full bg-gradient-to-r from-primary to-secondary">
                        Apply Now
                      </Button>
                    </Link>
                    <Button variant="outline" size="icon">
                      <BookOpen className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <Award className="mx-auto mb-4 h-12 w-12 text-primary" />
            <h2 className="mb-4 text-3xl font-bold">
              Not Sure Which Course to Choose?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Our expert advisors are here to help you find the perfect program
              for your career goals
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/contact">
                <Button size="lg">Contact an Advisor</Button>
              </Link>
              <Link href="/apply">
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
