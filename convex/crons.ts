import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "daily-incremental-harvest",
  { hourUTC: 2, minuteUTC: 0 },
  internal.harvest.runDailyHarvest
);

export default crons;
