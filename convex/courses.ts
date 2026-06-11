import { query, mutation } from './_generated/server'
import { v, ConvexError } from 'convex/values'
import { internal } from './_generated/api'

export const getCourses = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('courses').collect()
  },
})

export const getCoursesList = query({
  args: {},
  handler: async (ctx) => {
    const courses = await ctx.db.query('courses').collect()
    return courses.map((c) => ({
      _id: c._id,
      name: c.name,
      isOpen: c.isOpen,
    }))
  },
})

export const searchCourses = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    if (!args.query.trim()) return []
    const searchStr = args.query.toLowerCase()
    const courses = await ctx.db.query('courses').collect()
    const matches = courses.filter(
      (c) =>
        c.name.toLowerCase().includes(searchStr) ||
        c.description?.toLowerCase().includes(searchStr),
    )
    return matches.slice(0, 5).map((c) => ({
      _id: c._id,
      name: c.name,
      description: c.description,
      slug: c.slug,
    }))
  },
})

export const getCourseById = query({
  args: { id: v.id('courses') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const getCourseBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("courses")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
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
    slug: v.optional(v.string()),
    careerOutcomes: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { categoryId, price, isPopular, image, features, ...rest } = args
    if (rest.slug !== undefined) {
      const normalizedSlug = rest.slug.trim().toLowerCase()
      if (!normalizedSlug) {
        throw new ConvexError('Slug cannot be empty')
      }
      if (!/^[a-z0-9-]+$/.test(normalizedSlug)) {
        throw new ConvexError('Slug must contain only lowercase letters, numbers, and hyphens')
      }
      rest.slug = normalizedSlug
      const existing = await ctx.db
        .query('courses')
        .withIndex('by_slug', (q) => q.eq('slug', normalizedSlug))
        .first()
      if (existing) {
        throw new ConvexError('Slug already in use')
      }
    }
    const id = await ctx.db.insert('courses', {
      ...rest,
      categoryId: categoryId,
      actualCategoryId: categoryId,
    })
    if (rest.slug && rest.isOpen) {
      await ctx.scheduler.runAfter(0, internal.indexnow.pingUrls, {
        urls: [`/courses/${rest.slug}`, '/courses', '/'],
      })
    }
    return id
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
    slug: v.optional(v.string()),
    careerOutcomes: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args
    if (rest.slug !== undefined) {
      const normalizedSlug = rest.slug.trim().toLowerCase()
      if (!normalizedSlug) {
        throw new ConvexError('Slug cannot be empty')
      }
      if (!/^[a-z0-9-]+$/.test(normalizedSlug)) {
        throw new ConvexError('Slug must contain only lowercase letters, numbers, and hyphens')
      }
      rest.slug = normalizedSlug
      const existing = await ctx.db
        .query('courses')
        .withIndex('by_slug', (q) => q.eq('slug', normalizedSlug))
        .first()
      if (existing && existing._id !== id) {
        throw new ConvexError('Slug already in use')
      }
    }
    await ctx.db.patch(id, rest)
    const updated = await ctx.db.get(id)
    if (updated?.slug) {
      await ctx.scheduler.runAfter(0, internal.indexnow.pingUrls, {
        urls: [`/courses/${updated.slug}`, '/courses'],
      })
    }
    return updated
  },
})

export const deleteCourse = mutation({
  args: { id: v.id('courses') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
    return true
  },
})
