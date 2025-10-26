import React from 'react'

const achievements = [
  { number: '15+', label: 'Years of Experience' },
  { number: '10,000+', label: 'Graduates' },
  { number: '98%', label: 'Student Satisfaction' },
  { number: '50+', label: 'Industry Partners' },
]

export default function Achievements() {
  return (
    <section className="border-y bg-card py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">Our Achievements</h2>
          <p className="text-lg text-muted-foreground">
            Proud milestones in our journey
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {achievements.map((achievement, index) => (
            <div key={index} className="text-center">
              <div className="mb-2 text-4xl font-bold bg-gradient-to-r from-slate-950 to-sky-700 bg-clip-text text-transparent md:text-5xl">
                {achievement.number}
              </div>
              <div className="text-sm text-muted-foreground md:text-base">
                {achievement.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
