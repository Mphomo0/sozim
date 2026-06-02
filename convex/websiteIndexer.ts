import { v } from 'convex/values'
import {
  action,
  query,
  internalAction,
  internalMutation,
  internalQuery,
} from './_generated/server'
import { api, internal } from './_generated/api'
import { hashContent, splitIntoChunks } from '../lib/text-utils'

const STATIC_PAGES = [
  {
    url: '/',
    title: 'Sozim | Accredited Education & Training College Bloemfontein',
    content: `Sozim Trading and Consultancy is an accredited education and training college based in Bloemfontein, South Africa. We offer SAQA-aligned programmes in Library and Information Science, ETD (Education, Training and Development), and professional skills development. Our courses include Occupational Certificate in Library Assistant, Learning and Development Facilitator, Assessment Practitioner, and various ETDP SETA Skills Programmes. We provide career pathways education, skills training, and professional certificates.`,
  },
  {
    url: '/about',
    title: 'About Sozim | Accredited Education & Training College',
    content: `Sozim Trading and Consultancy is an accredited education and training college located in Bloemfontein, Free State, South Africa. We are committed to providing quality education and training that is aligned with SAQA standards. Our institution offers a range of programmes designed to equip learners with the skills and knowledge needed for successful careers. We focus on Library and Information Science (LIS), Education, Training and Development (ETD), and professional skills programmes. Our campus is located in Bloemfontein, South Africa.`,
  },
  {
    url: '/contact',
    title: 'Contact Sozim | Get in Touch',
    content: `Contact Sozim Trading and Consultancy. We are situated in Bloemfontein, Free State, South Africa. Our physical address is Shop 4, Sunday School Building, 154 Charlotte Maxeke Street, Bloemfontein. You can contact us through our website contact form, request a call back, or visit our campus in person. We are located in the city centre of Bloemfontein. Use our contact form or call me back service to learn more about our accredited courses and programmes.`,
  },
  {
    url: '/campus',
    title: 'Sozim Campus | Bloemfontein',
    content: `Sozim Trading and Consultancy is situated in Bloemfontein, Free State, South Africa. Our campus is located at Shop 4, Sunday School Building, 154 Charlotte Maxeke Street, Bloemfontein. This is our physical address where students can attend face-to-face classes. We are based in the city centre of Bloemfontein. Our campus location is accessible by public transport with parking facilities nearby. Students can visit us at our Bloemfontein campus for contact learning, in-person classes, and student support. We offer both contact (in-person) learning and online learning options, making our programmes accessible to students across South Africa.`,
  },
  {
    url: '/career-pathway',
    title: 'Career Pathways at Sozim',
    content: `Sozim Trading and Consultancy offers career pathway programmes in Library and Information Science and Education, Training and Development. Our career pathways include the Occupational Certificate in Library Assistant, Learning and Development Facilitator, Assessment Practitioner, and various ETDP SETA Skills Programmes including Outcome-Based Assessment, Facilitation Using Given Methodologies, and Conduct Outcome-Based Moderation. These programmes are designed to provide clear career progression in the library and education sectors.`,
  },
  {
    url: '/contact-learning',
    title: 'Contact Learning at Sozim',
    content: `Contact learning programmes at Sozim Trading and Consultancy. We offer contact learning options for our accredited courses in Bloemfontein. Students can attend classes in person at our campus. Contact learning provides direct interaction with instructors and fellow students for a comprehensive educational experience.`,
  },
  {
    url: '/library',
    title: 'Library at Sozim | Research Resources',
    content: `Sozim Trading and Consultancy provides library and research resources for students and researchers. Our library services include access to academic research materials, theses, articles, and research publications. We support our students with the resources they need for their studies in Library and Information Science and other programmes.`,
  },
  {
    url: '/apply',
    title: 'Apply to Sozim | Online Application',
    content: `Apply to Sozim Trading and Consultancy for our accredited courses and programmes. We accept applications for our Occupational Certificate in Library Assistant, Learning and Development Facilitator, Assessment Practitioner, and ETDP SETA Skills Programmes. Our online application process allows you to apply for courses at our Bloemfontein campus.`,
  },
  {
    url: '/privacy-policy',
    title: 'Privacy Policy | Sozim',
    content: `Sozim Trading and Consultancy privacy policy outlines how we collect, use, and protect your personal information when you use our website and services. We are committed to protecting your privacy and ensuring the security of your personal data.`,
  },
  {
    url: '/terms-of-service',
    title: 'Terms of Service | Sozim',
    content: `Sozim Trading and Consultancy terms of service govern the use of our website, courses, and educational services. By using our services, you agree to comply with these terms. We provide accredited education and training programmes in Bloemfontein, South Africa.`,
  },
  {
    url: '/welcome-message',
    title: 'Welcome to Sozim',
    content: `Welcome to Sozim Trading and Consultancy. We are an accredited education and training college in Bloemfontein, South Africa. We offer quality programmes in Library and Information Science, Education Training and Development, and professional skills development. Our mission is to equip learners with the skills and knowledge they need for successful careers.`,
  },
  {
    url: '/portal',
    title: 'Student Portal | Sozim',
    content: `Sozim Trading and Consultancy student portal provides access to your learner dashboard, courses, progress tracking, and account details. Students can log in to access their course materials, track their academic progress, and manage their applications.`,
  },
  {
    url: '/call-me-back',
    title: 'Call Me Back | Sozim',
    content: `Request a call back from Sozim Trading and Consultancy. Fill in your details and we will call you back to discuss our accredited courses, programmes, and admission requirements. We are based in Bloemfontein, South Africa.`,
  },
  {
    url: '/shop',
    title: 'Sozim Store',
    content: `Sozim Trading and Consultancy online store. Browse and purchase educational resources, merchandise, and materials from our store.`,
  },
]

export const getChunksByUrl = internalQuery({
  args: { url: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('websiteContentChunks')
      .withIndex('by_url', (q) => q.eq('url', args.url))
      .collect()
  },
})

export const getAllContentChunks = internalQuery({
  handler: async (ctx) => {
    return await ctx.db.query('websiteContentChunks').collect()
  },
})

export const insertContentChunk = internalMutation({
  args: {
    url: v.string(),
    title: v.string(),
    content: v.string(),
    contentHash: v.string(),
    type: v.union(
      v.literal('page'),
      v.literal('blog'),
      v.literal('service'),
      v.literal('product'),
      v.literal('faq'),
      v.literal('other'),
    ),
    indexedAt: v.number(),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('websiteContentChunks', args)
  },
})

export const deleteChunk = internalMutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const normalizedId = ctx.db.normalizeId('websiteContentChunks', args.id)
    if (normalizedId) {
      await ctx.db.delete(normalizedId)
    }
  },
})

export const indexFromConvexData = internalMutation({
  handler: async (ctx) => {
    const now = Date.now()
    let totalChunksCreated = 0
    let totalChunksDeleted = 0
    let pagesIndexed = 0
    const validUrls: string[] = []

    const allExisting = await ctx.db.query('websiteContentChunks').collect()
    const existingByUrl = new Map<string, typeof allExisting>()
    for (const chunk of allExisting) {
      const existing = existingByUrl.get(chunk.url) || []
      existing.push(chunk)
      existingByUrl.set(chunk.url, existing)
    }

    async function indexContent(
      url: string,
      title: string,
      content: string,
      type: 'page' | 'blog' | 'service' | 'product' | 'faq' | 'other',
      existingChunks: typeof allExisting,
    ) {
      validUrls.push(url)
      const contentChunks = splitIntoChunks(content, 1000)

      const existingByHash = new Map<string, string>()
      for (const chunk of existingChunks) {
        existingByHash.set(chunk.contentHash, chunk._id)
      }

      const newChunks: {
        url: string
        title: string
        content: string
        contentHash: string
        type: 'page' | 'blog' | 'service' | 'product' | 'faq' | 'other'
        indexedAt: number
        updatedAt: number
      }[] = []
      const seenHashes = new Set<string>()

      for (const contentText of contentChunks) {
        const contentH = hashContent(contentText)
        if (seenHashes.has(contentH)) continue
        seenHashes.add(contentH)

        const existingId = existingByHash.get(contentH)
        if (existingId) {
          existingByHash.delete(contentH)
          continue
        }

        newChunks.push({
          url,
          title: title || url,
          content: contentText,
          contentHash: contentH,
          type,
          indexedAt: now,
          updatedAt: now,
        })
      }

      for (const [, chunkId] of existingByHash) {
        const normalizedId = ctx.db.normalizeId('websiteContentChunks', chunkId)
        if (normalizedId) {
          await ctx.db.delete(normalizedId)
          totalChunksDeleted++
        }
      }

      for (const chunk of newChunks) {
        await ctx.db.insert('websiteContentChunks', chunk)
        totalChunksCreated++
      }

      pagesIndexed++
    }

    // Index static pages
    for (const page of STATIC_PAGES) {
      const existing = existingByUrl.get(page.url) || []
      await indexContent(page.url, page.title, page.content, 'page', existing)
    }

    // Index courses
    try {
      const courses = await ctx.db.query('courses').collect()
      for (const course of courses) {
        const courseUrl = `/courses/${course._id}`
        let content = `${course.name} (${course.code})`
        content += `\n\n${course.description || ''}`
        content += `\n\nDuration: ${course.duration}`
        if (course.level) content += `\n\nLevel: ${course.level}`

        if (course.entryRequirements?.length) {
          content += `\n\nEntry Requirements:\n`
          content += course.entryRequirements.map((r) => `- ${r}`).join('\n')
        }

        if (course.modules?.knowledgeModules?.length) {
          content += `\n\nKnowledge Modules:\n`
          for (const m of course.modules.knowledgeModules) {
            if (m.title)
              content += `- ${m.title} (${m.credits || 0} credits, NQF Level ${m.nqfLevel || ''})\n`
          }
        }

        if (course.modules?.practicalSkillModules?.length) {
          content += `\n\nPractical Skill Modules:\n`
          for (const m of course.modules.practicalSkillModules) {
            if (m.title)
              content += `- ${m.title} (${m.credits || 0} credits, NQF Level ${m.nqfLevel || ''})\n`
          }
        }

        if (course.modules?.workExperienceModules?.length) {
          content += `\n\nWork Experience Modules:\n`
          for (const m of course.modules.workExperienceModules) {
            if (m.title)
              content += `- ${m.title} (${m.credits || 0} credits, NQF Level ${m.nqfLevel || ''})\n`
          }
        }

        const existing = existingByUrl.get(courseUrl) || []
        await indexContent(courseUrl, course.name, content, 'service', existing)
      }
    } catch (err) {
      console.error('[websiteIndexer] Failed to index courses:', err)
    }

    // Index news posts
    try {
      const newsPosts = await ctx.db
        .query('newsPosts')
        .withIndex('by_status_publishedAt', (q) => q.eq('status', 'published'))
        .collect()

      for (const post of newsPosts) {
        const postUrl = `/news/${post.slug}`
        let content = post.title
        if (post.excerpt) content += `\n\n${post.excerpt}`
        content += `\n\n${post.content || ''}`

        const existing = existingByUrl.get(postUrl) || []
        await indexContent(postUrl, post.title, content, 'blog', existing)
      }
    } catch (err) {
      console.error('[websiteIndexer] Failed to index news posts:', err)
    }

    // Delete chunks for URLs that no longer exist
    const urlSet = new Set(validUrls)
    const allStored = await ctx.db.query('websiteContentChunks').collect()
    for (const chunk of allStored) {
      if (!urlSet.has(chunk.url)) {
        await ctx.db.delete(chunk._id)
        totalChunksDeleted++
      }
    }

    // Clean up old indexing logs
    const allLogs = await ctx.db
      .query('indexingLogs')
      .withIndex('by_startedAt')
      .order('desc')
      .collect()

    if (allLogs.length > 100) {
      const toDelete = allLogs.slice(100)
      for (const log of toDelete) {
        await ctx.db.delete(log._id)
      }
    }

    return {
      success: true,
      pagesIndexed,
      chunksCreated: totalChunksCreated,
      chunksDeleted: totalChunksDeleted,
    }
  },
})

export const manualReindexWebsite = action({
  handler: async (
    ctx,
  ): Promise<{
    success: boolean
    pagesIndexed: number
    chunksCreated: number
    chunksDeleted: number
  }> => {
    const now = Date.now()
    const logId = await ctx.runMutation(
      internal.websiteIndexer.createIndexingLog,
      {
        status: 'running',
        startedAt: now,
      },
    )

    try {
      const result = await ctx.runMutation(
        internal.websiteIndexer.indexFromConvexData,
      )

      await ctx.runMutation(internal.websiteIndexer.updateIndexingLog, {
        logId,
        status: 'success',
        finishedAt: Date.now(),
        pagesIndexed: result.pagesIndexed,
        chunksCreated: result.chunksCreated,
        chunksDeleted: result.chunksDeleted,
      })

      return result
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown indexing error'

      await ctx.runMutation(internal.websiteIndexer.updateIndexingLog, {
        logId,
        status: 'failed',
        finishedAt: Date.now(),
        error: errorMessage,
      })

      throw err
    }
  },
})

export const autoReindexWebsite = internalAction({
  handler: async (
    ctx,
  ): Promise<{
    success: boolean
    pagesIndexed: number
    chunksCreated: number
    chunksDeleted: number
  }> => {
    const now = Date.now()
    const logId = await ctx.runMutation(
      internal.websiteIndexer.createIndexingLog,
      {
        status: 'running',
        startedAt: now,
      },
    )

    try {
      const result = await ctx.runMutation(
        internal.websiteIndexer.indexFromConvexData,
      )

      await ctx.runMutation(internal.websiteIndexer.updateIndexingLog, {
        logId,
        status: 'success',
        finishedAt: Date.now(),
        pagesIndexed: result.pagesIndexed,
        chunksCreated: result.chunksCreated,
        chunksDeleted: result.chunksDeleted,
      })

      return result
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown indexing error'

      await ctx.runMutation(internal.websiteIndexer.updateIndexingLog, {
        logId,
        status: 'failed',
        finishedAt: Date.now(),
        error: errorMessage,
      })

      throw err
    }
  },
})

export const createIndexingLog = internalMutation({
  args: {
    status: v.union(
      v.literal('success'),
      v.literal('failed'),
      v.literal('running'),
    ),
    startedAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('indexingLogs', {
      status: args.status,
      startedAt: args.startedAt,
    })
  },
})

export const updateIndexingLog = internalMutation({
  args: {
    logId: v.id('indexingLogs'),
    status: v.union(
      v.literal('success'),
      v.literal('failed'),
      v.literal('running'),
    ),
    finishedAt: v.optional(v.number()),
    pagesIndexed: v.optional(v.number()),
    chunksCreated: v.optional(v.number()),
    chunksDeleted: v.optional(v.number()),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.logId, {
      status: args.status,
      finishedAt: args.finishedAt,
      pagesIndexed: args.pagesIndexed,
      chunksCreated: args.chunksCreated,
      chunksDeleted: args.chunksDeleted,
      error: args.error,
    })
  },
})

export const getIndexingStatus = query({
  handler: async (ctx) => {
    const logs = await ctx.db
      .query('indexingLogs')
      .withIndex('by_startedAt')
      .order('desc')
      .take(5)

    return logs
  },
})

export const getStoredContentStats = query({
  handler: async (ctx) => {
    const chunks = await ctx.db.query('websiteContentChunks').collect()
    const urls = new Set(chunks.map((c) => c.url))

    const latestLog = await ctx.db
      .query('indexingLogs')
      .withIndex('by_startedAt')
      .order('desc')
      .first()

    return {
      totalChunks: chunks.length,
      totalPages: urls.size,
      lastIndexed: latestLog?.finishedAt || null,
      lastStatus: latestLog?.status || null,
      lastIndexingLog: latestLog || null,
    }
  },
})
