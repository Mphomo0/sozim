import { action } from './_generated/server'
import { internal } from './_generated/api'

const CLERK_API_URL = "https://api.clerk.com/v1"
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY!

export const syncClerkUserRole = action(async (ctx, args: { clerkId: string }) => {
  if (!CLERK_SECRET_KEY) {
    throw new Error("CLERK_SECRET_KEY not configured")
  }

  const response = await fetch(`${CLERK_API_URL}/users/${args.clerkId}`, {
    headers: {
      Authorization: `Bearer ${CLERK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch Clerk user: ${response.statusText}`)
  }

  const clerkUser = await response.json()
  const role = clerkUser.public_metadata?.role

  if (role && typeof role === "string") {
    await ctx.runMutation(internal.users.internalUpdateUserRole, {
      clerkId: args.clerkId,
      role,
    })
    return { success: true, role }
  }

  return { success: true, role: null }
})
