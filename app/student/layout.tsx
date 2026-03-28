import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Student Portal',
  description: 'Manage your applications and track your progress.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
