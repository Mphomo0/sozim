import { query } from './_generated/server'
import { v } from 'convex/values'

export const testApplicationResolver = query({
  args: { id: v.id('applications') },
  handler: async (ctx, args) => {
    const app = await ctx.db.get(args.id)
    if (!app) return null

    const user = app.actualApplicantId
      ? await ctx.db.get(app.actualApplicantId)
      : await ctx.db.query('users')
          .withIndex('by_mongo_id', q => q.eq('mongoId', app.applicantId))
          .first()

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

export const testUserResolver = query({
  args: { id: v.union(v.id('users'), v.string()) },
  handler: async (ctx, args) => {
    try {
      const normalizedId = ctx.db.normalizeId('users', args.id)
      if (normalizedId) {
        return await ctx.db.get(normalizedId)
      }
    } catch (e) {
      // Try legacy lookup
      return await ctx.db.query('users')
        .withIndex('by_mongo_id', q => q.eq('mongoId', args.id))
        .first()
    }
    return null
  },
})