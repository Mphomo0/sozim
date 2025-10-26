import { Card, CardContent } from '@/components/ui/card'
import { GraduationCap, Users, Award, TrendingUp } from 'lucide-react'

const features = [
  {
    icon: GraduationCap,
    title: 'Quality Education',
    description:
      'Industry-relevant courses taught by experienced professionals',
  },
  {
    icon: Users,
    title: 'Expert Instructors',
    description:
      'Learn from industry leaders with years of practical experience',
  },
  {
    icon: Award,
    title: 'Recognized Certificates',
    description: 'Earn certificates that are valued by employers nationwide',
  },
  {
    icon: TrendingUp,
    title: 'Career Growth',
    description:
      'Programs designed to accelerate your professional development',
  },
]

export default function Featured() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Why Choose Sozim?
          </h2>
          <p className="text-lg text-muted-foreground">
            We provide everything you need to succeed in your educational
            journey
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-2 transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-slate-950 to-sky-700">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
