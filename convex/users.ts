import { query, mutation, internalMutation } from './_generated/server'
import { v } from 'convex/values'

export const getUsers = query({
  args: {
    page: v.optional(v.number()),
    limit: v.optional(v.number()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const search = args.search?.toLowerCase()
    let users = await ctx.db.query('users').collect()

    if (search) {
      users = users.filter(u => 
        u.firstName?.toLowerCase().includes(search) || 
        u.lastName?.toLowerCase().includes(search) || 
        u.email?.toLowerCase().includes(search) ||
        u.clerkId?.toLowerCase().includes(search)
      )
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
    return await ctx.db.get(args.id)
  },
})

export const getUserByAnyId = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    // 1. Try treating it as a legacy MongoDB ObjectId (24 hex chars)
    if (args.id.length === 24 && /^[a-f\d]{24}$/i.test(args.id)) {
      const user = await ctx.db.query('users')
        .withIndex('by_mongo_id', q => q.eq('mongoId', args.id))
        .first()
      if (user) return user
    }
    
    // 2. Try treating it as a standard Convex Id
    try {
      const normalizedId = ctx.db.normalizeId('users', args.id)
      if (normalizedId) {
        return await ctx.db.get(normalizedId)
      }
    } catch (e) {
      // Ignore invalid id format error
    }
    
    return null
  },
})

export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', args.clerkId))
      .first()
  },
})

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase()
    if (!email) return null
    
    return await ctx.db.query('users')
      .withIndex('by_email', q => q.eq('email', email))
      .first()
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
    return await ctx.db.insert('users', {
      ...args,
      role: args.role || 'USER',
    })
  },
})

export const updateUser = mutation({
  args: {
    id: v.id('users'),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    dob: v.optional(v.string()),
    alternativeNumber: v.optional(v.string()),
    idNumber: v.optional(v.string()),
    nationality: v.optional(v.string()),
    clerkId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args
    await ctx.db.patch(id, rest)
    return await ctx.db.get(id)
  },
})

export const updateUserRole = mutation({
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
