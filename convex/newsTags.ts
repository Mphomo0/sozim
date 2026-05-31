import { v } from "convex/values"
import { query, mutation } from "./_generated/server"
import type { Id } from "./_generated/dataModel"

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

async function ensureUniqueSlug(
  ctx: any,
  baseSlug: string,
  excludeId?: Id<"newsTags">
): Promise<string> {
  let slug = baseSlug
  let counter = 1
  while (true) {
    const existing = await ctx.db
      .query("newsTags")
      .withIndex("by_slug", (q: any) => q.eq("slug", slug))
      .first()
    if (!existing || (excludeId && existing._id === excludeId)) return slug
    slug = `${baseSlug}-${counter}`
    counter++
  }
}

export const createNewsTag = mutation({
  args: {
    name: v.string(),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    const baseSlug = args.slug?.trim() || generateSlug(args.name)
    const slug = await ensureUniqueSlug(ctx, baseSlug)

    return await ctx.db.insert("newsTags", {
      name: args.name.trim(),
      slug,
      description: args.description?.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const updateNewsTag = mutation({
  args: {
    id: v.id("newsTags"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args
    const existing = await ctx.db.get(id)
    if (!existing) throw new Error("Tag not found")

    const patch: Record<string, any> = { updatedAt: Date.now() }

    if (fields.name !== undefined) patch.name = fields.name.trim()
    if (fields.description !== undefined) patch.description = fields.description?.trim() || undefined

    if (fields.slug !== undefined) {
      const baseSlug = fields.slug.trim() || generateSlug(fields.name || existing.name)
      patch.slug = await ensureUniqueSlug(ctx, baseSlug, id)
    }

    await ctx.db.patch(id, patch)
    return id
  },
})

export const deleteNewsTag = mutation({
  args: { id: v.id("newsTags") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})

export const getNewsTags = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("newsTags")
      .order("asc")
      .collect()
  },
})

export const getNewsTagBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("newsTags")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first()
  },
})
