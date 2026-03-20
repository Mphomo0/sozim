import type { Metadata } from 'next'
import CTA from '@/components/global/CTA'
import Featured from '@/components/sections/home/Featured'
import Hero from '@/components/sections/home/Hero'
import SozimPrograms from '@/components/sections/home/SozimPrograms'
import Stats from '@/components/sections/home/Stats'
import { getFAQSchema, getEventSchema, getBreadcrumbSchema } from '@/lib/seo/schemas'

const BASE_URL = 'https://www.sozim.co.za'

export const metadata: Metadata = {
  title: 'Sozim Trading and Consultancy | Accredited Education & Trading Courses South Africa',
  description:
    'Sozim Trading and Consultancy offers accredited trading courses, professional training, and career-focused education programmes in South Africa. Enrol today in forex trading, stock market training, and professional development courses in Bloemfontein and online.',
  keywords: [
    'Sozim Trading and Consultancy',
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
    title: 'Sozim Trading | Accredited Trading Courses South Africa',
    description:
      'Enroll in accredited trading and professional training courses in South Africa. Expert-led education for career success.',
    url: BASE_URL,
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
      <Hero />
      <Stats />
      <Featured />
      <SozimPrograms />
      <CTA />
    </div>
  )
}
