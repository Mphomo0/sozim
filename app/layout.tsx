import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ToastContainer } from 'react-toastify'
import { ClerkProvider } from '@clerk/nextjs'
import ConvexClientProvider from '@/components/ConvexClientProvider'
import ClientLayoutWrapper from '@/components/global/ClientLayoutWrapper'
import SyncUserWithConvex from '@/components/global/SyncUserWithConvex'

import {
  getWebsiteSchema,
  getOrganizationSchema,
  getLocalBusinessSchema,
} from '@/lib/seo/schemas'

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
    default:
      'Sozim | Accredited Education and Training College in Bloemfontein, South Africa',
    template: '%s | Sozim',
  },

  description:
    'Accredited education and training college in Bloemfontein, South Africa offering SAQA-aligned programmes in Library and Information Science, ETD, and professional skills development.',

  keywords: [
    'accredited education Bloemfontein',
    'skills development courses Bloemfontein',
    'career pathways education Bloemfontein',
    'library science courses Bloemfontein',
    'ETD career pathways Bloemfontein',
    'LIS education Bloemfontein',
    'professional certificates Bloemfontein',
    'skills training Bloemfontein',
    'Bloemfontein education',
    'accredited short courses Bloemfontein',
    'student training programmes Bloemfontein',
    'SAQA accredited courses',
    'QCTO registered programmes',
    'academic library Bloemfontein',
    'research resources Bloemfontein',
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
      notranslate: false,
    },
  },

  openGraph: {
    title: 'Sozim | Accredited Education and Training College in Bloemfontein',
    description:
      'Accredited education and training college in Bloemfontein, South Africa.',
    url: BASE_URL,
    siteName: 'Sozim',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Sozim College',
      },
    ],
    locale: 'en_ZA',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Sozim | Accredited Education and Training College',
    description:
      'Accredited education and training college in Bloemfontein, South Africa.',
    images: ['/og-image.jpg'],
    site: '@sozimtrading',
  },

  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },

  verification: {
    google: 'Vn5qS44TPieZXQZPnKMlAqLoVJLZd9635iahYuDpIWk',
  },

  other: {
    'geo.region': 'ZA-FS',
    'geo.placename': 'Bloemfontein, South Africa',
    'geo.position': '-29.1167,26.2167', // FIXED
    ICBM: '-29.1167, 26.2167',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const websiteSchema = getWebsiteSchema()
  const organizationSchema = getOrganizationSchema()
  const localBusinessSchema = getLocalBusinessSchema()

  return (
    <html lang="en-ZA" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://ik.imagekit.io" />
        <link rel="dns-prefetch" href="https://ik.imagekit.io" />

        <meta name="theme-color" content="#0f172a" />
        <meta name="color-scheme" content="light dark" />
        <meta name="format-detection" content="telephone=no" />

        {/* ✅ FIXED: Multiple structured data schemas */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              websiteSchema,
              organizationSchema,
              localBusinessSchema,
            ]),
          }}
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-blue-900 focus:text-white focus:px-4 focus:py-2 focus:rounded"
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
