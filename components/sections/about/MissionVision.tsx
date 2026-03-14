import { Card, CardContent } from '@/components/ui/card'
import { Eye, Target } from 'lucide-react'

export default function MissionVision() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 md:grid-cols-2">
          <Card className="group relative border border-slate-200/60 bg-white/70 backdrop-blur-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardContent className="p-10 relative z-10">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-900 to-sky-700 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-slate-900">Our Mission</h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Our mission at Sozim Trading and Consultancy is to deliver
                tailored training program that empowers organizations to foster
                safe workplaces and meet compliance standards. We are dedicated
                to providing engaging and effective training solutions,
                utilizing interactive methods and industry best practices. By
                focusing on customer satisfaction and measurable outcomes, we
                seek to raise the bar in the Teaching and Learning sector.
              </p>
            </CardContent>
          </Card>

          <Card className="group relative border border-slate-200/60 bg-white/70 backdrop-blur-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-50/50 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardContent className="p-10 relative z-10">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600 to-sky-400 shadow-lg shadow-sky-500/30 group-hover:scale-110 transition-transform duration-500">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-slate-900">Our Vision</h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                At Sozim Trading and Consultancy, our vision is to create a
                literate tomorrow through exceptional library and information
                training. We envision a world where every workplace prioritizes
                information literacy and literacy, leading to significant
                reductions in illiteracy and enhanced cognitive abilities of
                young minds.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
