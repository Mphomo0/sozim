import { currentUser } from '@clerk/nextjs/server'

/**
 * Whether the current request comes from a signed-in ADMIN. Reads the role
 * from Clerk `publicMetadata` — the same source of truth the app's `auth()`
 * session uses (see auth.ts) — so it can't be spoofed via the Convex mirror.
 *
 * Use in route handlers that are NOT covered by `auth.protect()` in proxy.ts.
 */
export async function isAdminRequest(): Promise<boolean> {
  try {
    const user = await currentUser()
    return user?.publicMetadata?.role === 'ADMIN'
  } catch {
    return false
  }
}
