import React from 'react'

const achievements = [
  { number: '18+', label: 'Years of Experience' },
  { number: '10+', label: 'Graduates' },
  { number: '100%', label: 'Student Satisfaction' },
  { number: '50+', label: 'Industry Partners' },
]

export default function Achievements() {
  return (
    <section className="relative border-y border-slate-200/50 bg-slate-900 py-24 overflow-hidden">
      {/* Decorative background overlay */}
      <div className="absolute inset-0 bg-[url('https://ik.imagekit.io/vzofqg2fg/images/abstract-bg.jpg')] bg-cover bg-center opacity-10 mix-blend-overlay" />
      <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-900/90 to-slate-900" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mb-16 text-center text-white">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight md:text-5xl">
            Our Achievements
          </h2>
          <p className="text-xl font-light text-slate-300">
            Proud milestones in our journey to excellence
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="text-center group p-6 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/10 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="mb-3 text-5xl font-extrabold tracking-tight bg-linear-to-r from-sky-300 to-blue-500 bg-clip-text text-transparent md:text-6xl drop-shadow-md group-hover:scale-105 transition-transform duration-300">
                {achievement.number}
              </div>
              <div className="text-sm font-medium uppercase tracking-wider text-slate-300 md:text-base group-hover:text-white transition-colors duration-300">
                {achievement.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
