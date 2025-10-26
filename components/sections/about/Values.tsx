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
    <section className="bg-gradient-to-b from-background to-muted/30 py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Our Core Values
          </h2>
          <p className="mx-auto max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground">
            The principles that guide everything we do and shape our commitment
            to excellence
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value, index) => (
            <Card
              key={index}
              className="group border-border/50 bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
            >
              <CardContent className="p-8">
                <div className="mb-6 flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-slate-950 to-sky-700 transition-colors duration-300">
                    <value.icon className="h-7 w-7 text-white" />
                  </div>
                </div>
                <h3 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                  {value.title}
                </h3>
                {value.description ? (
                  <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                    {value.description}
                  </p>
                ) : (
                  <ul className="space-y-2.5">
                    {value.items?.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
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
