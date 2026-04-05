import type { Metadata } from 'next'
import CTA from '@/components/global/CTA'
import Featured from '@/components/sections/home/Featured'
import Hero from '@/components/sections/home/Hero'
import SozimPrograms from '@/components/sections/home/SozimPrograms'
import Stats from '@/components/sections/home/Stats'
import { getFAQSchema, getEventSchema, getBreadcrumbSchema, getWebPageSchema, getAggregateRatingSchema, getSpeakableSchema } from '@/lib/seo/schemas'

const BASE_URL = 'https://www.sozim.co.za'

export const metadata: Metadata = {
  title: 'Sozim | Accredited Education & Trading Courses South Africa',
	description:
		'Accredited trading courses and professional training in South Africa. Enrol for forex, stock market, and career development courses in Bloemfontein or online.',
  authors: [{ name: 'Sozim Team' }],
  other: {
    'author': 'Sozim Team',
    'published': '2026-03-28',
    'modified': '2026-03-28',
  },
  keywords: [
    'Sozim Trading',
    'trading courses South Africa',
    'accredited education South Africa',
    'forex trading courses SA',
    'professional training Bloemfontein',
    'stock market education',
    'skills development South Africa',
    'trading for beginners',
    'online trading education SA',
    'career development courses',
  ],
	openGraph: {
		title: 'Sozim | Accredited Trading Courses South Africa',
		description:
			'Enrol in accredited trading and professional training courses in South Africa. Expert-led education in Bloemfontein and online.',
		url: BASE_URL,
    siteName: 'Sozim',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Sozim - Accredited Education and Trading Courses South Africa',
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
    question: 'What courses does Sozim Trading and Consultancy offer?',
    answer:
      'Sozim Trading and Consultancy offers a range of accredited programmes including forex trading courses, stock market training, financial market education, professional development programmes, and Library and Information Science (LIS) courses. Our programmes range from beginner to advanced levels and are available both in-person and online.',
  },
  {
    question: 'Is Sozim Trading and Consultancy accredited?',
    answer:
      'Yes, Sozim Trading and Consultancy is an accredited education provider in South Africa. Our programmes are designed to meet South African Qualifications Authority (SAQA) standards, ensuring our students receive recognised and valuable credentials. We are committed to providing quality education that meets national standards.',
  },
  {
    question: 'How do I enrol in a Sozim course?',
    answer:
      'To enrol, you can submit an enquiry through our website, call us on (+27) 83 668 0104, or visit our campus in Bloemfontein. Our admissions team will guide you through the application process, discuss programme options, and help you select the course that best matches your career goals.',
  },
  {
    question: 'Where is Sozim Trading and Consultancy located?',
    answer:
      'Our main campus is located at Shop 4, Sunday School Building, 154 Charlotte Maxeke Street, Bloemfontein, Free State, 9301, South Africa. We also offer online learning options, making our programmes accessible to students across South Africa.',
  },
  {
    question: 'Do you offer online courses?',
    answer:
      'Yes, we offer online learning options for most of our programmes. Our virtual learning environment provides comprehensive curriculum, interactive materials, online assessments, and instructor support. Online students enjoy the same quality education as our in-person learners with maximum flexibility.',
  },
  {
    question: 'How much does trading education cost at Sozim?',
    answer:
      'Course fees vary depending on the programme length, accreditation level, and delivery format. We offer competitive pricing for South African students and provide payment plan options for certain courses. Contact our admissions team for detailed fee structures and available financial assistance options.',
  },
]

export default function Home() {
  const faqSchema = getFAQSchema(homepageFAQs)
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
  ])
  const webPageSchema = getWebPageSchema({
    name: 'Sozim | Accredited Education & Trading Courses South Africa',
    description: 'Sozim offers accredited trading courses and professional training in South Africa. Enrol for forex, stock market, and career development courses in Bloemfontein or online.',
    url: BASE_URL,
    speakable: ['h1', 'h2', 'p'],
    breadcrumb: [{ name: 'Home', url: BASE_URL }],
  })
  const aggregateRatingSchema = getAggregateRatingSchema({
    ratingValue: '4.8',
    reviewCount: '127',
  })
  const speakableSchema = getSpeakableSchema({
    headline: 'Accredited Trading Courses South Africa',
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateRatingSchema) }}
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
