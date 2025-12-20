import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ToastContainer } from 'react-toastify'
import { SessionProvider } from 'next-auth/react'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.sozim.co.za'),

  title: {
    default: 'Sozim Trading and Consultancy | Transform Your Future',
    template: '%s | Sozim Trading and Consultancy',
  },

  description:
    'Sozim Trading and Consultancy offers accredited education, professional training, and career-focused courses designed to empower students and professionals for success.',

  keywords: [
    'Sozim',
    'Sozim Trading and Consultancy',
    'training courses South Africa',
    'professional education',
    'career development',
    'skills training',
    'consultancy services',
  ],

  authors: [{ name: 'Sozim Trading and Consultancy' }],
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
    },
  },

  openGraph: {
    title: 'Sozim Trading and Consultancy | Transform Your Future',
    description:
      'Empowering students and professionals through quality education, skills training, and expert consultancy services.',
    url: 'https://www.sozim.co.za',
    siteName: 'Sozim Trading and Consultancy',
    images: [
      {
        url: '/og-image.jpg', // place in /public
        width: 1200,
        height: 630,
        alt: 'Sozim Trading and Consultancy',
      },
    ],
    locale: 'en_ZA',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Sozim Trading and Consultancy | Transform Your Future',
    description:
      'Professional training and career-focused education to help you succeed.',
    images: ['/og-image.jpg'],
  },

  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <ToastContainer />
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
