import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/student(.*)'])

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth()
  const { pathname } = request.nextUrl

  if (!userId && isProtectedRoute(request)) {
    // Redirect unauthenticated users hitting protected routes to home page
    const url = new URL('/', request.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
