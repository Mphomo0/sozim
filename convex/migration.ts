import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const executeMigration = mutation({
  args: {},
  handler: async (ctx) => {
    let replacedCount = 0;

    // 1. Link Courses to CourseCategories
    const courses = await ctx.db.query("courses").collect();
    for (const course of courses) {
      if (!course.actualCategoryId && course.categoryId) {
        // Find category
        const category = await ctx.db
          .query("courseCategories")
          .withIndex("by_mongo_id", (q) => q.eq("mongoId", course.categoryId))
          .first();

        if (category) {
          await ctx.db.patch(course._id, {
            actualCategoryId: category._id,
          });
          replacedCount++;
        }
      }
    }

    // 2. Link Applications to Users and Courses
    const applications = await ctx.db.query("applications").collect();
    for (const app of applications) {
      const updates: any = {};

      if (!app.actualApplicantId && app.applicantId) {
        const user = await ctx.db
          .query("users")
          .withIndex("by_mongo_id", (q) => q.eq("mongoId", app.applicantId))
          .first();
        if (user) updates.actualApplicantId = user._id;
      }

      if (!app.actualCourseId && app.courseId) {
        const course = await ctx.db
          .query("courses")
          .withIndex("by_mongo_id", (q) => q.eq("mongoId", app.courseId))
          .first();
        if (course) updates.actualCourseId = course._id;
      }

      if (Object.keys(updates).length > 0) {
        await ctx.db.patch(app._id, updates);
        replacedCount++;
      }
    }

    // 3. Optional: Map arrays of ids (user.applications, course.applications)
    // We actually don't strongly need this if we query relations by fetching `app.actualApplicantId === user._id`
    // which is much safer than maintaining arrays.

    return { success: true, relationsUpdated: replacedCount };
  },
});

export const setClerkId = mutation({
  args: { mongoId: v.string(), clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_mongo_id", (q) => q.eq("mongoId", args.mongoId))
      .first();
      
    if (user) {
      await ctx.db.patch(user._id, { clerkId: args.clerkId });
      return true;
    }
    return false;
  }
});
