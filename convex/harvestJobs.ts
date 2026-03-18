import { internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createHarvestJob = mutation({
  args: {
    type: v.string(),
    totalRepos: v.number(),
  },
  handler: async (ctx, args) => {
    const jobId = await ctx.db.insert("harvestJobs", {
      type: args.type,
      status: "pending",
      progress: 0,
      totalRepos: args.totalRepos,
      processedRepos: 0,
      results: { theses: 0, articles: 0, research: 0 },
      startedAt: Date.now(),
    });
    return jobId;
  },
});

export const startJob = mutation({
  args: { jobId: v.id("harvestJobs") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.jobId, { status: "running" });
  },
});

export const updateJobProgress = mutation({
  args: {
    jobId: v.id("harvestJobs"),
    currentRepo: v.string(),
    processedRepos: v.number(),
    totalRepos: v.number(),
    results: v.object({
      theses: v.number(),
      articles: v.number(),
      research: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const progress = Math.round((args.processedRepos / args.totalRepos) * 100);
    await ctx.db.patch(args.jobId, {
      currentRepo: args.currentRepo,
      processedRepos: args.processedRepos,
      progress,
      results: args.results,
    });
  },
});

export const completeJob = mutation({
  args: {
    jobId: v.id("harvestJobs"),
    results: v.object({
      theses: v.number(),
      articles: v.number(),
      research: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.jobId, {
      status: "completed",
      progress: 100,
      completedAt: Date.now(),
      results: args.results,
    });
  },
});

export const failJob = mutation({
  args: {
    jobId: v.id("harvestJobs"),
    error: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.jobId, {
      status: "failed",
      completedAt: Date.now(),
      error: args.error,
    });
  },
});

export const getLatestJob = query({
  args: { type: v.string() },
  handler: async (ctx, args) => {
    const jobs = await ctx.db
      .query("harvestJobs")
      .filter((q) => q.eq(q.field("type"), args.type))
      .order("desc")
      .take(1);
    return jobs[0] || null;
  },
});

export const getJobStatus = query({
  args: { jobId: v.id("harvestJobs") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.jobId);
  },
});

export const createHarvestJobInternal = internalMutation({
  args: {
    type: v.string(),
    totalRepos: v.number(),
  },
  handler: async (ctx, args) => {
    const jobId = await ctx.db.insert("harvestJobs", {
      type: args.type,
      status: "pending",
      progress: 0,
      totalRepos: args.totalRepos,
      processedRepos: 0,
      results: { theses: 0, articles: 0, research: 0 },
      startedAt: Date.now(),
    });
    return jobId;
  },
});

export const startJobInternal = internalMutation({
  args: { jobId: v.id("harvestJobs") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.jobId, { status: "running" });
  },
});

export const updateJobProgressInternal = internalMutation({
  args: {
    jobId: v.id("harvestJobs"),
    currentRepo: v.string(),
    processedRepos: v.number(),
    totalRepos: v.number(),
    results: v.object({
      theses: v.number(),
      articles: v.number(),
      research: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const progress = Math.round((args.processedRepos / args.totalRepos) * 100);
    await ctx.db.patch(args.jobId, {
      currentRepo: args.currentRepo,
      processedRepos: args.processedRepos,
      progress,
      results: args.results,
    });
  },
});

export const completeJobInternal = internalMutation({
  args: {
    jobId: v.id("harvestJobs"),
    results: v.object({
      theses: v.number(),
      articles: v.number(),
      research: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.jobId, {
      status: "completed",
      progress: 100,
      completedAt: Date.now(),
      results: args.results,
    });
  },
});

export const failJobInternal = internalMutation({
  args: {
    jobId: v.id("harvestJobs"),
    error: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.jobId, {
      status: "failed",
      completedAt: Date.now(),
      error: args.error,
    });
  },
});

export const getLatestJobInternal = internalQuery({
  args: { type: v.string() },
  handler: async (ctx, args) => {
    const jobs = await ctx.db
      .query("harvestJobs")
      .filter((q) => q.eq(q.field("type"), args.type))
      .order("desc")
      .take(1);
    return jobs[0] || null;
  },
});

export const getJobStatusInternal = internalQuery({
  args: { jobId: v.id("harvestJobs") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.jobId);
  },
});
