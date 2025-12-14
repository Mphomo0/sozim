import { Card, CardContent } from '@/components/ui/card'

const team = [
  {
    name: 'Dorcas Kasadi Cecily Diseko',
    role: 'Managing Director',
    image: 'DK',
  },
  {
    name: 'Mahlaga J Molepo',
    role: 'Academic Director',
    image: 'MM',
  },
  {
    name: 'Matthews Modiba',
    role: 'Student Affairs Manager',
    image: 'MJ',
  },
  {
    name: 'Rorisang Diseko',
    role: 'Student Affairs Manager',
    image: 'RD',
  },
  {
    name: 'Ohentse T Diseko',
    role: 'Operations Manager',
    image: 'OD',
  },
]

export default function Leadership() {
  return (
    <section className="bg-muted/50 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Leadership Team
          </h2>
          <p className="text-lg text-muted-foreground">
            Meet the dedicated professionals leading Sozim forward
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-5">
          {team.map((member, index) => (
            <Card
              key={index}
              className="text-center transition-all hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-2xl font-bold text-primary-foreground">
                    {member.image}
                  </div>
                </div>
                <h3 className="mb-1 text-xl font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
