import { query, mutation, internalMutation } from './_generated/server'
import { v, ConvexError } from 'convex/values'
import { requireAdmin, requireAuth } from './lib/auth'

export const getUsers = query({
  args: {
    page: v.optional(v.number()),
    limit: v.optional(v.number()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    const search = args.search?.toLowerCase()
    let users: any[] = []

    if (search) {
      if (search.includes('@')) {
        const byEmail = await ctx.db.query('users')
          .withIndex('by_email', q => q.eq('email', search))
          .collect()
        users = byEmail
      } else {
        const allUsers = await ctx.db.query('users').collect()
        users = allUsers.filter(u =>
          u.firstName?.toLowerCase().includes(search) ||
          u.lastName?.toLowerCase().includes(search) ||
          u.email?.toLowerCase().includes(search) ||
          u.clerkId?.toLowerCase().includes(search)
        )
      }
    } else {
      users = await ctx.db.query('users').collect()
    }

    const total = users.length
    const page = args.page || 1
    const limit = args.limit || 10
    const start = (page - 1) * limit
    const results = users.slice(start, start + limit)

    return {
      results,
      total,
      page,
      limit,
    }
  },
})

export const getUserById = query({
  args: { id: v.id('users') },
  handler: async (ctx, args) => {
    const caller = await requireAuth(ctx)
    const user = await ctx.db.get(args.id)
    // Callers may read their own record; only admins may read anyone's.
    if (!caller.isAdmin && user?.clerkId !== caller.identity.subject) {
      throw new ConvexError('Not authorized')
    }
    return user
  },
})

export const getUserByAnyId = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    if (!args.id) return null

    // 1. Try treating it as a standard Convex Id directly
    try {
      const normalizedId = ctx.db.normalizeId('users', args.id)
      if (normalizedId) {
        const user = await ctx.db.get(normalizedId)
        if (user) return user
      }
    } catch (e) {
      // Ignore - try other methods
    }
    
    // 2. Try treating it as a legacy MongoDB ObjectId (24 hex chars)
    if (args.id.length === 24 && /^[a-f\d]{24}$/i.test(args.id)) {
      const user = await ctx.db.query('users')
        .withIndex('by_mongo_id', q => q.eq('mongoId', args.id))
        .first()
      if (user) return user
    }
    
    // 3. Search by email if it looks like an email
    if (args.id.includes('@')) {
      const user = await ctx.db.query('users')
        .withIndex('by_email', q => q.eq('email', args.id.toLowerCase()))
        .first()
      if (user) return user
    }
    
    // 4. Try by clerkId
    const user = await ctx.db.query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', args.id))
      .first()
    if (user) return user
    
    return null
  },
})

export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const caller = await requireAuth(ctx)
    // A user may only look themselves up by clerkId; admins may look up anyone.
    if (!caller.isAdmin && args.clerkId !== caller.identity.subject) {
      throw new ConvexError('Not authorized')
    }
    return await ctx.db.query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', args.clerkId))
      .first()
  },
})

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const caller = await requireAuth(ctx)
    const email = args.email.trim().toLowerCase()
    if (!email) return null

    const user = await ctx.db.query('users')
      .withIndex('by_email', q => q.eq('email', email))
      .first()
    if (!user) return null

    // Admins may look up anyone. Non-admins may only resolve their OWN record —
    // either already linked to their identity, or matched to their verified
    // identity email (supports first sign-in linking). Returning null (rather
    // than throwing) for other emails prevents enumerating users by email.
    const callerEmail = caller.identity.email?.toLowerCase()
    if (
      caller.isAdmin ||
      user.clerkId === caller.identity.subject ||
      (!!callerEmail && callerEmail === email)
    ) {
      return user
    }
    return null
  },
})

export const createUser = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    clerkId: v.optional(v.string()),
    role: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    idNumber: v.optional(v.string()),
    alternativeNumber: v.optional(v.string()),
    dob: v.optional(v.string()),
    nationality: v.optional(v.string()),
    password: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const caller = await requireAuth(ctx)
    // Non-admins may only create their own record (first sign-in sync) and can
    // never grant themselves an elevated role or spoof another identity.
    if (caller.isAdmin) {
      return await ctx.db.insert('users', {
        ...args,
        role: args.role || 'USER',
      })
    }
    return await ctx.db.insert('users', {
      ...args,
      clerkId: caller.identity.subject,
      role: 'USER',
    })
  },
})

export const updateUser = mutation({
  args: {
    id: v.id('users'),
    firstName: v.optional(v.union(v.string(), v.null())),
    lastName: v.optional(v.union(v.string(), v.null())),
    email: v.optional(v.union(v.string(), v.null())),
    phone: v.optional(v.union(v.string(), v.null())),
    address: v.optional(v.union(v.string(), v.null())),
    dob: v.optional(v.union(v.string(), v.null())),
    alternativeNumber: v.optional(v.union(v.string(), v.null())),
    idNumber: v.optional(v.union(v.string(), v.null())),
    nationality: v.optional(v.union(v.string(), v.null())),
    clerkId: v.optional(v.union(v.string(), v.null())),
    role: v.optional(v.union(v.string(), v.null())),
    password: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, args) => {
    const caller = await requireAuth(ctx)
    const { id, password: _password, ...rest } = args

    const target = await ctx.db.get(id)
    if (!target) throw new ConvexError('User not found')

    if (!caller.isAdmin) {
      const ownsRecord = target.clerkId === caller.identity.subject
      // First sign-in linking: a caller may claim an as-yet-unlinked record
      // only if it matches their verified identity email. This is the same
      // gate as getUserByEmail, so no record a caller can't already resolve
      // can be claimed — closing account-takeover of un-activated accounts.
      const callerEmail = caller.identity.email?.toLowerCase()
      const claimingUnlinked =
        !target.clerkId &&
        rest.clerkId === caller.identity.subject &&
        !!callerEmail &&
        target.email?.toLowerCase() === callerEmail

      if (!ownsRecord && !claimingUnlinked) {
        throw new ConvexError('Not authorized')
      }
      // Non-admins can never change role, nor reassign clerkId to another identity.
      delete (rest as Record<string, unknown>).role
      if (rest.clerkId !== undefined && rest.clerkId !== caller.identity.subject) {
        delete (rest as Record<string, unknown>).clerkId
      }
    }

    // Filter out null values to avoid storing literal nulls if the schema doesn't like them,
    // although patch should handle it if the schema allows optional.
    const updateData: any = {}
    Object.entries(rest).forEach(([key, value]) => {
      if (value !== null) {
        updateData[key] = value
      } else {
        // If it's null, we might want to unset it or set it to undefined
        updateData[key] = undefined
      }
    })

    await ctx.db.patch(id, updateData)
    return await ctx.db.get(id)
  },
})

// Internal-only: role changes must never be triggered by a public client.
// The Clerk publicMetadata.role is the source of truth; this mirrors it into
// Convex via the clerk sync (see internalUpdateUserRole).
export const updateUserRole = internalMutation({
  args: {
    clerkId: v.string(),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', args.clerkId))
      .first()

    if (user) {
      await ctx.db.patch(user._id, { role: args.role })
      return { success: true, userId: user._id }
    }
    return { success: false, message: 'User not found' }
  },
})

export const internalUpdateUserRole = internalMutation({
  args: {
    clerkId: v.string(),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', args.clerkId))
      .first()
    
    if (user) {
      await ctx.db.patch(user._id, { role: args.role })
      return { success: true, userId: user._id }
    }
    return { success: false, message: 'User not found' }
  },
})

export const deleteUser = mutation({
  args: { id: v.id('users') },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    const applications = await ctx.db
      .query('applications')
      .withIndex('by_user', q => q.eq('actualApplicantId', args.id))
      .collect()
    
    for (const app of applications) {
      await ctx.db.delete(app._id)
    }
    
    await ctx.db.delete(args.id)
    return { success: true, applicationsDeleted: applications.length }
  },
})
