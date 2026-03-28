import type { Metadata } from 'next'
import PageHeader from '@/components/global/PageHeader'
import Breadcrumb from '@/components/global/Breadcrumb'

const BASE_URL = 'https://www.sozim.co.za'

export const metadata: Metadata = {
  title: 'Terms of Service',
	description:
		'Read Sozim Trading and Consultancy terms of service. Understand the terms and conditions for using our accredited education services and website in South Africa.',
  authors: [{ name: 'Sozim Team' }],
  other: {
    'author': 'Sozim Team',
    'published': '2026-03-28',
    'modified': '2026-03-28',
  },
	openGraph: {
		title: 'Terms of Service | Sozim',
		description: 'Read Sozim terms and conditions for using our accredited education services and website.',
		url: `${BASE_URL}/terms-of-service`,
    siteName: 'Sozim',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Terms of Service - Sozim',
        type: 'image/jpeg',
      },
    ],
  },
  alternates: {
    canonical: `${BASE_URL}/terms-of-service`,
  },
}

export default function TermsOfService() {
  return (
    <>
      <Breadcrumb />
      <PageHeader
        title="Terms of Service"
        details="Please read these terms carefully before using our website and services."
      />
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
            <div className="prose prose-slate max-w-none">
              <p className="text-sm text-slate-500 mb-8">
                Last updated: March 28, 2026
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-slate-600 mb-6">
                By accessing and using the website www.sozim.co.za, you accept and agree to be bound by the 
                terms and provision of this agreement. If you do not agree to abide by these terms, please 
                do not use this website.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Educational Services</h2>
              <p className="text-slate-600 mb-4">
                Sozim Trading and Consultancy provides accredited education and training services including but not limited to:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2">
                <li>Trading and financial markets education</li>
                <li>Professional development courses</li>
                <li>Online and contact learning programmes</li>
                <li>Library and Information Science courses</li>
                <li>Education Training Development programmes</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Registration and Account</h2>
              <p className="text-slate-600 mb-4">
                When you register for an account, you must provide accurate and complete information. You are 
                responsible for maintaining the confidentiality of your account credentials and for all activities 
                that occur under your account.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Course Enrollment and Payment</h2>
              <p className="text-slate-600 mb-4">
                Course enrollment is subject to availability and payment of applicable fees. We reserve the right 
                to modify course fees at any time. Payment plans may be available for certain courses at our discretion.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Intellectual Property</h2>
              <p className="text-slate-600 mb-6">
                All content, materials, and resources provided through our website and courses are the intellectual 
                property of Sozim Trading and Consultancy. You may not reproduce, distribute, modify, or create 
                derivative works from any content without our prior written consent.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. User Conduct</h2>
              <p className="text-slate-600 mb-4">You agree not to:</p>
              <ul className="list-disc pl-6 text-slate-600 mb-6 space-y-2">
                <li>Use our website for any unlawful purpose</li>
                <li>Attempt to gain unauthorized access to any part of our website</li>
                <li>Interfere with the proper operation of our website</li>
                <li>Transmit any viruses, worms, or other harmful code</li>
                <li>Post or transmit any defamatory, obscene, or offensive content</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Disclaimers</h2>
              <p className="text-slate-600 mb-6">
                Our courses are educational in nature. We do not guarantee specific trading results or financial 
                outcomes. Past performance of any course or programme does not guarantee future results. Students 
                are responsible for their own trading decisions and outcomes.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Limitation of Liability</h2>
              <p className="text-slate-600 mb-6">
                Sozim Trading and Consultancy shall not be liable for any indirect, incidental, special, consequential, 
                or punitive damages resulting from your use of or inability to use our services.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Accreditation and Qualifications</h2>
              <p className="text-slate-600 mb-6">
                While we strive to provide accredited programmes, final accreditation status is subject to approval 
                by relevant authorities including SAQA and QCTO. We will inform students of accreditation status for 
                each programme.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Termination</h2>
              <p className="text-slate-600 mb-6">
                We reserve the right to terminate your access to our website and services at any time, with or 
                without notice, for any violation of these terms.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Changes to Terms</h2>
              <p className="text-slate-600 mb-6">
                We may modify these terms at any time. Your continued use of our website after any modifications 
                constitutes your acceptance of the new terms.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Contact Information</h2>
              <p className="text-slate-600 mb-4">
                For questions about these terms, please contact us:
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
