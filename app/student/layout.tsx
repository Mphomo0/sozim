import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Student Portal | Sozim',
	description: 'Access your Sozim student portal to manage applications, track enrolment progress, and view your saved courses and program details.',
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
