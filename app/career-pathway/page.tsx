import type { Metadata } from 'next'
import PageHeader from '@/components/global/PageHeader'
import CareerPathwayComp from '@/components/sections/careerpathways/CareerPathwayComp'
import Breadcrumb from '@/components/global/Breadcrumb'
import { getFAQSchema, getBreadcrumbSchema, getHowToSchema } from '@/lib/seo/schemas'

const BASE_URL = 'https://www.sozim.co.za'

export const metadata: Metadata = {
  title: 'Career Pathways',
  description:
    'Navigate your professional career journey through accredited education pathways. Explore career guidance for trading, Library Science (LIS), and Education Training Development (ETD) sectors.',
  keywords: [
    'trading career pathways South Africa',
    'LIS career guidance',
    'library science careers South Africa',
    'ETD career pathways',
    'education training development careers',
    'professional trading careers SA',
  ],
  openGraph: {
    title: 'Career Pathways | Sozim',
    description:
      'Explore professional career pathways in trading, library science, and education training development.',
    url: `${BASE_URL}/career-pathway`,
    siteName: 'Sozim',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Career Pathways - Sozim',
        type: 'image/jpeg',
      },
    ],
  },
  alternates: {
    canonical: `${BASE_URL}/career-pathway`,
  },
  authors: [{ name: 'Sozim Team' }],
  other: {
    'author': 'Sozim Team',
    'published': '2026-03-28',
    'modified': '2026-03-28',
  },
}

const careerHowToSchema = getHowToSchema({
  name: 'How to Start Your Trading Career in South Africa',
  description:
    'A step-by-step guide to beginning your professional trading career through accredited education and structured professional development in South Africa.',
  steps: [
    {
      name: 'Research Trading Careers',
      text: 'Explore the different types of trading careers available in South Africa, including forex trading, stock market trading, commodities trading, and cryptocurrency. Understand the skills, qualifications, and personality traits that contribute to success in each area.',
    },
    {
      name: 'Choose an Accredited Programme',
      text: 'Select a trading education programme that is accredited in South Africa, such as those offered by Sozim Trading and Consultancy. Look for SAQA-registered qualifications or programmes that align with your career goals and provide recognised credentials.',
    },
    {
      name: 'Complete Your Trading Education',
      text: 'Enrol and complete your chosen programme, whether beginner, intermediate, or advanced. Build a solid foundation in financial markets, trading strategies, risk management, and market analysis. Take advantage of practical exercises and real-world case studies.',
    },
    {
      name: 'Develop Practical Skills',
      text: 'Practice trading with demo accounts, develop your trading plan, and refine your strategies. Many programmes include mentorship or supervised practice sessions. Focus on building discipline, emotional control, and systematic decision-making skills.',
    },
    {
      name: 'Pursue Professional Development',
      text: 'Continue learning through advanced courses, certifications, and staying updated on market developments. Consider joining professional trading associations, networking with other traders, and building your professional profile in the South African trading community.',
    },
  ],
})

const careerFAQs = [
  {
    question: 'How do I start a career in trading in South Africa?',
    answer:
      'Starting a trading career in South Africa involves researching the different trading markets, enrolling in an accredited education programme, gaining practical experience through demo trading, and pursuing continuous professional development. Sozim Trading and Consultancy offers structured career pathways that guide you from beginner to professional trader.',
  },
  {
    question: 'What qualifications do I need to become a professional trader in South Africa?',
    answer:
      'While there is no single mandatory qualification, professional traders in South Africa benefit from accredited programmes in financial markets, trading strategies, and risk management. SAQA-registered qualifications, combined with practical trading experience and strong analytical skills, are highly valued by employers and clients.',
  },
  {
    question: 'What career paths are available in Library and Information Science (LIS)?',
      answer:
        'LIS careers in South Africa include librarian, information specialist, records manager, archivist, knowledge manager, digital content curator, and research analyst. These roles are available across universities, public libraries, government departments, corporate organisations, and NGOs throughout South Africa.',
  },
  {
    question: 'What is ETD and what career opportunities does it offer?',
    answer:
      'ETD stands for Education Training and Development. Careers in ETD include training facilitator, learning designer, instructional designer, education consultant, skills development practitioner, and assessor. These roles are in demand across South African businesses, training providers, and educational institutions.',
  },
  {
    question: 'How long does it take to build a professional trading career?',
    answer:
      'The timeline varies by individual and career path. Foundation courses can be completed in 4-12 weeks, while accredited programmes may take 3-12 months. Building consistent trading skills and establishing a professional track record typically requires 1-3 years of dedicated practice and continuous learning.',
  },
  {
    question: 'Can I transition from another career into trading?',
    answer:
      'Yes, many successful traders enter the profession from diverse backgrounds including finance, engineering, IT, and other fields. Transferable skills such as analytical thinking, risk assessment, and discipline are valuable in trading. Starting with accredited beginner courses helps build the specific knowledge needed for financial markets.',
  },
  {
    question: 'Are trading careers viable in South Africa?',
    answer:
      'Absolutely. South Africa has a well-developed financial sector with opportunities for proprietary traders, institutional traders, and independent traders. The Johannesburg Stock Exchange (JSE) and forex markets offer significant opportunities. With proper education, practice, and professional development, trading can be a rewarding career path in South Africa.',
  },
]

export default function CareerPathway() {
  const faqSchema = getFAQSchema(careerFAQs)
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Career Pathways', url: `${BASE_URL}/career-pathway` },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(careerHowToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Breadcrumb />
      <PageHeader
        title="Accredited Education and Training Career Pathways"
        details="Navigate your professional journey through the LIS and ETD sectors."
      />
      <CareerPathwayComp />
    </>
  )
}
