import { auth } from '@/auth'

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  // Define public routes that don't require authentication
  const isLoginPage = nextUrl.pathname === '/login'
  const isApiAuthRoute = nextUrl.pathname.startsWith('/api/auth')
  const isPublicAsset = nextUrl.pathname.match(/\.(png|jpg|jpeg|gif|svg|ico)$/)

  // 1. Allow API auth requests (necessary for login/callback to work)
  if (isApiAuthRoute) return

  // 2. If not logged in and not on a public page, redirect to login
  if (!isLoggedIn && !isLoginPage && !isPublicAsset) {
    return Response.redirect(new URL('/login', nextUrl))
  }

  // 3. If logged in and trying to access login page, redirect to dashboard
  if (isLoggedIn && isLoginPage) {
    return Response.redirect(new URL('/dashboard', nextUrl))
  }

  return
})

export const config = {
  // Protects all routes except static files and next internals
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
