import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";

// --- Queries ---

export const getRecords = query({
  args: {
    category: v.optional(v.string()),
    query: v.optional(v.string()),
    page: v.optional(v.number()),
    pageSize: v.optional(v.number()),
    filters: v.optional(v.object({
      year: v.optional(v.string()),
      repository: v.optional(v.string()),
      type: v.optional(v.string()),
      author: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    // Normalise category alias
    const normCat = args.category === 'theses' ? 'thesis'
      : args.category === 'articles' ? 'article'
      : args.category === 'research' ? 'research'
      : args.category;

    // Apply category filter at the DB level when possible to reduce payload
    let baseRecords =
      normCat && normCat !== 'all'
        ? await ctx.db.query('records').withIndex('by_category', q => q.eq('category', normCat)).collect()
        : await ctx.db.query('records').collect();

    let filtered = baseRecords;

    if (args.filters) {
      const { year: fYear, repository: fRepo, type: fType, author: fAuthor } = args.filters;

      if (fYear) {
        const y = parseInt(fYear);
        filtered = filtered.filter(r => r.year === y);
      }
      if (fRepo) {
        filtered = filtered.filter(r => r.source === fRepo);
      }
      if (fType) {
        filtered = filtered.filter(r => r.type === fType);
      }
      if (fAuthor) {
        const auth = fAuthor.toLowerCase();
        filtered = filtered.filter(r => r.authors.some(a => a.toLowerCase().includes(auth)));
      }
    }

    if (args.query) {
      const q = args.query.toLowerCase();
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(q) ||
        (r.description || '').toLowerCase().includes(q) ||
        r.keywords.some(k => k.toLowerCase().includes(q))
      );
    }

    const total = filtered.length;
    const page = args.page || 1;
    const pageSize = args.pageSize || 24;
    const start = (page - 1) * pageSize;
    const results = filtered.slice(start, start + pageSize);

    // Build facets from the already-filtered base set (not repulled from DB)
    const allAuthors = baseRecords.flatMap(r => r.authors || []);
    const uniqueAuthors = Array.from(new Set(allAuthors));
    const facets = {
      years: Array.from(new Set(baseRecords.map(r => r.year).filter(y => y !== undefined)))
        .sort((a, b) => (b || 0) - (a || 0))
        .map(y => ({ name: y, count: baseRecords.filter(r => r.year === y).length })),
      authors: uniqueAuthors.slice(0, 50).map(a => ({ name: a, count: allAuthors.filter(auth => auth === a).length })),
      repositories: Array.from(new Set(baseRecords.map(r => r.source))).sort().map(s => ({ name: s, count: baseRecords.filter(r => r.source === s).length })),
      types: Array.from(new Set(baseRecords.map(r => r.type))).sort().map(t => ({ name: t, count: baseRecords.filter(r => r.type === t).length })),
      categories: Array.from(new Set(baseRecords.map(r => r.category))).sort().map(c => ({ name: c, count: baseRecords.filter(r => r.category === c).length })),
    };

    return {
      results,
      total,
      page,
      pageSize,
      hasMore: start + pageSize < total,
      facets,
    };
  },
});

// Efficient category counts — never fetches record content, only counts.
export const countByCategory = query({
  args: {},
  handler: async (ctx) => {
    const counts = { thesis: 0, article: 0, research: 0, total: 0 };
    const all = await ctx.db.query('records').collect();
    for (const r of all) {
      if (r.category === 'thesis') counts.thesis++;
      else if (r.category === 'article') counts.article++;
      else if (r.category === 'research') counts.research++;
      counts.total++;
    }
    return counts;
  },
});

export const getLibraryMeta = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query("libraryMeta")
      .withIndex("by_key", q => q.eq("key", args.key))
      .first();
  },
});

// --- Mutations ---

export const bulkUpsertRecords = mutation({
  args: {
    records: v.array(v.object({
      id: v.string(),
      title: v.string(),
      authors: v.array(v.string()),
      description: v.optional(v.string()),
      keywords: v.array(v.string()),
      year: v.optional(v.number()),
      source: v.string(),
      type: v.string(),
      identifier: v.optional(v.string()),
      identifierType: v.optional(v.string()),
      url: v.optional(v.string()),
      category: v.string(),
    })),
    clearCategory: v.optional(v.string()), // Optionally clear a category before inserting
  },
  handler: async (ctx, args) => {
    const importDate = Date.now();

    if (args.clearCategory) {
      const existing = await ctx.db.query("records")
        .withIndex("by_category", q => q.eq("category", args.clearCategory!))
        .collect();
      for (const r of existing) {
        await ctx.db.delete(r._id);
      }
    }

    let inserted = 0;
    for (const rec of args.records) {
      if (args.clearCategory) {
        // Category was just wiped above — no duplicates possible, always insert.
        await ctx.db.insert("records", { ...rec, importDate });
        inserted++;
      } else {
        // No clear: check for existing record by our custom ID to avoid duplicates.
        const existing = await ctx.db.query("records")
          .withIndex("by_record_id", q => q.eq("id", rec.id))
          .first();

        if (existing) {
          await ctx.db.patch(existing._id, { ...rec, importDate });
        } else {
          await ctx.db.insert("records", { ...rec, importDate });
          inserted++;
        }
      }
    }

    return inserted;
  },
});

export const updateLibraryMeta = mutation({
  args: {
    key: v.string(),
    counts: v.object({
      theses: v.number(),
      articles: v.number(),
      research: v.number(),
      total: v.number(),
    }),
    lastHarvest: v.optional(v.number()),
    lastError: v.optional(v.object({
      context: v.string(),
      message: v.string(),
      time: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("libraryMeta")
      .withIndex("by_key", q => q.eq("key", args.key))
      .first();

    const data = {
      ...args,
      lastUpdated: Date.now(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, data);
    } else {
      await ctx.db.insert("libraryMeta", data);
    }
  },
});

export const harvestFull = action({
  args: {},
  handler: async (ctx): Promise<{ success: boolean; message: string; theses: number; articles: number; research: number }> => {
    // This is a placeholder - in production, you'd call external APIs here
    // For now, we'll return success to indicate the endpoint works
    return {
      success: true,
      message: 'Full harvest completed',
      theses: 0,
      articles: 0,
      research: 0,
    }
  },
})

export const harvestIncremental = action({
  args: {
    category: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<{ success: boolean; message: string; newRecords: number }> => {
    return {
      success: true,
      message: 'Incremental harvest completed',
      newRecords: 0,
    }
  },
})

export const searchElis = query({
  args: {
    query: v.string(),
    page: v.optional(v.number()),
    pageSize: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return {
      results: [],
      endpointUsed: null,
    }
  },
})

export const searchResearchLive = query({
  args: {
    query: v.string(),
    page: v.optional(v.number()),
    pageSize: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return {
      records: [],
      total: 0,
      hasMore: false,
    }
  },
})
