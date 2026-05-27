import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/student(.*)',
  '/favorites(.*)',
  '/portal(.*)',
])

const STATIC_PUBLIC_ROUTES = [
  '/about',
  '/campus',
  '/career-pathway',
  '/privacy-policy',
  '/terms-of-service',
  '/contact-learning',
  '/welcome-message',
]

const SEMI_STATIC_ROUTES = ['/apply', '/call-me-back', '/contact', '/shop']

export default clerkMiddleware(async (auth, req: NextRequest) => {
  if (isProtectedRoute(req)) {
    await auth.protect()
  }

  const { pathname } = req.nextUrl
  const res = NextResponse.next()

  if (STATIC_PUBLIC_ROUTES.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    res.headers.set('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800')
  }

  if (SEMI_STATIC_ROUTES.some((p) => pathname === p)) {
    res.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
  }

  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  return res
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
