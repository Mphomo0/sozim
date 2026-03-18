import type { Metadata } from 'next'
import ProductsGrid from '@/components/sections/store/ProductsGrid'
import PageHeader from '@/components/global/PageHeader'
import FAQSection from '@/components/global/FAQSection'
import Breadcrumb from '@/components/global/Breadcrumb'
import { getFAQSchema, getBreadcrumbSchema } from '@/lib/seo/schemas'

const BASE_URL = 'https://www.sozim.co.za'

export const metadata: Metadata = {
  title: 'Sozim Store | Premium Trading Resources and Educational Products',
  description:
    'Shop the Sozim Store for premium trading resources, educational materials, and professional tools. Discover quality products designed to support your trading education journey in South Africa.',
  keywords: [
    'Sozim store',
    'trading resources shop',
    'trading education materials South Africa',
    'trading books SA',
    'professional trading tools',
    'educational products South Africa',
    'student resources',
    'trading merchandise',
  ],
  openGraph: {
    title: 'Sozim Store | Trading Resources and Education Products',
    description:
      'Browse our range of premium trading resources, educational materials, and professional tools designed to support your trading education journey.',
    url: `${BASE_URL}/shop`,
  },
  alternates: {
    canonical: `${BASE_URL}/shop`,
  },
}

const shopFAQs = [
  {
    question: 'What products are available at the Sozim Store?',
    answer:
      'The Sozim Store offers a curated selection of trading resources, educational materials, and professional tools. Our product range includes trading guides, reference materials, professional stationery, and branded merchandise. All products are selected to complement and enhance our educational programmes.',
  },
  {
    question: 'How do I purchase products from the Sozim Store?',
    answer:
      'Browse our online store, select the products you need, and proceed to checkout. We accept various payment methods. For bulk orders or custom enquiries, please contact our team directly. Delivery options and timelines vary depending on your location within South Africa.',
  },
  {
    question: 'Do I need to be a Sozim student to purchase from the store?',
    answer:
      'No, the Sozim Store is open to everyone. Whether you are a current student, alumni, or simply interested in our products, you are welcome to shop with us. Students enrolled in our programmes may have access to exclusive discounts on certain items.',
  },
  {
    question: 'What payment methods are accepted?',
    answer:
      'We accept major credit and debit cards, EFT bank transfers, and other secure payment methods. All transactions are processed securely. For bulk or institutional purchases, we may offer invoice-based payment arrangements. Contact us to discuss payment options.',
  },
  {
    question: 'Do you ship products outside South Africa?',
    answer:
      'Currently, we primarily serve customers within South Africa. International shipping may be available for select products — please contact us directly to enquire about international delivery options, timelines, and associated costs.',
  },
  {
    question: 'What is your return or exchange policy?',
    answer:
      'We want you to be satisfied with your purchase. If a product is defective or does not meet your expectations, please contact us within 14 days of receipt. We will work with you to arrange a replacement, exchange, or refund as appropriate. Digital products may have different terms — check product listings for details.',
  },
]

export default function Shop() {
  const faqSchema = getFAQSchema(shopFAQs)
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Sozim Store', url: `${BASE_URL}/shop` },
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
        title="Sozim Store"
        details="Discover premium products crafted for comfort, quality, and everyday living. Shop with confidence and enjoy a seamless shopping experience."
      />
      <ProductsGrid />
      <FAQSection
        title="Frequently Asked Questions About the Sozim Store"
        faqs={shopFAQs}
      />
    </>
  )
}
