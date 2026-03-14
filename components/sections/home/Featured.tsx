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
    <section className="py-24 relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-0 right-0 -mr-40 -mt-40 h-[500px] w-[500px] rounded-full bg-blue-100/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 h-[500px] w-[500px] rounded-full bg-sky-100/40 blur-3xl pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight md:text-5xl bg-gradient-to-r from-slate-900 via-blue-800 to-sky-700 bg-clip-text text-transparent">
            Why Choose Sozim?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
            We provide everything you need to succeed in your educational
            journey
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group relative border border-slate-200/60 bg-white/60 backdrop-blur-xl transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-8 relative z-10">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-700 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-500">
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="mb-3 text-2xl font-semibold tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
