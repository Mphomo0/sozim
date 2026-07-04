import { ConvexError } from 'convex/values'
import type { QueryCtx, MutationCtx } from '../_generated/server'

type Ctx = QueryCtx | MutationCtx

export interface Caller {
  /** The verified Clerk identity from the request's auth token. */
  identity: NonNullable<Awaited<ReturnType<Ctx['auth']['getUserIdentity']>>>
  /** The caller's Convex user record, if one exists yet (may be null during first sign-in sync). */
  user: Awaited<ReturnType<typeof lookupUser>>
  isAdmin: boolean
}

async function lookupUser(ctx: Ctx, clerkId: string) {
  return await ctx.db
    .query('users')
    .withIndex('by_clerk_id', (q) => q.eq('clerkId', clerkId))
    .first()
}

/**
 * Resolve the authenticated caller from the request's Clerk token. Throws if
 * the request is unauthenticated. This is the single source of truth for
 * server-side authorization — never trust a clerkId/userId passed as an
 * argument as proof of identity.
 *
 * `isAdmin` is derived from the caller's own Convex `role`. That mirror is
 * only writable by existing admins or the one-directional Clerk→Convex sync
 * (all public role-writers are gated/internal), so it is safe to trust here.
 */
export async function getCaller(ctx: Ctx): Promise<Caller> {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) {
    throw new ConvexError('Not authenticated')
  }
  const user = await lookupUser(ctx, identity.subject)
  return { identity, user, isAdmin: user?.role === 'ADMIN' }
}

/** Require any authenticated user. Returns the resolved caller. */
export async function requireAuth(ctx: Ctx): Promise<Caller> {
  return await getCaller(ctx)
}

/** Require an authenticated ADMIN. Throws otherwise. */
export async function requireAdmin(ctx: Ctx): Promise<Caller> {
  const caller = await getCaller(ctx)
  if (!caller.isAdmin) {
    throw new ConvexError('Not authorized')
  }
  return caller
}
