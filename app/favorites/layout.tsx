import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Favorites | Sozim',
	description: 'View and manage your saved courses, programs, and educational resources on Sozim. Keep track of your favorite learning options.',
	robots: {
		index: false,
		follow: false,
	},
}

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
