'use client'

import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

const contactInfo = [
  {
    icon: MapPin,
    title: 'Visit Us',
    details: ['123 Education Street', 'Johannesburg, 2000', 'South Africa'],
  },
  {
    icon: Phone,
    title: 'Call Us',
    details: ['+27 72 302 3929', '+27 83 668 0104'],
  },
  {
    icon: Mail,
    title: 'Email Us',
    details: [
      'info@sozim.co.za',
      'admissions@sozim.co.za',
      'support@sozim.co.za',
    ],
  },
  {
    icon: Clock,
    title: 'Office Hours',
    details: [
      'Monday - Friday: 8:00 AM - 5:00 PM',
      'Saturday: 9:00 AM - 1:00 PM',
      'Sunday: Closed',
    ],
  },
]

export default function ContactsInfoCard() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {contactInfo.map((info, index) => (
            <Card
              key={index}
              className="text-center transition-all hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-slate-950 to-sky-700">
                    <info.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>
                <h3 className="mb-3 text-lg font-semibold">{info.title}</h3>
                <div className="space-y-1">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-sm text-muted-foreground">
                      {detail}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
