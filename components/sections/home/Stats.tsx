const stats = [
  { number: '5000+', label: 'Students Enrolled' },
  { number: '50+', label: 'Expert Instructors' },
  { number: '20+', label: 'Programs Offered' },
  { number: '95%', label: 'Success Rate' },
]

export default function Stats() {
  return (
    <section className="border-y bg-card py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="mb-2 text-4xl font-bold bg-gradient-to-r from-slate-950 to-sky-700 bg-clip-text text-transparent">
                {stat.number}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
