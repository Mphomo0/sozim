import type { Metadata } from 'next'
import LoginForm from './LoginForm'

const BASE_URL = 'https://www.sozim.co.za'

export const metadata: Metadata = {
  title: 'Login | Sozim Trading | Sozim Trading and Consultancy',
  description: 'Log in to your Sozim account to access your student portal, trading courses, and learning resources. Start learning today!',
  keywords: [
    'login Sozim Trading',
    'student login',
    'account access',
    'sign in',
    'trading education login',
    'online learning login',
  ],
  openGraph: {
    title: 'Login | Sozim Trading',
    description: 'Log in to your Sozim account to access your student portal, trading courses, and learning resources. Start learning today!',
    url: `${BASE_URL}/login`,
    siteName: 'Sozim Trading and Consultancy',
  },
  alternates: {
    canonical: `${BASE_URL}/login`,
  },
}

export default function LoginPage() {
  return <LoginForm />
}
