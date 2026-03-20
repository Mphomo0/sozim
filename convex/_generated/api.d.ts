/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as applications from "../applications.js";
import type * as categories from "../categories.js";
import type * as clerkSync from "../clerkSync.js";
import type * as courses from "../courses.js";
import type * as crons from "../crons.js";
import type * as harvest from "../harvest.js";
import type * as harvestJobs from "../harvestJobs.js";
import type * as migration from "../migration.js";
import type * as records from "../records.js";
import type * as test_helpers_backup from "../test_helpers_backup.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  applications: typeof applications;
  categories: typeof categories;
  clerkSync: typeof clerkSync;
  courses: typeof courses;
  crons: typeof crons;
  harvest: typeof harvest;
  harvestJobs: typeof harvestJobs;
  migration: typeof migration;
  records: typeof records;
  test_helpers_backup: typeof test_helpers_backup;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
