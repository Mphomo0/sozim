'use client'

import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

const contactInfo = [
  {
    icon: MapPin,
    title: 'Visit Us',
    details: [
      'Shop 4',
      'Sunday School Building',
      '154 Charlotte Maxeke Street',
      'Bloemfontein',
    ],
  },
  {
    icon: Phone,
    title: 'Call Us',
    details: ['+27 72 302 3929', '+27 83 668 0104'],
  },
  {
    icon: Mail,
    title: 'Email Us',
    details: ['admin@sozim.co.za'],
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
    <section className="py-20 relative overflow-hidden bg-slate-50">
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {contactInfo.map((info, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden text-center border-slate-200/60 bg-white/80 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:shadow-blue-500/10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-8 relative z-10">
                <div className="mb-6 flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 scale-150" />
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-blue-800 text-white shadow-xl group-hover:scale-110 group-hover:from-blue-600 group-hover:to-sky-400 transition-all duration-500">
                      <info.icon className="h-8 w-8" aria-hidden="true" />
                    </div>
                  </div>
                </div>
                <h3 className="mb-4 text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors duration-300">
                  {info.title}
                </h3>
                <div className="space-y-2">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-base font-medium text-slate-600 leading-relaxed">
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
