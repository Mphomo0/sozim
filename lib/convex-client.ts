import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

export const getConvexClient = () => {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    if (typeof window === "undefined") {
      return undefined;
    }
    throw new Error("NEXT_PUBLIC_CONVEX_URL is not set. Ensure it is defined in your environment.");
  }
  return new ConvexHttpClient(url);
};

export { api };
