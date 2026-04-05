import type { Metadata } from 'next'
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
  title: 'Apply Now',
  description:
    'Apply for accredited trading courses and professional training in South Africa. Start your trading career today!',
  keywords: [
    'apply Sozim',
    'enroll trading courses South Africa',
    'student application form',
    'accredited courses application',
    'trading education enrollment',
    'professional training SA',
  ],
  openGraph: {
    title: 'Apply Now | Sozim',
    description:
      'Apply for accredited trading courses and professional training in South Africa. Start your trading career!',
    url: `${BASE_URL}/apply`,
    siteName: 'Sozim',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Apply for Sozim Courses',
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
      'Yes, we accept applications from across South Africa and internationally. We offer both online and in-person learning options to accommodate students nationwide.',
  },
  {
    question: 'Is there an application fee?',
    answer:
      'No, applying to Sozim Trading and Consultancy is free. There are no application fees for any of our programmes.',
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
                Apply for Your Future
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Take the first step toward mastering the markets. Our accredited
                programmes are designed to transform your trading skills and
                career prospects.
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
                  title: 'Accredited Programmes',
                  description:
                    'Earn recognized certificates that employers trust.',
                },
                {
                  icon: Globe,
                  title: 'Online & In-Person',
                  description: 'Learn your way with flexible delivery options.',
                },
                {
                  icon: Clock,
                  title: 'Quick Enrollment',
                  description:
                    'Simple application process with fast turnaround.',
                },
                {
                  icon: Shield,
                  title: 'Trusted Education',
                  description: 'SAQA-aligned courses with expert instructors.',
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
                      'Browse our courses and select the one that matches your career goals.',
                  },
                  {
                    number: '02',
                    title: 'Submit Application',
                    description:
                      'Fill out our simple online form with your details and programme choice.',
                  },
                  {
                    number: '03',
                    title: 'Get Confirmed',
                    description:
                      'Receive confirmation and next steps within 2 business days.',
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
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join hundreds of students who have already taken the leap. Your
              future starts with a single application.
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
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>SAQA Accredited</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>QCTO Registered</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>Secure Enrollment</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>Expert Support</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
