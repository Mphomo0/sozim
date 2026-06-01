import { v } from "convex/values";
import { query, mutation, action, internalMutation, internalAction } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { tokenize } from "../lib/text-utils";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const MAX_MESSAGE_LENGTH = 500;
const MAX_MESSAGES_PER_SESSION = 30;
const MAX_CHUNKS_CONTEXT = 8;

const PER_MODEL_RETRIES = 1;
const PER_MODEL_BACKOFF_MS = 1000;
const FALLBACK_LOOKAHEAD = 2;

function isFreeModel(id: string): boolean {
  return id.endsWith(":free") || id === "openrouter/free";
}

function loadFreeModels(): string[] {
  const raw = process.env.OPENROUTER_MODELS || "";
  const list = raw
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);

  for (const m of list) {
    if (!isFreeModel(m)) {
      throw new Error(
        `OPENROUTER_MODELS contains a non-free model "${m}". Only :free variants or "openrouter/free" are allowed.`,
      );
    }
  }
  return list;
}

export const getChatHistory = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    return messages
      .sort((a, b) => a.createdAt - b.createdAt)
      .map((m) => ({
        _id: m._id,
        role: m.role,
        message: m.message,
        createdAt: m.createdAt,
      }));
  },
});

export const getSessionCount = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    return messages.length;
  },
});

export const createChatSession = mutation({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const now = Date.now();

    const existing = await ctx.db
      .query("chatSessions")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .first();

    if (existing) {
      return existing;
    }

    return await ctx.db.insert("chatSessions", {
      sessionId: args.sessionId,
      createdAt: now,
      updatedAt: now,
      expiresAt: now + THIRTY_DAYS_MS,
    });
  },
});

export const saveMessage = internalMutation({
  args: {
    sessionId: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const session = await ctx.db
      .query("chatSessions")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .first();

    if (session) {
      await ctx.db.patch(session._id, { updatedAt: now });
    }

    return await ctx.db.insert("chatMessages", {
      sessionId: args.sessionId,
      role: args.role,
      message: args.message,
      createdAt: now,
      expiresAt: now + THIRTY_DAYS_MS,
    });
  },
});

export const sendChatMessage = action({
  args: {
    sessionId: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const trimmed = args.message.trim();

    if (!trimmed) {
      throw new Error("Message cannot be empty.");
    }

    if (trimmed.length > MAX_MESSAGE_LENGTH) {
      throw new Error(`Message is too long. Maximum ${MAX_MESSAGE_LENGTH} characters.`);
    }

    const msgCount = await ctx.runQuery(api.chatbot.getSessionCount, {
      sessionId: args.sessionId,
    });

    if (msgCount >= MAX_MESSAGES_PER_SESSION * 2) {
      throw new Error("Message limit reached for this session.");
    }

    await ctx.runMutation(internal.chatbot.saveMessage, {
      sessionId: args.sessionId,
      role: "user",
      message: trimmed,
    });

    const relevantChunks = await ctx.runQuery(api.chatbot.searchContentChunks, {
      query: trimmed,
    });

    let answer: string = "I\u2019m not sure based on the information available on the website. Please contact Sozim directly for confirmation.";

    if (!relevantChunks || relevantChunks.length === 0) {
      answer = "I\u2019m not sure based on the information available on the website. Please contact Sozim directly for confirmation.";
    } else {
      const context = relevantChunks
        .map((c) => `[Source: ${c.title} (${c.url})]\n${c.content}`)
        .join("\n\n---\n\n");

      const prompt = `You are the official chatbot assistant for Sozim.

You must answer using only the website content provided below.

Do not make up information.
Do not answer from general knowledge.
Do not claim Sozim offers something unless it is clearly supported by the provided website content.

If the answer is not found in the provided content, reply exactly:

"I\u2019m not sure based on the information available on the website. Please contact Sozim directly for confirmation."

Keep answers short, helpful, and professional.

Website content:
${context}

User question:
${trimmed}`;

      const openrouterKey = process.env.OPENROUTER_API_KEY;
      if (!openrouterKey) {
        throw new Error("OpenRouter API key is not configured.");
      }

      const models = loadFreeModels();
      if (models.length === 0) {
        throw new Error("No free models configured. Set OPENROUTER_MODELS in your environment.");
      }

      const FALLBACK_MESSAGE = "I\u2019m not sure based on the information available on the website. Please contact Sozim directly for confirmation.";
      answer = FALLBACK_MESSAGE;
      let served = false;
      let lastError = "";

      for (let i = 0; i < models.length && !served; i++) {
        const primary = models[i];
        const nativeFallbacks = models.slice(i + 1, i + 1 + FALLBACK_LOOKAHEAD);
        const modelsField = [primary, ...nativeFallbacks].slice(0, 3);

        for (let attempt = 0; attempt <= PER_MODEL_RETRIES && !served; attempt++) {
          if (attempt > 0) {
            await new Promise((r) => setTimeout(r, PER_MODEL_BACKOFF_MS));
          }

          let response: Response;
          try {
            response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${openrouterKey}`,
                "HTTP-Referer": process.env.SITE_URL || "https://sozim.co.za",
                "X-Title": "Sozim Chatbot",
              },
              body: JSON.stringify({
                model: primary,
                models: modelsField,
                messages: [
                  { role: "user", content: prompt },
                ],
                temperature: 0.3,
                max_tokens: 500,
              }),
            });
          } catch (e) {
            lastError = `network: ${(e as Error).message}`;
            console.error(`[sendChatMessage] ${primary} attempt ${attempt + 1} network error:`, e);
            continue;
          }

          if (response.ok) {
            const data = await response.json();
            const text = data?.choices?.[0]?.message?.content?.trim();
            if (text) {
              answer = text;
              served = true;
              console.log(`[sendChatMessage] served by ${primary}`);
            }
            break;
          }

          const errorText = await response.text().catch(() => "");
          lastError = `HTTP ${response.status}`;
          console.error(`[sendChatMessage] ${primary} attempt ${attempt + 1} failed:`, response.status, errorText);

          if (response.status === 401 || response.status === 402) {
            throw new Error("Chatbot is not properly configured. Please contact support.");
          }
        }
      }

      if (!served && lastError) {
        throw new Error("All chatbot models are temporarily busy. Please try again in a minute.");
      }
    }

    await ctx.runMutation(internal.chatbot.saveMessage, {
      sessionId: args.sessionId,
      role: "assistant",
      message: answer,
    });

    return { message: answer };
  },
});

export const searchContentChunks = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    if (!args.query.trim()) return [];

    const queryTokens = tokenize(args.query);
    if (queryTokens.length === 0) return [];

    const allChunks = await ctx.db.query("websiteContentChunks").collect();
    if (allChunks.length === 0) return [];

    const tokenRegexes = queryTokens.map(
      (token) => new RegExp(`\\b${token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i'),
    );

    const scored = allChunks.map((chunk) => {
      let score = 0;
      const titleLower = chunk.title.toLowerCase();
      const contentLower = chunk.content.toLowerCase();
      const urlLower = chunk.url.toLowerCase();

      for (let i = 0; i < queryTokens.length; i++) {
        const token = queryTokens[i];
        if (titleLower.includes(token)) score += 5;
        if (urlLower.includes(token)) score += 3;
        if (tokenRegexes[i].test(contentLower)) score += 2;
        if (contentLower.includes(token)) score += 1;
      }

      return { chunk, score };
    });

    return scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_CHUNKS_CONTEXT)
      .map((s) => s.chunk);
  },
});

export const deleteExpiredMessages = internalMutation({
  handler: async (ctx) => {
    const now = Date.now();
    const expired = await ctx.db
      .query("chatMessages")
      .withIndex("by_expiresAt", (q) => q.lte("expiresAt", now))
      .collect();

    for (const msg of expired) {
      await ctx.db.delete(msg._id);
    }

    return expired.length;
  },
});

export const deleteExpiredSessions = internalMutation({
  handler: async (ctx) => {
    const now = Date.now();
    const expired = await ctx.db
      .query("chatSessions")
      .withIndex("by_expiresAt", (q) => q.lte("expiresAt", now))
      .collect();

    for (const session of expired) {
      const orphanMessages = await ctx.db
        .query("chatMessages")
        .withIndex("by_sessionId", (q) => q.eq("sessionId", session.sessionId))
        .collect();

      for (const msg of orphanMessages) {
        await ctx.db.delete(msg._id);
      }

      await ctx.db.delete(session._id);
    }

    return expired.length;
  },
});

export const deleteOldIndexingLogs = internalMutation({
  handler: async (ctx) => {
    const allLogs = await ctx.db
      .query("indexingLogs")
      .withIndex("by_startedAt")
      .order("desc")
      .collect();

    let deleted = 0;
    if (allLogs.length > 100) {
      const toDelete = allLogs.slice(100);
      for (const log of toDelete) {
        await ctx.db.delete(log._id);
        deleted++;
      }
    }

    return deleted;
  },
});

export const runCleanup = action({
  handler: async (ctx): Promise<{ messagesDeleted: number; sessionsDeleted: number; logsDeleted: number }> => {
    return await ctx.runAction(internal.chatbot.cleanupExpiredChats) as any;
  },
});

export const cleanupExpiredChats = internalAction({
  handler: async (ctx): Promise<{ messagesDeleted: number; sessionsDeleted: number; logsDeleted: number }> => {
    const messagesDeleted: number = await ctx.runMutation(internal.chatbot.deleteExpiredMessages);
    const sessionsDeleted: number = await ctx.runMutation(internal.chatbot.deleteExpiredSessions);
    const logsDeleted: number = await ctx.runMutation(internal.chatbot.deleteOldIndexingLogs);

    return {
      messagesDeleted,
      sessionsDeleted,
      logsDeleted,
    };
  },
});
