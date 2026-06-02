import type { Metadata } from 'next'

export const revalidate = 3600

import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Globe,
  Clock,
  Shield,
} from 'lucide-react'
import Link from 'next/link'
import Breadcrumb from '@/components/global/Breadcrumb'
import { getFAQSchema, getBreadcrumbSchema } from '@/lib/seo/schemas'

const BASE_URL = 'https://www.sozim.co.za'

export const metadata: Metadata = {
  title: 'Apply for Accredited LIS and ETD Programmes | Sozim',
  description:
    'Apply online for ETDP SETA accredited programmes in Library and Information Science (LIS) and Education Training and Development (ETD) at Sozim in Bloemfontein. No application fee. Intakes in January, April, July, and October.',
  keywords: [
    'apply Sozim',
    'enrol LIS course South Africa',
    'ETD programme application',
    'student application accredited college',
    'library assistant application Bloemfontein',
    'education training development course application',
    'ETDP SETA accredited course apply',
    'accredited college application Bloemfontein',
  ],
  openGraph: {
    title: 'Apply for Accredited LIS and ETD Programmes | Sozim',
    description:
      'Apply online for ETDP SETA accredited LIS and ETD programmes at Sozim in Bloemfontein. No application fee. Four intakes per year.',
    url: `${BASE_URL}/apply`,
    siteName: 'Sozim',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Apply for Sozim Accredited Education Programmes',
        type: 'image/jpeg',
      },
    ],
  },
  alternates: {
    canonical: `${BASE_URL}/apply`,
  },
}

const applyFAQs = [
  {
    question: 'What documents do I need to apply?',
    answer:
      'You will need a valid ID/passport, proof of address, and any relevant educational certificates. Our admissions team will guide you through the required documents during the application process.',
  },
  {
    question: 'How long does the application process take?',
    answer:
      'Most applications are processed within 5-7 business days. You will receive confirmation and next steps via email once your application is reviewed.',
  },
  {
    question: 'Can I apply if I am based outside Bloemfontein?',
    answer:
      'Yes, we accept applications from across South Africa. We offer both online and in-person learning options to accommodate students nationwide.',
  },
  {
    question: 'Is there an application fee?',
    answer:
      'No, applying to Sozim is free. There are no application fees for any of our programmes.',
  },
]

export default function ApplyPage() {
  const faqSchema = getFAQSchema(applyFAQs)
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Apply Now', url: `${BASE_URL}/apply` },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Breadcrumb />
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100">
        <section className="relative py-20 lg:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-blue-900/10 to-transparent" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6">
                Start Your Academic Journey at Sozim
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Apply online for ETDP SETA accredited programmes in Library and
                Information Science (LIS) and Education Training and Development
                (ETD). Study contact or online. Intakes run four times a year.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  asChild
                  className="text-lg h-14 px-8 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/25"
                >
                  <Link href="/student">
                    Start Application <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="text-lg h-14 px-8 rounded-full border-slate-300 hover:bg-slate-100"
                >
                  <Link href="/courses">View Courses</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {[
                {
                  icon: GraduationCap,
                  title: 'ETDP SETA Accredited',
                  description:
                    'Earn certificates recognised by South African employers, SETAs, and institutions.',
                },
                {
                  icon: Globe,
                  title: 'Online & In-Person',
                  description:
                    'Study at the Bloemfontein campus or fully online from anywhere in South Africa.',
                },
                {
                  icon: Clock,
                  title: 'Four Intakes Per Year',
                  description:
                    'January, April, July, and October — apply year-round, no deadline pressure.',
                },
                {
                  icon: Shield,
                  title: 'No Application Fee',
                  description:
                    'Applying to Sozim is completely free. Contact us to start your journey.',
                },
              ].map((benefit, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-12">
                How to Apply
              </h2>
              <div className="space-y-8">
                {[
                  {
                    number: '01',
                    title: 'Choose Your Programme',
                    description:
                      'Browse our LIS and ETD courses at sozim.co.za/courses and select the one that matches your career goals and NQF level.',
                  },
                  {
                    number: '02',
                    title: 'Submit Your Application',
                    description:
                      'Complete the online application form with your personal details, chosen programme, and preferred study mode (contact or online).',
                  },
                  {
                    number: '03',
                    title: 'Receive Your Confirmation',
                    description:
                      'Applications are reviewed within 5–7 business days. You will receive confirmation and enrolment instructions by email.',
                  },
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-6">
                    <div className="shrink-0 w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {step.number}
                      </span>
                    </div>
                    <div className="pt-2">
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-slate-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-linear-to-br from-blue-900 to-blue-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Enrol in an Accredited Programme?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join 5,000+ graduates who have advanced their careers with
              Sozim's accredited LIS and ETD qualifications.
            </p>
            <Button
              size="lg"
              asChild
              className="text-lg h-14 px-10 rounded-full bg-white text-blue-900 hover:bg-blue-50 shadow-xl"
            >
              <Link href="/student">
                Apply Now <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="py-12 bg-slate-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
              {[
                { label: 'ETDP SETA Accredited' },
                { label: 'QCTO Registered' },
                { label: 'SAQA Aligned' },
                { label: 'Free Application' },
              ].map(({ label }) => (
                <div key={label} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
