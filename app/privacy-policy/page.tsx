import type { Metadata } from 'next'
import PageHeader from '@/components/global/PageHeader'
import Breadcrumb from '@/components/global/Breadcrumb'
import { getBreadcrumbSchema, getWebPageSchema } from '@/lib/seo/schemas'

const BASE_URL = 'https://www.sozim.co.za'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Sozim privacy policy. Learn how we collect, use, and protect your personal information in accordance with South African data protection laws.',
  authors: [{ name: 'Sozim Team' }],
  other: {
    'author': 'Sozim Team',
    'published': '2026-03-28',
    'modified': '2026-03-28',
  },
  openGraph: {
    title: 'Privacy Policy | Sozim',
    description: 'Sozim privacy policy - how we collect, use, and protect your personal information.',
    url: `${BASE_URL}/privacy-policy`,
    siteName: 'Sozim',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Privacy Policy - Sozim',
        type: 'image/jpeg',
      },
    ],
  },
  alternates: {
    canonical: `${BASE_URL}/privacy-policy`,
  },
}

export default function PrivacyPolicy() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Privacy Policy', url: `${BASE_URL}/privacy-policy` },
  ])
  const webPageSchema = getWebPageSchema({
    name: 'Privacy Policy | Sozim',
    description: 'Sozim privacy policy - how we collect, use, and protect your personal information.',
    url: `${BASE_URL}/privacy-policy`,
    lastModified: '2026-03-28',
    breadcrumb: [
      { name: 'Home', url: BASE_URL },
      { name: 'Privacy Policy', url: `${BASE_URL}/privacy-policy` },
    ],
    speakable: ['h1', 'h2', 'p'],
  })

  return (
    <>
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
        title="Privacy Policy"
        details="Your privacy is important to us. This policy explains how we collect, use, and protect your information."
      />
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
            <div className="prose prose-slate max-w-none">
              <p className="text-sm text-slate-500 mb-8">
                Last updated: March 28, 2026
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
              <p className="text-slate-600 mb-6">
                Sozim Trading and Consultancy (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit 
                our website www.sozim.co.za or use our services.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Information We Collect</h2>
              <p className="text-slate-600 mb-4">We may collect personal information that you voluntarily provide to us when you:</p>
              <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2">
                <li>Register on the Website</li>
                <li>Express an interest in obtaining information about us or our products and services</li>
                <li>Participate in activities on the Website</li>
                <li>Contact us</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-slate-600 mb-4">We use personal information collected via our Website for a variety of business purposes described below:</p>
              <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2">
                <li>To facilitate account creation and logon process</li>
                <li>To send administrative information to you</li>
                <li>To fulfill and manage your orders and payments</li>
                <li>To post testimonials with your consent</li>
                <li>To request user feedback and contact you about your use of the Website</li>
                <li>To enforce our terms, conditions, and policies</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Sharing Your Information</h2>
              <p className="text-slate-600 mb-6">
                We may share your information with third parties in the following situations: with service providers 
                to monitor and analyze the use of our Website, to contact you, or to protect our rights or the rights 
                of users.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Data Security</h2>
              <p className="text-slate-600 mb-6">
                We have implemented appropriate technical and organizational security measures designed to protect the 
                security of any personal information we process. However, despite our safeguards and efforts to secure 
                your information, no electronic transmission over the Internet or information storage technology can be 
                guaranteed to be 100% secure.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Your Rights</h2>
              <p className="text-slate-600 mb-4">Under South African data protection laws, you have the right to:</p>
              <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Request deletion of your personal information</li>
                <li>Object to processing of your personal information</li>
                <li>Request restriction of processing your personal information</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Contact Us</h2>
              <p className="text-slate-600 mb-4">
                If you have questions or comments about this policy, you may email us at admin@sozim.co.za or contact us at:
              </p>
              <div className="bg-slate-50 p-6 rounded-lg">
                <p className="text-slate-700 font-semibold">Sozim Trading and Consultancy</p>
                <p className="text-slate-600">Shop 4, Sunday School Building</p>
                <p className="text-slate-600">154 Charlotte Maxeke Street</p>
                <p className="text-slate-600">Bloemfontein, 9301</p>
                <p className="text-slate-600">South Africa</p>
                <p className="text-slate-600 mt-2">Phone: (+27) 83 668 0104</p>
                <p className="text-slate-600">Email: admin@sozim.co.za</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
