import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('courseCategories').collect()
  },
})

export const getCategoryById = query({
  args: { id: v.id('courseCategories') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const createCategory = mutation({
  args: {
    name: v.string(),
    code: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('courseCategories', args)
  },
})

export const updateCategory = mutation({
  args: {
    id: v.id('courseCategories'),
    name: v.optional(v.string()),
    code: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args
    await ctx.db.patch(id, rest)
    return await ctx.db.get(id)
  },
})

export const deleteCategory = mutation({
  args: { id: v.id('courseCategories') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
    return true
  },
})
