import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ToastContainer } from 'react-toastify'
import { ClerkProvider } from '@clerk/nextjs'
import ConvexClientProvider from '@/components/ConvexClientProvider'
import ClientLayoutWrapper from '@/components/global/ClientLayoutWrapper'
import SyncUserWithConvex from '@/components/global/SyncUserWithConvex'
import { getOrganizationSchemaScript, getWebsiteSchema } from '@/lib/seo/schemas'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const BASE_URL = 'https://www.sozim.co.za'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: BASE_URL,
    languages: {
      'en-ZA': BASE_URL,
      'en-ZW': BASE_URL,
      'en-BW': BASE_URL,
    },
  },

  title: {
    default: 'Sozim | Accredited Education & Trading Courses South Africa',
    template: '%s | Sozim',
  },

  description:
    'Sozim offers accredited trading courses, professional training, and career-focused education in South Africa. Enroll today for expert-led courses in Bloemfontein and online.',

  keywords: [
    'Sozim Trading and Consultancy',
    'trading courses South Africa',
    'professional trading training',
    'accredited education South Africa',
    'skills development courses SA',
    'career pathways education',
    'online trading education',
    'library science courses SA',
    'information science training',
    'forex trading courses South Africa',
    'stock market training',
    'ETD career pathways South Africa',
    'LIS education South Africa',
    'professional certificates South Africa',
    'skills training Bloemfontein',
    'Free State education',
    'accredited short courses South Africa',
    'trading education with certificate',
    'student training programmes',
    'consultancy services South Africa',
    'e-learning South Africa',
    'contact learning South Africa',
    'trading for beginners South Africa',
    'advanced trading strategies SA',
    'SAQA accredited courses',
    'QCTO registered programmes',
    'career guidance trading',
    'financial markets education',
    'academic library South Africa',
    'research resources SA universities',
  ],

  authors: [{ name: 'Sozim Trading and Consultancy', url: BASE_URL }],
  creator: 'Sozim Trading and Consultancy',
  publisher: 'Sozim Trading and Consultancy',

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'notranslate': false,
    },
    notranslate: false,
  },

  openGraph: {
    title: 'Sozim | Accredited Education & Trading Courses South Africa',
    description:
      'Enroll in accredited trading courses and professional training programmes in South Africa. Expert-led education for career success.',
    url: BASE_URL,
    siteName: 'Sozim',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Sozim - Accredited Education and Trading Courses in South Africa',
        type: 'image/jpeg',
      },
    ],
    locale: 'en_ZA',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Sozim Trading | Accredited Trading Courses South Africa',
    description:
      'Professional trading education and career-focused courses in South Africa. Enroll today.',
    images: ['/og-image.jpg'],
    site: '@sozimtrading',
    creator: '@sozimtrading',
  },

  appleWebApp: {
    title: 'Sozim Trading',
    statusBarStyle: 'black-translucent',
    startupImage: [
      {
        url: '/apple-touch-icon.png',
        media: '(device-width: 768px) and (device-height: 1024px)',
      },
    ],
  },

  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: {
      url: '/favicon.svg',
      type: 'image/svg+xml',
    },
  },

  verification: {
    google: 'Vn5qS44TPieZXQZPnKMlAqLoVJLZd9635iahYuDpIWk',
  },

  other: {
    'geo.region': 'ZA-FS',
    'geo.placename': 'Bloemfontein, South Africa',
    'geo.position': '-29.1167;26.2167',
    'ICBM': '-29.1167, 26.2167',
    'language': 'English',
    'country': 'South Africa',
    'rating': 'general',
    'revisit-after': '7 days',
    'distribution': 'global',
    'doc-type': 'WebPage',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const organizationSchema = getOrganizationSchemaScript()
  const websiteSchema = getWebsiteSchema()

  return (
    <html lang="en-ZA" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://ik.imagekit.io" />
        <link rel="dns-prefetch" href="https://ik.imagekit.io" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="color-scheme" content="light dark" />
        <meta name="format-detection" content="telephone=no" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <link rel="canonical" href={BASE_URL} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:bg-blue-900 focus:text-white focus:px-4 focus:py-2 focus:rounded"
        >
          Skip to main content
        </a>
        <ClerkProvider>
          <ConvexClientProvider>
            <ClientLayoutWrapper>
              <SyncUserWithConvex />
              <ToastContainer />
              <main id="main-content">{children}</main>
            </ClientLayoutWrapper>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
