import type { Metadata } from 'next'
import PageHeader from '@/components/global/PageHeader'
import Accreditation from '@/components/sections/about/Accreditation'
import Achievements from '@/components/sections/about/Achievements'
import Leadership from '@/components/sections/about/Leadership'
import MissionVision from '@/components/sections/about/MissionVision'
import OurStory from '@/components/sections/about/OurStory'
import Values from '@/components/sections/about/Values'
import Breadcrumb from '@/components/global/Breadcrumb'
import {
  getFAQSchema,
  getBreadcrumbSchema,
  getPersonSchema,
  getArticleSchema,
  getWebPageSchema,
} from '@/lib/seo/schemas'

const BASE_URL = 'https://www.sozim.co.za'

export const metadata: Metadata = {
  title: 'About Us | Accredited Education and Training College in Bloemfontein',
  description:
    'Learn about Sozim, an accredited education and training college in Bloemfontein, South Africa. Discover our mission, values and excellence.',
  keywords: [
    'about Sozim',
    'Sozim story',
    'accredited education Bloemfontein',
    'training college South Africa',
    'Sozim mission and values',
    'professional training Free State',
    'education institution Bloemfontein',
  ],
  openGraph: {
    title: 'About Us | Sozim - Accredited Education and Training College',
    description:
      'Discover the story, mission and values behind Sozim, an accredited education and training college in Bloemfontein.',
    url: `${BASE_URL}/about`,
    siteName: 'Sozim',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'About Sozim - Accredited Education and Training College',
        type: 'image/jpeg',
      },
    ],
  },
  alternates: {
    canonical: `${BASE_URL}/about`,
  },
  authors: [{ name: 'Sozim Team' }],
  other: {
    author: 'Sozim Team',
    published: '2026-03-28',
    modified: '2026-03-28',
  },
}

const aboutFAQs = [
  {
    question: 'What is Sozim?',
    answer:
      'Sozim is an accredited education and training college based in Bloemfontein. We offer accredited programmes in Library and Information Science (LIS), Education Training and Development (ETD), and professional skills courses designed to empower students and professionals to achieve their career goals.',
  },
  {
    question: 'Is Sozim accredited?',
    answer:
      'Yes, Sozim is an accredited education provider. Our programmes are ETDP SETA accredited and QCTO registered, designed to meet South African Qualifications Authority (SAQA) standards, ensuring our students receive recognised and valuable credentials.',
  },
  {
    question: 'Where is Sozim located?',
    answer:
      'Our main campus is located at Shop 4, Sunday School Building, 154 Charlotte Maxeke Street, Bloemfontein, Free State. We also offer online learning options, making our programmes accessible to students across South Africa.',
  },
  {
    question: 'Who can enrol in Sozim courses?',
    answer:
      'Our courses are open to anyone looking to advance their career, learn new skills, or pursue professional development. Whether you are a beginner or a professional seeking advanced qualifications, we have programmes suitable for all experience levels.',
  },
  {
    question: 'What makes Sozim different from other training providers?',
    answer:
      'Sozim combines accredited education with professional development support. Our programmes are designed with industry input, taught by experienced professionals, and tailored to the South African job market. We focus on real-world skills that translate directly into career opportunities.',
  },
  {
    question: 'What career support does Sozim offer?',
    answer:
      'Beyond course completion, we support our students through career pathway guidance, professional development resources, and connections to industry opportunities. Our career pathways section helps students understand the trajectory from each programme into meaningful employment.',
  },
]

export default function About() {
  const faqSchema = getFAQSchema(aboutFAQs)
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'About Us', url: `${BASE_URL}/about` },
  ])
  const articleSchema = getArticleSchema({
    headline: 'About Sozim - Accredited Education and Training College',
    description:
      'Learn about Sozim, an accredited education and training college in Bloemfontein, South Africa. Founded in 2009.',
    author: 'Sozim Team',
    datePublished: '2026-03-28',
    dateModified: '2026-03-28',
    url: `${BASE_URL}/about`,
    keywords: [
      'about Sozim',
      'accredited education Bloemfontein',
      'training college South Africa',
    ],
  })
  const webPageSchema = getWebPageSchema({
    name: 'About Us | Sozim - Accredited Education and Training College',
    description:
      'Discover the story, mission and values behind Sozim, an accredited education and training college in Bloemfontein.',
    url: `${BASE_URL}/about`,
    lastModified: '2026-03-28',
    breadcrumb: [
      { name: 'Home', url: BASE_URL },
      { name: 'About Us', url: `${BASE_URL}/about` },
    ],
    speakable: ['h1', 'h2', 'p'],
  })

  const leadershipTeam = [
    {
      name: 'Dorcas Kasadi Cecily Diseko',
      jobTitle: 'Managing Director',
      description:
        'Managing Director of Sozim, leading education and training initiatives in South Africa since 2009.',
      credentials: {
        education: 'MBA, Business Administration',
        qualifications: ['QCTO Registered Assessor', 'ETDP SETA Facilitator'],
        experience: '15+ years in education management and training',
      },
    },
    {
      name: 'Mahlaga J Molepo',
      jobTitle: 'Academic Director',
      description:
        'Academic Director overseeing curriculum development and quality assurance for all Sozim education programmes.',
      credentials: {
        education: 'Masters in Education, University of the Free State',
        qualifications: [
          'SAQA Accredited Facilitator',
          'Assessment Moderator Certification',
        ],
        experience: '12+ years in academic leadership and curriculum design',
      },
    },
    {
      name: 'Matthews Modiba',
      jobTitle: 'Student Affairs Manager',
      description:
        'Student Affairs Manager dedicated to supporting student success and engagement at Sozim.',
      credentials: {
        education: 'Bachelors in Psychology, University of Johannesburg',
        qualifications: [
          'Student Support Specialist Certification',
          'Career Guidance Practitioner License',
        ],
        experience: '8+ years in student affairs and welfare management',
      },
    },
    {
      name: 'Rorisang Diseko',
      jobTitle: 'Student Affairs Manager',
      description:
        'Student Affairs Manager supporting student welfare and professional development programmes.',
      credentials: {
        education: 'Diploma in Social Work, University of the Free State',
        qualifications: [
          'Registered Social Worker',
          'Youth Development Practitioner',
        ],
        experience: '6+ years in student welfare and development',
      },
    },
    {
      name: 'Ohentse T Diseko',
      jobTitle: 'Operations Manager',
      description:
        'Operations Manager ensuring efficient delivery of all Sozim education services.',
      credentials: {
        education: 'BCom in Operations Management, University of South Africa',
        qualifications: [
          'Project Management Professional (PMP)',
          'ISO 9001 Lead Auditor',
        ],
        experience: '10+ years in operations and project management',
      },
    },
  ]

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      {leadershipTeam.map((member) => (
        <script
          key={member.name}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              getPersonSchema({
                name: member.name,
                jobTitle: member.jobTitle,
                description: member.description,
                credentials: member.credentials,
              }),
            ),
          }}
        />
      ))}
      <Breadcrumb />
      <PageHeader
        title="About Sozim"
        details="Empowering students through quality education and training. We are dedicated to transforming lives and building successful careers."
      />
      <MissionVision />
      <Values />
      <Achievements />
      <OurStory />
      <Leadership />
      <Accreditation />
    </>
  )
}
