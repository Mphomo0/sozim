import type { Metadata } from 'next'
import CampusCard from '@/components/global/CampusCard'
import PageHeader from '@/components/global/PageHeader'
import Breadcrumb from '@/components/global/Breadcrumb'
import { getFAQSchema, getBreadcrumbSchema } from '@/lib/seo/schemas'

const BASE_URL = 'https://www.sozim.co.za'

export const metadata: Metadata = {
	title: 'Campus Locations | Sozim Trading & Consultancy',
	description:
		'Visit Sozim campuses in South Africa. Our Bloemfontein campus offers face-to-face education, professional training facilities, and dedicated student support.',
  keywords: [
    'Sozim campus Bloemfontein',
    'contact learning South Africa',
    'campus education Free State',
    'in-person training South Africa',
    'student campus facilities SA',
    'Bloemfontein education institution',
  ],
	openGraph: {
		title: 'Campus Locations | Sozim',
		description:
			'Visit our Bloemfontein campus for face-to-face learning, professional training facilities, and student support.',
		url: `${BASE_URL}/campus`,
    siteName: 'Sozim',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Sozim Campus - Bloemfontein',
        type: 'image/jpeg',
      },
    ],
  },
  alternates: {
    canonical: `${BASE_URL}/campus`,
  },
}

const campusFAQs = [
  {
    question: 'Where is the Sozim campus located?',
    answer:
      'Our primary campus is located in Bloemfontein, Free State at Shop 4, Sunday School Building, 154 Charlotte Maxeke Street. We offer both contact (in-person) learning and online learning options, making our programmes accessible to students across South Africa.',
  },
  {
    question: 'What facilities are available at the Sozim campus?',
    answer:
      'Our campus features modern classrooms equipped with audio-visual technology, computer labs with internet access, study areas, and student lounge spaces. The campus provides a supportive learning environment with experienced administrative and academic staff on-site during operating hours.',
  },
  {
    question: 'Can I study online if I cannot attend campus in person?',
    answer:
      'Yes, Sozim offers comprehensive online learning options for most of our programmes. Our virtual learning environment provides the same quality curriculum as our campus-based courses, with interactive materials, online assessments, and remote instructor support. Online students have full access to academic resources and student services.',
  },
  {
    question: 'What is contact learning at Sozim?',
    answer:
      'Contact learning refers to face-to-face, in-person education at our physical campus. This model allows for direct interaction with instructors, collaborative learning with peers, and hands-on practical sessions. Contact learning is ideal for students who benefit from structured classroom environments and real-time feedback.',
  },
  {
    question: 'Are there student support services available on campus?',
    answer:
      'Yes, our campus offers a range of student support services including academic advising, career counselling, technical support, and administrative assistance. Our dedicated staff are available during campus hours to help with course-related queries, enrolment issues, and any other student needs.',
  },
  {
    question: 'Is parking available at the Sozim campus?',
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
    </>
  )
}
