import { internalAction, action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { harvestDSpaceRepositoriesIncremental } from "../lib/harvest-dspace";
import { harvestResearchDataIncremental } from "../lib/harvest-research";
import { DSPACE_ENDPOINTS, INCREMENTAL_RECORDS, sleep } from "../lib/harvest-utils";
import { harvestDSpaceRepo } from "../lib/harvest-dspace";
import { fetchWithRetry } from "../lib/harvest-utils";

const BATCH_SIZE = 2;

export const runDailyHarvest = internalAction({
  handler: async (ctx) => {
    const start = Date.now();
    const repoIds = Object.keys(DSPACE_ENDPOINTS);
    const totalRepos = repoIds.length + 1;

    const harvestCtx = {
      runQuery: async (query: any, args: any) => {
        return await ctx.runQuery(query, args);
      },
      runMutation: async (mutation: any, args: any) => {
        return await ctx.runMutation(mutation, args);
      },
    };

    const jobId = await ctx.runMutation(internal.harvestJobs.createHarvestJobInternal, {
      type: "incremental",
      totalRepos,
    });

    try {
      await ctx.runMutation(internal.harvestJobs.startJobInternal, { jobId });

      let allTheses: any[] = [];
      let allArticles: any[] = [];
      let processedRepos = 0;

      for (let i = 0; i < repoIds.length; i += BATCH_SIZE) {
        const batch = repoIds.slice(i, i + BATCH_SIZE);

        for (const id of batch) {
          const endpoint = DSPACE_ENDPOINTS[id as keyof typeof DSPACE_ENDPOINTS];

          try {
            const testUrl = `${endpoint}?verb=ListRecords&metadataPrefix=oai_dc`;
            const testResponse = await fetchWithRetry(testUrl);

            if (!testResponse || !testResponse.includes("<record>")) {
              processedRepos++;
              continue;
            }

            const { t: theses, a: articles } = await harvestDSpaceRepo(
              id,
              endpoint,
              INCREMENTAL_RECORDS
            );
            allTheses.push(...theses);
            allArticles.push(...articles);
          } catch (err) {
            console.error(`❌ ${id} failed:`, (err as Error).message);
          }

          processedRepos++;
          await ctx.runMutation(internal.harvestJobs.updateJobProgressInternal, {
            jobId,
            currentRepo: id,
            processedRepos,
            totalRepos,
            results: {
              theses: allTheses.length,
              articles: allArticles.length,
              research: 0,
            },
          });

          await sleep(800);
        }
      }

      const researchCount = await harvestResearchDataIncremental(harvestCtx);
      processedRepos++;

      await ctx.runMutation(internal.harvestJobs.updateJobProgressInternal, {
        jobId,
        currentRepo: "research",
        processedRepos,
        totalRepos,
        results: {
          theses: allTheses.length,
          articles: allArticles.length,
          research: researchCount,
        },
      });

      if (allTheses.length > 0 || allArticles.length > 0) {
        await ctx.runMutation(internal.records.bulkUpsertRecordsInternal, {
          records: allTheses.map((r: any) => ({ ...r, category: "thesis" })),
        });

        await ctx.runMutation(internal.records.bulkUpsertRecordsInternal, {
          records: allArticles.map((r: any) => ({ ...r, category: "article" })),
        });
      }

      const counts = await ctx.runQuery(internal.records.countByCategoryInternal, {});
      await ctx.runMutation(internal.records.updateLibraryMetaInternal, {
        key: "main",
        counts: {
          theses: counts.thesis,
          articles: counts.article,
          research: counts.research,
          total: counts.total,
        },
        lastHarvest: Date.now(),
      });

      const finalResults = {
        theses: allTheses.length,
        articles: allArticles.length,
        research: researchCount,
      };

      await ctx.runMutation(internal.harvestJobs.completeJobInternal, {
        jobId,
        results: finalResults,
      });

      const duration = Math.round((Date.now() - start) / 1000);
      console.log(
        `✅ Daily harvest completed in ${duration}s:`,
        JSON.stringify(finalResults)
      );
    } catch (error) {
      console.error("Harvest error:", error);
      await ctx.runMutation(internal.harvestJobs.failJobInternal, {
        jobId,
        error: (error as Error).message,
      });
    }
  },
});

export const manualHarvest = action({
  args: {
    type: v.optional(v.union(v.literal("full"), v.literal("incremental"))),
  },
  handler: async (ctx, args): Promise<{ success: boolean; message: string; jobId: string }> => {
    try {
      const repoIds = Object.keys(DSPACE_ENDPOINTS);
      const totalRepos = repoIds.length + 1;

      const jobId = await ctx.runMutation(internal.harvestJobs.createHarvestJobInternal, {
        type: args.type || "full",
        totalRepos,
      });

      await ctx.runAction(internal.harvest.runDailyHarvest);

      return {
        success: true,
        message: `Manual ${args.type || 'full'} harvest initiated`,
        jobId,
      };
    } catch (error) {
      console.error("Manual harvest error:", error);
      return {
        success: false,
        message: (error as Error).message || 'Manual harvest failed',
        jobId: '',
      };
    }
  },
});
