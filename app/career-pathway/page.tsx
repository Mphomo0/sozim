import type { Metadata } from 'next'
import PageHeader from '@/components/global/PageHeader'
import CareerPathwayComp from '@/components/sections/careerpathways/CareerPathwayComp'
import Breadcrumb from '@/components/global/Breadcrumb'
import {
  getFAQSchema,
  getBreadcrumbSchema,
  getHowToSchema,
} from '@/lib/seo/schemas'

const BASE_URL = 'https://www.sozim.co.za'

export const metadata: Metadata = {
  title: 'Career Pathways | Accredited Education and Training College in Bloemfontein',
  description:
    'Explore accredited career pathways in LIS and ETD. Professional guidance for your South African career journey.',
  keywords: [
    'career pathways South Africa',
    'LIS career guidance',
    'library science careers',
    'ETD career pathways',
    'education training development careers',
    'accredited courses Bloemfontein',
  ],
  openGraph: {
    title: 'Career Pathways | Sozim - Accredited Education and Training College',
    description:
      'Explore accredited career pathways in LIS and ETD in South Africa.',
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
    author: 'Sozim Team',
    published: '2026-03-28',
    modified: '2026-03-28',
  },
}

const careerHowToSchema = getHowToSchema({
  name: 'How to Start Your Trading Career in South Africa',
  description:
    'A step-by-step guide to beginning your professional trading career through accredited education and structured professional development in South Africa.',
  steps: [
    {
      name: 'Research Training Careers',
      text: 'Explore the different types of training careers available in South Africa, including library Assistant, Learning and Development Facilitator, Assessment Practioner. Understand the skills, qualifications, and personality traits that contribute to success in each area.',
    },
    {
      name: 'Choose an Accredited Programme',
      text: 'Select a training education programme that is accredited in South Africa, such as those offered by Sozim Trading and Consultancy. Look for SAQA-registered qualifications or programmes that align with your career goals and provide recognised credentials.',
    },
    {
      name: 'Complete Your Training Education',
      text: 'Enrol and complete your chosen programme, whether beginner, intermediate, or advanced. Build a solid foundation in financial markets, trading strategies, risk management, and market analysis. Take advantage of practical exercises and real-world case studies.',
    },
    {
      name: 'Develop Practical Skills',
      text: 'Practice training with demo accounts, develop your training plan, and refine your strategies. Many programmes include mentorship or supervised practice sessions. Focus on building discipline, emotional control, and systematic decision-making skills.',
    },
    {
      name: 'Pursue Professional Development',
      text: 'Continue learning through advanced courses, certifications, and staying updated on market developments. Consider joining professional training associations, networking with other trainers, and building your professional profile in the South African training community.',
    },
  ],
})

const careerFAQs = [
  {
    question: 'How do I start a career in Education and Training in South Africa?',
    answer:
      'Starting a career in Education Training and Development (ETD) involves enrolling in an accredited programme, gaining practical experience through facilitation, and pursuing continuous professional development. Sozim offers structured career pathways that guide you from beginner to qualified professional.',
  },
  {
    question:
      'What qualifications do I need to become a learning facilitator in South Africa?',
    answer:
      'While there is no single mandatory qualification, learning facilitators in South Africa benefit from accredited programmes in education, training, and development. SAQA-registered qualifications, combined with practical facilitation experience and strong instructional skills, are highly valued by employers.',
  },
  {
    question:
      'What career paths are available in Library and Information Science (LIS)?',
    answer:
      'LIS careers include librarian, information specialist, records manager, archivist, knowledge manager, digital content curator, and research analyst. These roles are available across universities, public libraries, government departments, corporate organisations, and NGOs throughout South Africa.',
  },
  {
    question: 'What is ETD and what career opportunities does it offer?',
    answer:
      'ETD stands for Education Training and Development. Careers in ETD include learning facilitator, learning designer, instructional designer, education consultant, skills development practitioner, and assessor. These roles are in demand across South African businesses, training providers, and educational institutions.',
  },
  {
    question: 'How long does it take to build a professional ETD career?',
    answer:
      'The timeline varies by individual and career path. Foundation courses can be completed in 4-12 weeks, while accredited programmes may take 3-12 months. Building consistent facilitation skills and establishing a professional track record typically requires 1-3 years of dedicated practice and continuous learning.',
  },
  {
    question: 'Can I transition from another career into ETD?',
    answer:
      'Yes, many successful learning facilitators enter the profession from diverse backgrounds including business, IT, education, and other fields. Transferable skills such as communication, planning, and mentoring are valuable in education. Starting with accredited beginner courses helps build the specific knowledge needed for educational settings.',
  },
  {
    question: 'Are ETD and LIS careers viable in South Africa?',
    answer:
      'Absolutely. South Africa has a growing demand for education and training professionals. ETD careers are in demand across businesses, training providers, and educational institutions. LIS professionals are needed in universities, public libraries, government departments, and corporate organisations. With SAQA-registered qualifications from accredited providers like Sozim, graduates can pursue roles as Learning and Development Facilitators, Assessors, Instructional Designers, Librarians, and Records Managers throughout South Africa.',
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
