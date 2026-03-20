import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const getApplications = query({
  args: { 
    page: v.optional(v.number()), 
    limit: v.optional(v.number()),
    status: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    let applicationsQuery = ctx.db.query('applications')
    if (args.status) {
      applicationsQuery = applicationsQuery.filter(q => q.eq(q.field('status'), args.status))
    }
    const applications = await applicationsQuery.collect()

    // Join with user data
    return await Promise.all(
      applications.map(async (app) => {
        const user = app.actualApplicantId 
          ? await ctx.db.get(app.actualApplicantId)
          : await ctx.db.query('users')
              .withIndex('by_mongo_id', q => q.eq('mongoId', app.applicantId))
              .first()
        
        return {
          ...app,
          user: user ? {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            clerkId: user.clerkId,
          } : null
        }
      })
    )
  },
})

export const getApplicationsByUserId = query({
  args: { 
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Get user by clerkId
    const user = await ctx.db.query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', args.clerkId))
      .first()

    if (!user) return []

    // 2. Get applications (prefer actualApplicantId index)
    return await ctx.db.query('applications')
      .withIndex('by_user', q => q.eq('actualApplicantId', user._id))
      .collect()
  },
})

export const getApplicationById = query({
  args: { id: v.id('applications') },
  handler: async (ctx, args) => {
    const app = await ctx.db.get(args.id)
    if (!app) return null

    let user = null

    // 1. Try clerkId first (primary lookup method)
    if (app.clerkId) {
      user = await ctx.db.query('users')
        .withIndex('by_clerk_id', q => q.eq('clerkId', app.clerkId))
        .first()
    }
    
    // 2. Try actualApplicantId (Convex ID)
    if (!user && app.actualApplicantId) {
      user = await ctx.db.get(app.actualApplicantId)
    }
    
    // 3. Try applicantId as mongoId
    if (!user && app.applicantId) {
      user = await ctx.db.query('users')
        .withIndex('by_mongo_id', q => q.eq('mongoId', app.applicantId))
        .first()
    }
    
    return {
      ...app,
      user: user ? {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        alternativeNumber: user.alternativeNumber,
        clerkId: user.clerkId,
        idNumber: user.idNumber,
        address: user.address,
        nationality: user.nationality,
        dob: user.dob,
      } : null
    }
  },
})

export const checkExistingApplication = query({
  args: { 
    applicantId: v.string(), // can be convex id or mongo id
    courseId: v.string(), // can be convex id or mongo id
  },
  handler: async (ctx, args) => {
    // Try to find normalized IDs
    const userConvexId = ctx.db.normalizeId('users', args.applicantId)
    const courseConvexId = ctx.db.normalizeId('courses', args.courseId)

    // Check by actual IDs first (most efficient)
    if (userConvexId && courseConvexId) {
      const existing = await ctx.db.query('applications')
        .withIndex('by_user', q => q.eq('actualApplicantId', userConvexId))
        .filter(q => q.eq(q.field('actualCourseId'), courseConvexId))
        .first()
      if (existing) return true
    }

    // Fallback to mongo IDs or mixed
    const existing = await ctx.db.query('applications')
      .filter(q => 
        (q.eq(q.field('applicantId'), args.applicantId) && q.eq(q.field('courseId'), args.courseId)) ||
        (userConvexId && q.eq(q.field('actualApplicantId'), userConvexId) && q.eq(q.field('courseId'), args.courseId)) ||
        (courseConvexId && q.eq(q.field('applicantId'), args.applicantId) && q.eq(q.field('actualCourseId'), courseConvexId))
      )
      .first()
    
    return !!existing
  },
})

export const createApplication = mutation({
  args: {
    applicantId: v.string(), // Convex ID
    clerkId: v.string(), // Clerk ID for user lookup
    courseId: v.string(),    // Mongo ID from frontend
    status: v.optional(v.string()),
    documents: v.optional(v.array(v.any())),
    data: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { data, ...rest } = args

    // 1. Resolve Course
    const course = await ctx.db.query('courses')
      .withIndex('by_mongo_id', q => q.eq('mongoId', args.courseId))
      .first()
    
    const courseConvexId = course?._id

    // 2. Resolve User
    const userConvexId = ctx.db.normalizeId('users', args.applicantId)
    if (!userConvexId) {
      throw new Error('Invalid applicant ID')
    }

    // 3. Get user to verify clerkId
    const user = await ctx.db.get(userConvexId)
    const clerkId = user?.clerkId || args.clerkId

    // 4. Check existing
    const existing = await ctx.db.query('applications')
      .withIndex('by_user', q => q.eq('actualApplicantId', userConvexId))
      .filter(q => 
        q.eq(q.field('courseId'), args.courseId) || 
        (courseConvexId && q.eq(q.field('actualCourseId'), courseConvexId))
      )
      .first()

    if (existing) {
      throw new Error('You have already applied for this course. You cannot apply for the same course twice.')
    }

    return await ctx.db.insert('applications', {
      ...rest,
      ...(data || {}),
      applicantId: args.applicantId,
      actualApplicantId: userConvexId,
      clerkId: clerkId,
      actualCourseId: courseConvexId,
      status: rest.status || 'PENDING',
      createdAt: Date.now(),
    })
  },
})

export const updateApplication = mutation({
  args: {
    id: v.id('applications'),
    status: v.optional(v.string()),
    data: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { id, data, ...rest } = args
    await ctx.db.patch(id, {
      ...rest,
      ...(data || {})
    })
    return await ctx.db.get(id)
  },
})

export const deleteApplication = mutation({
  args: { id: v.id('applications') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
    return true
  },
})

export const getDashboardStats = query({
  args: { year: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const year = args.year || new Date().getFullYear()
    const startDate = new Date(year, 0, 1).getTime()
    const endDate = new Date(year + 1, 0, 1).getTime()

    const allApplications = await ctx.db.query('applications').collect()
    const allUsers = await ctx.db.query('users').collect()

    const filteredApps = allApplications.filter(
      app => {
        const createdAt = app.createdAt
        if (!createdAt) return false
        const ts = typeof createdAt === 'number' ? createdAt : new Date(createdAt).getTime()
        return ts >= startDate && ts < endDate
      }
    )

    const totalUsers = allUsers.filter(u => u.role === 'USER').length
    const totalApplications = filteredApps.length
    const totalPending = filteredApps.filter(app => app.status === 'PENDING').length
    const totalApproved = filteredApps.filter(app => app.status === 'APPROVED').length
    const totalRejected = filteredApps.filter(app => app.status === 'REJECTED').length

    const yearTrendMap = new Map<number, { pending: number; approved: number; rejected: number; count: number }>()
    for (const app of allApplications) {
      if (app.createdAt) {
        const ts = typeof app.createdAt === 'number' ? app.createdAt : new Date(app.createdAt).getTime()
        const appYear = new Date(ts).getFullYear()
        const existing = yearTrendMap.get(appYear) || { pending: 0, approved: 0, rejected: 0, count: 0 }
        existing.count++
        if (app.status === 'PENDING') existing.pending++
        if (app.status === 'APPROVED') existing.approved++
        if (app.status === 'REJECTED') existing.rejected++
        yearTrendMap.set(appYear, existing)
      }
    }

    const yearTrend = Array.from(yearTrendMap.entries())
      .map(([year, data]) => ({ _id: year, ...data }))
      .sort((a, b) => a._id - b._id)

    return {
      totalUsers,
      totalApplications,
      totalPending,
      totalApproved,
      totalRejected,
      yearTrend,
    }
  },
})
