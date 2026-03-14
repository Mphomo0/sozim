const stats = [
  { number: '5000+', label: 'Students Enrolled' },
  { number: '50+', label: 'Expert Instructors' },
  { number: '20+', label: 'Programs Offered' },
  { number: '95%', label: 'Success Rate' },
]

export default function Stats() {
  return (
    <section className="relative overflow-hidden border-y border-slate-200/50 bg-slate-50/50 py-16">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-100/40 via-transparent to-blue-100/40 pointer-events-none" />
      <div className="container relative z-10 mx-auto px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="mb-2 text-5xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-blue-800 to-sky-600 bg-clip-text text-transparent drop-shadow-sm group-hover:scale-110 transition-transform duration-300">
                {stat.number}
              </div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
