import React from 'react'

interface PageHeaderProps {
  title: string
  details: string
}

export default function PageHeader({ title, details }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b border-blue-100 bg-gradient-to-br from-blue-50 via-white to-sky-50 py-32 pt-40">
      {/* Decorative background vectors */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-80 w-80 rounded-full bg-sky-200/30 blur-3xl pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight md:text-6xl lg:text-7xl text-slate-900 drop-shadow-sm">
            {title}
          </h1>
          <p className="max-w-3xl text-xl text-slate-600 font-light leading-relaxed">
            {details}
          </p>
        </div>
      </div>
    </section>
  )
}
