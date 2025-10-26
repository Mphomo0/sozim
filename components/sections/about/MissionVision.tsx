import { Card, CardContent } from '@/components/ui/card'
import { Eye, Target } from 'lucide-react'

export default function MissionVision() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="border-2 hover:shadow-xl transition-all">
            <CardContent className="p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-slate-950 to-sky-700">
                <Target className="h-6 w-6 text-primary-foreground" />
              </div>
              <h2 className="mb-4 text-2xl font-bold">Our Mission</h2>
              <p className="text-muted-foreground">
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

          <Card className="border-2 hover:shadow-xl transition-all">
            <CardContent className="p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-slate-950 to-sky-700">
                <Eye className="h-6 w-6 text-primary-foreground" />
              </div>
              <h2 className="mb-4 text-2xl font-bold">Our Vision</h2>
              <p className="text-muted-foreground">
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
