import type { Metadata } from 'next'
import PageHeader from '@/components/global/PageHeader'
import Accreditation from '@/components/sections/about/Accreditation'
import Achievements from '@/components/sections/about/Achievements'
import Leadership from '@/components/sections/about/Leadership'
import MissionVision from '@/components/sections/about/MissionVision'
import OurStory from '@/components/sections/about/OurStory'
import Values from '@/components/sections/about/Values'
import Breadcrumb from '@/components/global/Breadcrumb'
import { getFAQSchema, getBreadcrumbSchema, getPersonSchema } from '@/lib/seo/schemas'

const BASE_URL = 'https://www.sozim.co.za'

export const metadata: Metadata = {
  title: 'About Sozim Trading and Consultancy | Our Story, Mission & Values',
  description:
    'Learn about Sozim Trading and Consultancy — an accredited education provider in Bloemfontein, South Africa, dedicated to empowering students through quality training, professional development, and career-focused courses.',
  keywords: [
    'about Sozim Trading',
    'Sozim Consultancy story',
    'accredited education provider South Africa',
    'Bloemfontein education institution',
    'Sozim mission and values',
    'professional training South Africa',
    'education consultancy Free State',
  ],
  openGraph: {
    title: 'About Sozim Trading and Consultancy | Our Story',
    description:
      'Discover the story, mission, and values behind Sozim Trading and Consultancy — empowering students across South Africa.',
    url: `${BASE_URL}/about`,
  },
  alternates: {
    canonical: `${BASE_URL}/about`,
  },
}

const aboutFAQs = [
  {
    question:
      'What is Sozim Trading and Consultancy?',
    answer:
      'Sozim Trading and Consultancy is an accredited education and training provider based in Bloemfontein, South Africa. We offer professional trading courses, skills development programmes, and career-focused education designed to empower students and professionals to achieve their goals.',
  },
  {
    question:
      'Is Sozim Trading and Consultancy accredited?',
    answer:
      'Yes, Sozim Trading and Consultancy is an accredited education provider operating in South Africa. Our programmes are designed to meet South African Qualifications Authority (SAQA) standards, ensuring our students receive recognised and valuable credentials that are respected by employers across the country.',
  },
  {
    question:
      'Where is Sozim Trading and Consultancy located?',
    answer:
      'Our main campus is located at Shop 4, Sunday School Building, 154 Charlotte Maxeke Street, Bloemfontein, Free State, South Africa. We also offer online learning options, making our programmes accessible to students across South Africa.',
  },
  {
    question:
      'Who can enrol in Sozim courses?',
    answer:
      'Our courses are open to anyone looking to advance their career, learn new skills, or pursue professional development. Whether you are a beginner looking to start your journey in trading or a professional seeking advanced qualifications, we have programmes suitable for all experience levels.',
  },
  {
    question:
      'What makes Sozim different from other training providers?',
    answer:
      'Sozim Trading and Consultancy combines practical trading education with professional development support. Our programmes are designed with industry input, taught by experienced professionals, and tailored to the South African market. We focus on real-world skills that translate directly into career opportunities.',
  },
  {
    question:
      'What career support does Sozim offer?',
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

  const leadershipTeam = [
    {
      name: 'Dorcas Kasadi Cecily Diseko',
      jobTitle: 'Managing Director',
      description:
        'Managing Director of Sozim Trading and Consultancy, leading education and training initiatives in South Africa.',
    },
    {
      name: 'Mahlaga J Molepo',
      jobTitle: 'Academic Director',
      description:
        'Academic Director overseeing curriculum development and quality assurance for all Sozim education programmes.',
    },
    {
      name: 'Matthews Modiba',
      jobTitle: 'Student Affairs Manager',
      description:
        'Student Affairs Manager dedicated to supporting student success and engagement at Sozim Trading and Consultancy.',
    },
    {
      name: 'Rorisang Diseko',
      jobTitle: 'Student Affairs Manager',
      description:
        'Student Affairs Manager supporting student welfare and professional development programmes.',
    },
    {
      name: 'Ohentse T Diseko',
      jobTitle: 'Operations Manager',
      description:
        'Operations Manager ensuring efficient delivery of all Sozim education and consultancy services.',
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
              })
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
