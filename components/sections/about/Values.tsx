import {
  Award,
  Globe,
  Heart,
  GraduationCap,
  BookOpen,
  Target,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const values = [
  {
    icon: Award,
    title: 'Excellence',
    items: [
      'Well-trained and equipped personnel',
      'Information for knowledge and lifelong learning',
      'Unique and authentic information resources',
    ],
  },
  {
    icon: GraduationCap,
    title: 'Innovation and Impact',
    description:
      'Contributing towards graduate attributes through the provision of teaching and learning and rich information resources.',
  },
  {
    icon: Globe,
    title: 'Accountability',
    items: [
      'Align with policies, procedures',
      'Quality assurance on all processes and activities',
      'Align with QCTO and ETDP SETA standards',
    ],
  },
  {
    icon: Heart,
    title: 'Care',
    description:
      'We commit to conduct ourselves professionally with exceptional care to serve our clients with dignity',
  },
  {
    icon: BookOpen,
    title: 'Social Justice',
    description:
      'Champion diversity, inclusion and equality by availing neutral vibrant spaces, services and facilities that accommodate communities regardless of their background or identity',
  },
  {
    icon: Target,
    title: 'Sustainability',
    description:
      'We commit to ethical and responsible stewardship of all teaching and learning processes, and practices to ensure operational, financial, environmental, and societal sustainability. Ensuring appropriate training structures, as well as management and leadership, are in place',
  },
]

export default function Values() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-28">
      {/* Abstract Background Elements */}
      <div className="absolute top-1/4 left-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-sky-100/40 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 h-[600px] w-[600px] translate-x-1/4 translate-y-1/4 rounded-full bg-blue-100/40 blur-[100px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mb-20 text-center">
          <h2 className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
            Our Core Values
          </h2>
          <p className="mx-auto max-w-2xl text-balance text-xl font-light leading-relaxed text-muted-foreground">
            The principles that guide everything we do and shape our commitment
            to excellence
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border border-slate-200/50 bg-white/70 backdrop-blur-lg transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 flex flex-col"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
              <CardContent className="p-8 relative z-10 flex-1 flex flex-col">
                <div className="mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-blue-800 shadow-md group-hover:scale-110 transition-transform duration-500">
                    <value.icon className="h-7 w-7 text-white" />
                  </div>
                </div>
                <h3 className="mb-4 text-2xl font-semibold tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors duration-300">
                  {value.title}
                </h3>
                {value.description ? (
                  <p className="text-pretty text-base leading-relaxed text-muted-foreground flex-1">
                    {value.description}
                  </p>
                ) : (
                  <ul className="space-y-3 flex-1">
                    {value.items?.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-base leading-relaxed text-muted-foreground"
                      >
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
