import React from 'react'

export default function OurStory() {
  return (
    <section className="py-28 relative overflow-hidden bg-white">
      <div className="absolute top-0 right-0 h-[600px] w-[600px] -translate-y-1/2 translate-x-1/3 rounded-full bg-blue-50/50 blur-[100px] pointer-events-none" />
      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-4xl relative">
          <div className="absolute -top-12 -left-12 text-[150px] text-blue-500/10 font-serif leading-none selct-none pointer-events-none">
            "
          </div>
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
              Our Story
            </h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-blue-600 to-sky-400 mx-auto rounded-full" />
          </div>
          <div className="space-y-8 text-lg md:text-xl font-light leading-relaxed text-slate-600 relative z-10">
            <p className="first-letter:text-6xl first-letter:font-bold first-letter:text-blue-700 first-letter:mr-3 first-letter:float-left">
              Founded in 2009, Sozim Trading & Consultancy began with a simple
              but powerful vision: to make quality education accessible to all
              South Africans. What started as a small training center has grown
              into a respected institution serving thousands of students across
              multiple provinces.
            </p>
            <p>
              Our founders, driven by their passion for education and community
              development, recognized the critical need for practical,
              industry-relevant training programs. They understood that
              traditional education often failed to equip students with the
              skills needed in today&lsquo;s rapidly evolving job market.
            </p>
            <div className="p-8 my-8 rounded-2xl bg-gradient-to-br from-blue-900 to-sky-800 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://ik.imagekit.io/vzofqg2fg/images/abstract-bg.jpg')] bg-cover opacity-10 mix-blend-overlay group-hover:scale-105 transition-transform duration-700" />
              <p className="relative z-10 text-xl md:text-2xl font-medium leading-relaxed italic border-l-4 border-sky-400 pl-6">
                Over the years, we&lsquo;ve developed strong partnerships with
                leading businesses and industry experts to ensure our curriculum
                remains current and our graduates are job-ready.
              </p>
            </div>
            <p>
              Today, Sozim continues to innovate and expand, introducing new
              programs, embracing technology, and adapting to the changing needs
              of students and employers. Our success is measured not just in
              numbers, but in the lives we&lsquo;ve transformed and the careers
              we&lsquo;ve launched.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
