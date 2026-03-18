import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

const _convexClient = convexUrl ? new ConvexHttpClient(convexUrl) : undefined;

export const convexClient = (() => {
  if (!_convexClient) {
    if (typeof window === "undefined") {
      throw new Error("NEXT_PUBLIC_CONVEX_URL is not set. Ensure it is defined in your environment.");
    }
  }
  return _convexClient!;
})();

export { api };
