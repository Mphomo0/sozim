import type { Metadata } from 'next'
import CTA from '@/components/global/CTA'
import Featured from '@/components/sections/home/Featured'
import Hero from '@/components/sections/home/Hero'
import SozimPrograms from '@/components/sections/home/SozimPrograms'
import Stats from '@/components/sections/home/Stats'
import {
  getFAQSchema,
  getEventSchema,
  getBreadcrumbSchema,
  getWebPageSchema,
  getAggregateRatingSchema,
  getSpeakableSchema,
} from '@/lib/seo/schemas'

const BASE_URL = 'https://www.sozim.co.za'

export const metadata: Metadata = {
  title:
    'Sozim | Accredited Education and Training College in Bloemfontein, South Africa',
description:
      'Accredited education and training college in Bloemfontein. Enrol in accredited programmes in LIS and ETD.',
  authors: [{ name: 'Sozim Team' }],
  other: {
    author: 'Sozim Team',
    published: '2026-03-28',
    modified: '2026-03-28',
  },
  keywords: [
    'Accredited Education and Training Programmes',
    'training courses South Africa',
    'accredited education Bloemfontein',
    'training college Bloemfontein',
    'professional training Bloemfontein',
    'skills development Bloemfontein',
    'career development courses',
    'online education Bloemfontein',
    'accredited college Bloemfontein',
  ],
  openGraph: {
    title:
      'Sozim | Accredited Education and Training College in Bloemfontein, South Africa',
    description:
      'Accredited education and training college in Bloemfontein, South Africa. Enrol for training courses and professional training.',
    url: BASE_URL,
    siteName: 'Sozim',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Sozim - Accredited Education and Training College in Bloemfontein',
        type: 'image/jpeg',
      },
    ],
  },
  alternates: {
    canonical: BASE_URL,
  },
}

const eventSchema = getEventSchema()

const homepageFAQs = [
  {
    question: 'What courses does Sozim offer?',
    answer:
      'Sozim offers accredited programmes in Library and Information Science (LIS), Education Training and Development (ETD), and professional skills courses. Our courses include Library Assistant, Learning and Development Facilitator, Assessment Practitioner, and professional development programmes ranging from beginner to advanced levels.',
  },
  {
    question: 'Is Sozim Accredited?',
    answer:
      'Yes, Sozim is an accredited education provider in Bloemfontein. Our programmes are ETDP SETA accredited and QCTO registered, designed to meet South African Qualifications Authority (SAQA) standards, ensuring our students receive recognised and valuable credentials.',
  },
  {
    question: 'How do I enrol in a Sozim course?',
    answer:
      'To enrol, you can submit an enquiry through our website, call us on (+27) 83 668 0104, or visit our campus in Bloemfontein. Our admissions team will guide you through the application process, discuss programme options, and help you select the course that best matches your career goals.',
  },
  {
    question: 'Where is Sozim located?',
    answer:
      'Our main campus is located at Shop 4, Sunday School Building, 154 Charlotte Maxeke Street, Bloemfontein, Free State, 9301. We also offer online learning options, making our programmes accessible to students across South Africa.',
  },
  {
    question: 'Do you offer online courses?',
    answer:
      'Yes, we offer online learning options for most of our programmes. Our virtual learning environment provides comprehensive curriculum, interactive materials, online assessments, and instructor support. Online students enjoy the same quality education as our in-person learners with maximum flexibility.',
  },
  {
    question: 'How much do courses cost at Sozim?',
    answer:
      'Course fees vary depending on the programme length, accreditation level, and delivery format. We offer competitive pricing for South African students and provide payment plan options for certain courses. Contact our admissions team for detailed fee structures.',
  },
]

export default function Home() {
  const faqSchema = getFAQSchema(homepageFAQs)
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
  ])
  const webPageSchema = getWebPageSchema({
    name: 'Sozim | Accredited Education and Training College in Bloemfontein',
    description:
      'Accredited education and training college in Bloemfontein, South Africa. Enrol for training courses and professional training.',
    url: BASE_URL,
    speakable: ['h1', 'h2', 'p'],
    breadcrumb: [{ name: 'Home', url: BASE_URL }],
  })
  const aggregateRatingSchema = getAggregateRatingSchema({
    ratingValue: '4.8',
    reviewCount: '127',
  })
  const speakableSchema = getSpeakableSchema({
    headline: 'Accredited Education and Training College in Bloemfontein',
    speakableText: ['h1', 'h2', 'p'],
  })

  return (
    <div className="mb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aggregateRatingSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }}
      />
      <Hero />
      <Stats />
      <Featured />
      <SozimPrograms />
      <CTA />
    </div>
  )
}
