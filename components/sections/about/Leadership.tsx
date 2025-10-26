import { Card, CardContent } from '@/components/ui/card'

const team = [
  {
    name: 'Dr. Sarah Johnson',
    role: 'Managing Director',
    image: 'SJ',
  },
  {
    name: 'Prof. Michael Chen',
    role: 'Academic Director',
    image: 'MC',
  },
  {
    name: 'Jane Williams',
    role: 'Student Affairs Manager',
    image: 'JW',
  },
  {
    name: 'Robert Brown',
    role: 'Operations Manager',
    image: 'RB',
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
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
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
