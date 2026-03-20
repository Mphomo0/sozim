import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const getCourses = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('courses').collect()
  },
})

export const getCourseById = query({
  args: { id: v.id('courses') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const createCourse = mutation({
  args: {
    name: v.string(),
    categoryId: v.id('courseCategories'),
    price: v.optional(v.number()), // added optional so it fits schema which doesn't enforce it
    code: v.string(),
    description: v.optional(v.string()),
    features: v.optional(v.array(v.string())),
    duration: v.string(),
    isOpen: v.boolean(),
    isPopular: v.optional(v.boolean()),
    image: v.optional(v.string()),
    modules: v.optional(v.any()), // Temporarily accept arbitrary shape to unblock TS
  },
  handler: async (ctx, args) => {
    const { categoryId, price, isPopular, image, features, ...rest } = args
    return await ctx.db.insert('courses', {
      ...rest,
      categoryId: categoryId,
      actualCategoryId: categoryId,
    })
  },
})

export const updateCourse = mutation({
  args: {
    id: v.id('courses'),
    name: v.optional(v.string()),
    price: v.optional(v.number()),
    code: v.optional(v.string()),
    description: v.optional(v.string()),
    features: v.optional(v.array(v.string())),
    categoryId: v.optional(v.string()),
    duration: v.optional(v.string()),
    isOpen: v.optional(v.boolean()),
    isPopular: v.optional(v.boolean()),
    image: v.optional(v.string()),
    modules: v.optional(v.any()),
    qualification: v.optional(v.string()),
    level: v.optional(v.string()),
    creditTotals: v.optional(v.any()),
    entryRequirements: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args
    await ctx.db.patch(id, rest)
    return await ctx.db.get(id)
  },
})

export const deleteCourse = mutation({
  args: { id: v.id('courses') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
    return true
  },
})
