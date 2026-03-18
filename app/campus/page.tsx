import type { Metadata } from 'next'
import CampusCard from '@/components/global/CampusCard'
import PageHeader from '@/components/global/PageHeader'
import FAQSection from '@/components/global/FAQSection'
import Breadcrumb from '@/components/global/Breadcrumb'
import { getFAQSchema, getBreadcrumbSchema } from '@/lib/seo/schemas'

const BASE_URL = 'https://www.sozim.co.za'

export const metadata: Metadata = {
  title: 'Our Contact Learning Campuses | Sozim Trading and Consultancy',
  description:
    'Visit Sozim Trading and Consultancy campuses in South Africa. Our contact learning campuses offer face-to-face education, professional training facilities, and dedicated student support in Bloemfontein and surrounding areas.',
  keywords: [
    'Sozim campus Bloemfontein',
    'contact learning South Africa',
    'campus education Free State',
    'in-person training South Africa',
    'student campus facilities SA',
    'trading education campus',
    'Bloemfontein education institution',
  ],
  openGraph: {
    title: 'Our Contact Learning Campuses | Sozim',
    description:
      'Visit our campuses across South Africa for face-to-face learning, professional training, and dedicated student support.',
    url: `${BASE_URL}/campus`,
  },
  alternates: {
    canonical: `${BASE_URL}/campus`,
  },
}

const campusFAQs = [
  {
    question: 'Where are Sozim Trading campuses located?',
    answer:
      'Our primary campus is located in Bloemfontein, Free State, South Africa, at Shop 4, Sunday School Building, 154 Charlotte Maxeke Street. We offer both contact (in-person) learning and online learning options, making our programmes accessible to students across South Africa and beyond.',
  },
  {
    question: 'What facilities are available at Sozim campuses?',
    answer:
      'Our contact learning campuses feature modern classrooms equipped with audio-visual technology, computer labs with internet access, study areas, and student lounge spaces. Each campus provides a supportive learning environment with experienced administrative and academic staff on-site during operating hours.',
  },
  {
    question: 'Can I study online if I cannot attend campus in person?',
    answer:
      'Yes, Sozim offers comprehensive online learning options for most of our programmes. Our virtual learning environment provides the same quality curriculum as our campus-based courses, with interactive materials, online assessments, and remote instructor support. Online students have full access to academic resources and student services.',
  },
  {
    question: 'What is contact learning at Sozim?',
    answer:
      'Contact learning refers to face-to-face, in-person education at our physical campus locations. This model allows for direct interaction with instructors, collaborative learning with peers, and hands-on practical sessions. Contact learning is ideal for students who benefit from structured classroom environments and real-time feedback.',
  },
  {
    question: 'Are there student support services available on campus?',
    answer:
      'Yes, our campuses offer a range of student support services including academic advising, career counselling, technical support, and administrative assistance. Our dedicated staff are available during campus hours to help with course-related queries, enrolment issues, and any other student needs.',
  },
  {
    question: 'Is parking available at Sozim campuses?',
    answer:
      'Our Bloemfontein campus is located in the city centre with access to public parking facilities nearby. We recommend contacting our campus directly for specific parking arrangements and accessibility information. Public transport options are also available within walking distance of the campus.',
  },
]

export default function CampusPage() {
  const faqSchema = getFAQSchema(campusFAQs)
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Our Campus', url: `${BASE_URL}/campus` },
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
      <PageHeader
        title="Contact Learning Campus"
        details="Our Contact Learning Campuses offer a range of opportunities to enhance your skills and knowledge."
      />
      <CampusCard />
      <FAQSection
        title="Frequently Asked Questions About Our Campuses"
        faqs={campusFAQs}
      />
    </>
  )
}
