import type { Metadata } from 'next'
import LoginForm from './LoginForm'

const BASE_URL = 'https://www.sozim.co.za'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Log in to your Sozim account to access your student portal, trading courses, and learning resources.',
  keywords: [
    'login Sozim',
    'student login',
    'account access',
    'sign in',
    'trading education login',
  ],
  openGraph: {
    title: 'Login | Sozim',
    description: 'Log in to your Sozim account to access your student portal and learning resources.',
    url: `${BASE_URL}/login`,
    siteName: 'Sozim',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Login to Sozim',
        type: 'image/jpeg',
      },
    ],
  },
  alternates: {
    canonical: `${BASE_URL}/login`,
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function LoginPage() {
  return <LoginForm />
}
