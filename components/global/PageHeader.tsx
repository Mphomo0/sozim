import React from 'react'

interface PageHeaderProps {
  title: string
  details: string
}

export default function PageHeader({ title, details }: PageHeaderProps) {
  return (
    <section className="border-b bg-gradient-to-r from-cyan-700/10 to-teal-500/10 py-34">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mt-10">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">{title}</h1>
          <p className="max-w-3xl text-lg text-slate-500">{details}</p>
        </div>
      </div>
    </section>
  )
}
