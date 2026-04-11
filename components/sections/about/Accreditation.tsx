import { BookOpen } from 'lucide-react'
import { Card } from '@/components/ui/card'

export default function Accreditation() {
  return (
    <section className="py-24 relative overflow-hidden bg-slate-50">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-1/4 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-slate-900 to-blue-800 shadow-xl shadow-blue-900/20 text-white">
            <BookOpen className="h-10 w-10" />
          </div>
          <h2 className="mb-6 text-4xl md:text-5xl font-extrabold tracking-tight bg-linear-to-r from-slate-900 via-blue-800 to-sky-700 bg-clip-text text-transparent">
            Accreditation & Recognition
          </h2>
          <p className="mb-12 text-lg md:text-xl font-light leading-relaxed text-muted-foreground">
            Sozim Trading & Consultancy is registered with the Department of
            Higher Education and Training and accredited by relevant
            professional bodies. Our programs meet national qualifications
            framework standards, ensuring your qualification is recognized by
            employers throughout South Africa.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Card className="px-8 py-6 flex items-center justify-center border border-white bg-white/80 backdrop-blur-xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 rounded-2xl">
              <p className="font-semibold text-lg text-slate-800 tracking-wide uppercase">
                QCTO Accredited
              </p>
            </Card>
            <Card className="px-8 py-6 flex items-center justify-center border border-white bg-white/80 backdrop-blur-xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 rounded-2xl">
              <p className="font-semibold text-lg text-slate-800 tracking-wide uppercase">
                SAQA Aligned
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
