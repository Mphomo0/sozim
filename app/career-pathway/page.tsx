import type { Metadata } from 'next'

export const revalidate = 86400

import PageHeader from '@/components/global/PageHeader'
import CareerPathwayComp from '@/components/sections/careerpathways/CareerPathwayComp'
import Breadcrumb from '@/components/global/Breadcrumb'
import {
  getFAQSchema,
  getBreadcrumbSchema,
  getHowToSchema,
  getWebPageSchema,
} from '@/lib/seo/schemas'

const BASE_URL = 'https://www.sozim.co.za'

export const metadata: Metadata = {
  title: 'Career Pathways in LIS & ETD – Bloemfontein',
  description:
    'Explore LIS and ETD career pathways at Sozim Bloemfontein. From Library Assistant to Assessor and Moderator — accredited routes for South African professionals.',
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
  twitter: {
    card: 'summary_large_image',
    title: 'Career Pathways in LIS & ETD | Sozim',
    description: 'Explore accredited LIS and ETD career pathways in South Africa.',
    images: ['/og-image.jpg'],
    site: '@sozimtrading',
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
  name: 'How to Start a Career in Education and Training or Library Science in South Africa',
  description:
    'A step-by-step guide to beginning a professional career in Education Training and Development (ETD) or Library and Information Science (LIS) through accredited education and structured professional development in South Africa.',
  steps: [
    {
      name: 'Research ETD and LIS Careers',
      text: 'Explore career options in Education Training and Development (ETD) and Library and Information Science (LIS). ETD roles include learning facilitator, assessor, moderator, and instructional designer. LIS roles include library assistant, information specialist, records manager, and archivist. These roles are in demand across South African businesses, universities, government departments, and public libraries.',
    },
    {
      name: 'Choose an Accredited Programme',
      text: 'Select a SAQA-registered programme aligned to your career goals. Sozim offers LIS programmes at NQF Level 3 (Library Assistant) and ETD programmes at NQF Level 5 (Learning and Development Facilitator, Assessment Practitioner) and NQF Level 6 (Assessor and Moderator). Both online and contact learning options are available at sozim.co.za/courses.',
    },
    {
      name: 'Complete Your Training',
      text: 'Enrol and complete your chosen Sozim programme. LIS programmes run approximately 4–6 months. ETD facilitation and assessment programmes run 3–6 months. Attend contact sessions at the Bloemfontein campus or complete coursework fully online with facilitator support.',
    },
    {
      name: 'Gain Practical Experience',
      text: 'Apply your facilitation, assessment, or library skills in a real workplace setting. ETD programmes include work-integrated learning components and portfolio-of-evidence requirements for ETDP SETA submission. Practical experience accelerates career progression and strengthens your professional profile.',
    },
    {
      name: 'Pursue Continuous Professional Development',
      text: 'Advance to higher NQF levels, pursue SETA registration as an assessor or moderator, or move into instructional design and skills development management. Sozim\'s career pathways section outlines progression routes for each discipline from beginner to senior practitioner.',
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
  const webPageSchema = getWebPageSchema({
    name: 'Career Pathways in LIS & ETD | Sozim Bloemfontein',
    description:
      'Explore LIS and ETD career pathways at Sozim Bloemfontein. From Library Assistant to Assessor and Moderator — accredited routes for South African professionals.',
    url: `${BASE_URL}/career-pathway`,
    speakable: ['h1', 'h2', 'p'],
    breadcrumb: [
      { name: 'Home', url: BASE_URL },
      { name: 'Career Pathways', url: `${BASE_URL}/career-pathway` },
    ],
  })

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
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
