import { BookOpen } from 'lucide-react'
import { Card } from '@/components/ui/card'

export default function Accreditation() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <BookOpen className="mx-auto mb-4 h-12 w-12 text-primary" />
          <h2 className="mb-4 text-3xl font-bold">
            Accreditation & Recognition
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Sozim Trading & Consultancy is registered with the Department of
            Higher Education and Training and accredited by relevant
            professional bodies. Our programs meet national qualifications
            framework standards, ensuring your qualification is recognized by
            employers throughout South Africa.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Card className="p-4">
              <p className="font-medium">DHET Registered</p>
            </Card>
            <Card className="p-4">
              <p className="font-medium">QCTO Accredited</p>
            </Card>
            <Card className="p-4">
              <p className="font-medium">SAQA Aligned</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
