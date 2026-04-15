import type { Metadata } from 'next'
import PageHeader from '@/components/global/PageHeader'
import Breadcrumb from '@/components/global/Breadcrumb'
import { getWebPageSchema } from '@/lib/seo/schemas'

const BASE_URL = 'https://www.sozim.co.za'

export const metadata: Metadata = {
  title: 'A Message from Our Director | Sozim',
  description: 'Welcome message from Sozim Director. Discover our commitment to quality education and training in South Africa.',
  keywords: ['Sozim director welcome', 'Sozim message', 'welcome to Sozim', 'director message students'],
  openGraph: {
    title: 'A Message from Our Director | Sozim',
    description: 'Welcome message from Sozim Director. Discover our commitment to quality education and training.',
    url: `${BASE_URL}/welcome-message`,
    siteName: 'Sozim',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'A Message from Our Director - Sozim',
        type: 'image/jpeg',
      },
    ],
  },
  alternates: {
    canonical: `${BASE_URL}/welcome-message`,
  },
}

export default function WelcomeMessage() {
  const webPageSchema = getWebPageSchema({
    name: 'A Message from Our Director | Sozim',
    description: 'Welcome message from Sozim Director.',
    url: `${BASE_URL}/welcome-message`,
    lastModified: '2026-04-15',
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <Breadcrumb />
      <PageHeader
        title="A Message from Our Director"
        details="A warm welcome to all our students from the Director of Sozim."
      />
      
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              <strong>Dear Students</strong>
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              On behalf of Sozim, it is our pleasure to warmly welcome you to the Occupational Certificate: Library Assistant programme.
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              We congratulate you on taking this significant step towards enhancing your professional competencies and contributing meaningfully to the library and information services sector. Your participation in this programme reflects a commitment to personal growth, skills development, and excellence.
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              This qualification is carefully structured to provide you with a balanced combination of theoretical knowledge, practical skills, and workplace experience. Throughout the programme, you will develop competencies in key areas such as information organisation, library operations, customer service, and the ethical management and use of information resources.
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              At Sozim, we are committed to delivering quality education and training that is aligned with industry standards and national skills development priorities. Our team of experienced facilitators and assessors will guide and support you throughout your learning journey to ensure that you achieve the required outcomes.
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              We encourage you to actively participate, remain disciplined, and take full advantage of this opportunity. Your dedication and engagement will play a crucial role in your success.
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              We are confident that this programme will equip you with valuable skills that will enhance your employability and open doors to opportunities within the library and information services environment.
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-8">
              Once again, welcome to Sozim. We look forward to supporting you throughout this journey and celebrating your achievements.
            </p>
            
            <div className="mt-8">
              <p className="text-gray-700 mb-2">Yours Sincerely,</p>
              <p className="text-xl font-semibold text-gray-900">DKC Diseko</p>
              <p className="text-gray-600">Director</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}