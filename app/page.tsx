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
  getDefinedTermSchema,
} from '@/lib/seo/schemas'
import { getCachedCourses, getCachedCategories } from '@/lib/queries'

export const revalidate = 3600 // regenerate homepage at most once per hour

const BASE_URL = 'https://www.sozim.co.za'

export const metadata: Metadata = {
  title: 'Sozim | Accredited Education & Training College Bloemfontein',
  description:
    'Accredited education and training college in Bloemfontein, South Africa. Enrol in ETDP SETA accredited programmes in Library and Information Science (LIS) and Education Training and Development (ETD).',
  authors: [{ name: 'Sozim Trading and Consultancy' }],
  keywords: [
    'accredited education and training college Bloemfontein',
    'training courses South Africa',
    'accredited education Bloemfontein',
    'training college Bloemfontein',
    'professional training Bloemfontein',
    'skills development Bloemfontein',
    'career development courses',
    'online education Bloemfontein',
    'ETDP SETA accredited college',
    'SAQA registered courses',
    'Library and Information Science courses South Africa',
    'ETD courses South Africa',
  ],
  openGraph: {
    title: 'Sozim | Accredited Education and Training College in Bloemfontein, South Africa',
    description:
      'Accredited education and training college in Bloemfontein, South Africa. ETDP SETA accredited LIS and ETD programmes.',
    url: BASE_URL,
    siteName: 'Sozim',
    type: 'website',
    locale: 'en_ZA',
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
  twitter: {
    card: 'summary_large_image',
    title: 'Sozim | Accredited Education & Training College Bloemfontein',
    description: 'ETDP SETA accredited LIS and ETD programmes in Bloemfontein, South Africa.',
    images: ['/og-image.jpg'],
    site: '@sozimtrading',
  },
  alternates: {
    canonical: BASE_URL,
  },
}

const homepageFAQs = [
  {
    question: 'What courses does Sozim offer?',
    answer:
      'Sozim offers ETDP SETA accredited programmes in Library and Information Science (LIS) and Education Training and Development (ETD). Specific programmes include Library Assistant (NQF 3), Learning and Development Facilitator, Assessment Practitioner, and professional skills development courses.',
  },
  {
    question: 'Is Sozim accredited?',
    answer:
      'Yes. Sozim is accredited by the ETDP SETA, registered with the QCTO, and aligned to SAQA standards. Our qualifications are nationally recognised in South Africa and appear on the National Qualifications Framework (NQF).',
  },
  {
    question: 'How do I enrol in a Sozim course?',
    answer:
      'You can apply online at sozim.co.za/apply, call us on (+27) 83 668 0104, or email admin@sozim.co.za. Intakes run in January, April, July, and October. The application process takes 5–7 business days.',
  },
  {
    question: 'Where is Sozim located?',
    answer:
      'Sozim is located at Shop 4, Sunday School Building, 154 Charlotte Maxeke Street, Bloemfontein, Free State, 9301, South Africa. We are open Monday to Friday 08:00–17:00 and Saturday 09:00–13:00.',
  },
  {
    question: 'Do you offer online courses?',
    answer:
      'Yes. Sozim offers online learning for most programmes. Online students access the same accredited curriculum, assessments, and instructor support as campus students, with flexible scheduling suited to working professionals.',
  },
  {
    question: 'How much do courses cost at Sozim?',
    answer:
      'Course fees are quoted in South African Rand (ZAR) and vary by programme length and level. Flexible payment plans are available. Contact admin@sozim.co.za or call (+27) 83 668 0104 for a detailed fee schedule.',
  },
]

// All schemas below are static — computed once at module load, not per request.
const EVENT_SCHEMA_JSON = JSON.stringify(getEventSchema())
const FAQ_SCHEMA_JSON = JSON.stringify(getFAQSchema(homepageFAQs))
const BREADCRUMB_SCHEMA_JSON = JSON.stringify(
  getBreadcrumbSchema([{ name: 'Home', url: BASE_URL }]),
)
const WEBPAGE_SCHEMA_JSON = JSON.stringify(
  getWebPageSchema({
    name: 'Sozim | Accredited Education and Training College in Bloemfontein',
    description:
      'Accredited education and training college in Bloemfontein, South Africa. ETDP SETA accredited LIS and ETD programmes.',
    url: BASE_URL,
    speakable: ['h1', '.hero-description', 'h2'],
    breadcrumb: [{ name: 'Home', url: BASE_URL }],
  }),
)
const KEY_TERMS_JSONS = getDefinedTermSchema([
  {
    name: 'LIS',
    description:
      'Library and Information Science (LIS) is an interdisciplinary field covering the theory and practice of managing, organising, and disseminating information. At Sozim, LIS programmes include Library Assistant qualifications aligned to the NQF.',
    url: `${BASE_URL}/courses`,
    sameAs: ['https://en.wikipedia.org/wiki/Library_and_information_science'],
  },
  {
    name: 'ETD',
    description:
      'Education Training and Development (ETD) is a field focused on facilitating learning, assessing competence, and developing human capital in South Africa. ETD practitioners work as facilitators, assessors, moderators, and instructional designers.',
    url: `${BASE_URL}/courses`,
    sameAs: ['https://en.wikipedia.org/wiki/Training_and_development'],
  },
  {
    name: 'ETDP SETA',
    description:
      'The Education, Training and Development Practices Sector Education and Training Authority (ETDP SETA) is a South African statutory body that accredits training providers in the education and development sector. Sozim is ETDP SETA accredited.',
    sameAs: ['https://www.etdpseta.org.za'],
  },
  {
    name: 'SAQA',
    description:
      'The South African Qualifications Authority (SAQA) oversees the National Qualifications Framework (NQF), ensuring qualifications are registered and nationally recognised. All Sozim programmes are SAQA aligned.',
    sameAs: ['https://www.saqa.org.za'],
  },
]).map((t) => JSON.stringify(t))

export default async function Home() {
  const [initialCourses, initialCategories] = await Promise.all([
    getCachedCourses(),
    getCachedCategories(),
  ])

  return (
    <div className="mb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: EVENT_SCHEMA_JSON }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: FAQ_SCHEMA_JSON }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: BREADCRUMB_SCHEMA_JSON }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: WEBPAGE_SCHEMA_JSON }}
      />
      {KEY_TERMS_JSONS.map((json, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: json }}
        />
      ))}
      <Hero />
      <Stats />
      <Featured />
      <SozimPrograms initialCourses={initialCourses} initialCategories={initialCategories} />
      <CTA />
    </div>
  )
}
