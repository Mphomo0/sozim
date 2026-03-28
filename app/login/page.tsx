import type { Metadata } from 'next'
import LoginForm from './LoginForm'

const BASE_URL = 'https://www.sozim.co.za'

export const metadata: Metadata = {
  title: 'Login | Sozim Trading and Consultancy',
  description: 'Log in to your Sozim Trading and Consultancy account. Access your student portal, courses, and learning resources.',
  keywords: [
    'login Sozim Trading',
    'student login',
    'account access',
    'sign in',
    'trading education login',
    'online learning login',
  ],
  openGraph: {
    title: 'Login | Sozim Trading and Consultancy',
    description: 'Log in to your Sozim Trading and Consultancy account. Access your student portal, courses, and learning resources.',
    url: `${BASE_URL}/login`,
  },
  alternates: {
    canonical: `${BASE_URL}/login`,
  },
}

export default function LoginPage() {
  return <LoginForm />
}
