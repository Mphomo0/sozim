import { Card, CardContent } from '@/components/ui/card'

const team = [
  {
    name: 'Dorcas Kasadi Cecily Diseko',
    role: 'Managing Director',
    image: 'DK',
    credentials: 'MBA, 15+ years',
  },
  {
    name: 'Mahlaga J Molepo',
    role: 'Academic Director',
    image: 'MM',
    credentials: 'M.Ed, 12+ years',
  },
  {
    name: 'Matthews Modiba',
    role: 'Student Affairs Manager',
    image: 'MJ',
    credentials: 'B.Psych, 8+ years',
  },
  {
    name: 'Rorisang Diseko',
    role: 'Student Affairs Manager',
    image: 'RD',
    credentials: 'Dip.SW, 6+ years',
  },
  {
    name: 'Ohentse T Diseko',
    role: 'Operations Manager',
    image: 'OD',
    credentials: 'BCom, 10+ years',
  },
]

export default function Leadership() {
  return (
    <section className="bg-slate-50 py-24 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="container relative z-10 mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight md:text-5xl text-slate-900">
            Leadership Team
          </h2>
          <p className="text-xl font-light text-muted-foreground">
            Meet the dedicated professionals leading Sozim forward
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-5">
          {team.map((member, index) => (
            <Card
              key={index}
              className="group text-center border-slate-200/60 bg-white/80 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:shadow-blue-500/10 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-8 relative z-10">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-slate-900 to-blue-800 text-3xl font-extrabold tracking-tight text-white shadow-lg shadow-blue-900/20 group-hover:scale-110 transition-transform duration-500 group-hover:from-blue-600 group-hover:to-sky-400">
                    {member.image}
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors duration-300">
                  {member.name}
                </h3>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{member.role}</p>
                <p className="text-xs text-slate-400 mt-2">{member.credentials}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
