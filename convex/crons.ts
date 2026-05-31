import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "daily-incremental-harvest",
  { hourUTC: 2, minuteUTC: 0 },
  internal.harvest.runDailyHarvest
);

crons.daily(
  "daily-chatbot-cleanup",
  { hourUTC: 3, minuteUTC: 0 },
  internal.chatbot.cleanupExpiredChats
);

crons.weekly(
  "weekly-website-reindex",
  { dayOfWeek: "sunday", hourUTC: 4, minuteUTC: 0 },
  internal.websiteIndexer.autoReindexWebsite
);

export default crons;
