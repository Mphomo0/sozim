import { v } from "convex/values"
import { query, mutation } from "./_generated/server"
import type { Doc, Id } from "./_generated/dataModel"
import { internal } from "./_generated/api"

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

async function ensureUniqueSlug(
  ctx: any,
  baseSlug: string,
  excludeId?: Id<"newsPosts">
): Promise<string> {
  let slug = baseSlug
  let counter = 1
  while (true) {
    const existing = await ctx.db
      .query("newsPosts")
      .withIndex("by_slug", (q: any) => q.eq("slug", slug))
      .first()
    if (!existing || (excludeId && existing._id === excludeId)) return slug
    slug = `${baseSlug}-${counter}`
    counter++
  }
}

export const createNewsPost = mutation({
  args: {
    title: v.string(),
    slug: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    content: v.string(),
    featuredImage: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("published")),
    publishedAt: v.optional(v.number()),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    categoryIds: v.array(v.id("newsCategories")),
    tagIds: v.array(v.id("newsTags")),
    authorId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    const baseSlug = args.slug && args.slug.trim() ? args.slug : generateSlug(args.title)
    const slug = await ensureUniqueSlug(ctx, baseSlug)

    const id = await ctx.db.insert("newsPosts", {
      title: args.title.trim(),
      slug,
      excerpt: args.excerpt?.trim() || undefined,
      content: args.content,
      featuredImage: args.featuredImage || undefined,
      status: args.status,
      publishedAt: args.status === "published" ? (args.publishedAt || now) : undefined,
      seoTitle: args.seoTitle?.trim() || undefined,
      seoDescription: args.seoDescription?.trim() || undefined,
      categoryIds: args.categoryIds,
      tagIds: args.tagIds,
      authorId: args.authorId || undefined,
      createdAt: now,
      updatedAt: now,
    })
    if (args.status === "published") {
      await ctx.scheduler.runAfter(0, internal.indexnow.pingUrls, {
        urls: [`/news/${slug}`, "/news", "/"],
      })
    }
    return id
  },
})

export const updateNewsPost = mutation({
  args: {
    id: v.id("newsPosts"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    content: v.optional(v.string()),
    featuredImage: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
    publishedAt: v.optional(v.number()),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    categoryIds: v.optional(v.array(v.id("newsCategories"))),
    tagIds: v.optional(v.array(v.id("newsTags"))),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args
    const existing = await ctx.db.get(id)
    if (!existing) throw new Error("News post not found")

    const patch: Record<string, any> = { updatedAt: Date.now() }

    if (fields.title !== undefined) patch.title = fields.title.trim()
    if (fields.content !== undefined) patch.content = fields.content
    if (fields.excerpt !== undefined) patch.excerpt = fields.excerpt?.trim() || undefined
    if (fields.featuredImage !== undefined) patch.featuredImage = fields.featuredImage || undefined
    if (fields.seoTitle !== undefined) patch.seoTitle = fields.seoTitle?.trim() || undefined
    if (fields.seoDescription !== undefined) patch.seoDescription = fields.seoDescription?.trim() || undefined
    if (fields.categoryIds !== undefined) patch.categoryIds = fields.categoryIds
    if (fields.tagIds !== undefined) patch.tagIds = fields.tagIds

    if (fields.slug !== undefined) {
      const baseSlug = fields.slug.trim() || generateSlug(fields.title || existing.title)
      patch.slug = await ensureUniqueSlug(ctx, baseSlug, id)
    }

    if (fields.status !== undefined) {
      patch.status = fields.status
      if (fields.status === "published" && existing.status === "draft") {
        patch.publishedAt = fields.publishedAt || Date.now()
      }
      if (fields.status === "draft") {
        patch.publishedAt = undefined
      }
    }

    if (fields.publishedAt !== undefined && fields.status !== "draft") {
      patch.publishedAt = fields.publishedAt
    }

    await ctx.db.patch(id, patch)

    const finalStatus = patch.status ?? existing.status
    const finalSlug = patch.slug ?? existing.slug
    if (finalStatus === "published" && finalSlug) {
      await ctx.scheduler.runAfter(0, internal.indexnow.pingUrls, {
        urls: [`/news/${finalSlug}`, "/news"],
      })
    }
    return id
  },
})

export const deleteNewsPost = mutation({
  args: { id: v.id("newsPosts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})

export const getNewsPostById = query({
  args: { id: v.id("newsPosts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const getNewsPostBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("newsPosts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first()
  },
})

export const getPublishedNewsPosts = query({
  args: {
    paginationOpts: v.optional(v.any()),
    categorySlug: v.optional(v.string()),
    tagSlug: v.optional(v.string()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let posts = await ctx.db
      .query("newsPosts")
      .withIndex("by_status_publishedAt", (q) => q.eq("status", "published"))
      .order("desc")
      .collect()

    if (args.categorySlug) {
      const category = await ctx.db
        .query("newsCategories")
        .withIndex("by_slug", (q) => q.eq("slug", args.categorySlug!))
        .first()
      if (category) {
        posts = posts.filter((p) => p.categoryIds.includes(category._id))
      }
    }

    if (args.tagSlug) {
      const tag = await ctx.db
        .query("newsTags")
        .withIndex("by_slug", (q) => q.eq("slug", args.tagSlug!))
        .first()
      if (tag) {
        posts = posts.filter((p) => p.tagIds.includes(tag._id))
      }
    }

    if (args.search) {
      const q = args.search.toLowerCase()
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.excerpt && p.excerpt.toLowerCase().includes(q))
      )
    }

    return posts
  },
})

export const getAllNewsPostsForAdmin = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("newsPosts")
      .order("desc")
      .collect()
  },
})

export const getNewsPostsByCategorySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const category = await ctx.db
      .query("newsCategories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first()
    if (!category) return []

    return await ctx.db
      .query("newsPosts")
      .withIndex("by_status_publishedAt", (q) => q.eq("status", "published"))
      .order("desc")
      .collect()
      .then((posts) => posts.filter((p) => p.categoryIds.includes(category._id)))
  },
})

export const getNewsPostsByTagSlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const tag = await ctx.db
      .query("newsTags")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first()
    if (!tag) return []

    return await ctx.db
      .query("newsPosts")
      .withIndex("by_status_publishedAt", (q) => q.eq("status", "published"))
      .order("desc")
      .collect()
      .then((posts) => posts.filter((p) => p.tagIds.includes(tag._id)))
  },
})

export const getRelatedNewsPosts = query({
  args: {
    postId: v.id("newsPosts"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId)
    if (!post) return []

    const limit = args.limit ?? 4

    const allPublished = await ctx.db
      .query("newsPosts")
      .withIndex("by_status_publishedAt", (q) => q.eq("status", "published"))
      .order("desc")
      .take(limit * 4)

    const scored = allPublished
      .filter((p) => p._id !== args.postId)
      .map((p) => ({
        ...p,
        relevanceScore:
          (p.categoryIds.some((c) => post.categoryIds.includes(c)) ? 2 : 0) +
          (p.tagIds.some((t) => post.tagIds.includes(t)) ? 1 : 0),
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore)

    return scored.slice(0, limit)
  },
})
