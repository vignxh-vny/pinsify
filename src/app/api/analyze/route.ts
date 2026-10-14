export const dynamic = 'force-dynamic';
export const maxDuration = 60;
import { NextResponse } from "next/server";
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { z } from "zod";
import { getCachedProfile, saveAestheticProfile } from "@/lib/db";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// The schema we want Gemini to return
const StorySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    identity: {
      type: Type.OBJECT,
      properties: {
        primary: { type: Type.STRING, description: "The core aesthetic identity (e.g., 'Retro Chic', 'Contemporary Iconography'). Must be a conceptual vibe, not literal names." },
        secondary: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 secondary aesthetic tags (e.g., 'Modern Streetwear', 'Eclectic Visuals')" },
        emoji: { type: Type.STRING, description: "A single representative emoji" },
        tagline: { type: Type.STRING, description: "A witty, casual one-liner roast summarizing how their Pinterest is a fantasy" },
        description: { type: Type.STRING, description: "A beautifully written 2-3 sentence paragraph about their curated world and what it says about their personality." },
        recentKeywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Extract 3 highly specific, funny or embarrassing keywords/phrases based strictly on their 4-5 most recent pins." },
      },
      required: ["primary", "secondary", "emoji", "tagline", "description"],
    },
    colorAura: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: "Name of their color aura (e.g., 'Amber Dusk')" },
        colors: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array of exactly 6 hex color codes representing their palette" },
        description: { type: Type.STRING, description: "A poetic description of their colors" },
        mood: { type: Type.STRING, description: "Short phrase describing the emotional mood of their colors" },
      },
      required: ["name", "colors", "description", "mood"],
    },
    themes: {
      type: Type.ARRAY,
      description: "Top 6 visual themes in their pins",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          percentage: { type: Type.INTEGER },
          emoji: { type: Type.STRING },
        },
        required: ["name"],
      },
    },
    vibes: {
      type: Type.ARRAY,
      description: "Top 5 emotional vibe sliders",
      items: {
        type: Type.OBJECT,
        properties: {
          trait: { type: Type.STRING, description: "e.g., 'Nostalgic', 'Warm', 'Minimal'" },
          value: { type: Type.INTEGER, description: "A value between 50 and 99" },
          label: { type: Type.STRING, description: "Short 2-3 word label explaining the trait" },
        },
      },
    },
    feelsLike: {
      type: Type.STRING,
      description: "A descriptive cinematic paragraph starting with 'Your Pinterest feels like...' painting a vivid picture of their boards.",
    },
    hiddenAesthetics: {
      type: Type.ARRAY,
      description: "2 unexpected or hidden niche aesthetics they dabble in",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          confidence: { type: Type.INTEGER },
          description: { type: Type.STRING },
          emoji: { type: Type.STRING },
        },
      },
    },
    drift: {
      type: Type.ARRAY,
      description: "A chronological timeline of 5 eras of their aesthetic evolution.",
      items: {
        type: Type.OBJECT,
        properties: {
          period: { type: Type.STRING },
          aesthetic: { type: Type.STRING },
          color: { type: Type.STRING },
        },
      },
    },
    shopKeywords: {
      type: Type.ARRAY,
      description: "Exactly 4 aesthetic products or fashion/decor items matching their vibe (e.g. 'oversized graphic tee', 'vintage silver ring', 'leather bomber jacket', 'abstract print tote bag').",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Short product title (2-4 words)" },
          note: { type: Type.STRING, description: "Witty 3-5 word aesthetic note or reason" },
          emoji: { type: Type.STRING, description: "Single matching emoji" },
          searchQuery: { type: Type.STRING, description: "Search query to find this item" },
        },
        required: ["title", "note", "emoji", "searchQuery"],
      },
    },
  },
  required: ["identity", "colorAura", "themes", "feelsLike", "shopKeywords"],
};

// Zod schema to validate Gemini response
const ZodStorySchema = z.object({
  identity: z.object({
    primary: z.string(),
    secondary: z.array(z.string()).default([]),
    emoji: z.string().optional().default("✨"),
    tagline: z.string(),
    description: z.string().default(""),
    recentKeywords: z.array(z.string()).optional().default([]),
  }),
  colorAura: z.object({
    name: z.string().default("Visual Aura"),
    colors: z.array(z.string()).default(["#05060b", "#d42a2a", "#7a2cff", "#e2278d", "#cf2aa8", "#ffffff"]),
    description: z.string().default(""),
    mood: z.string().default(""),
  }),
  themes: z.array(z.object({
    name: z.string(),
    percentage: z.number().optional().default(20),
    emoji: z.string().optional().default("✨"),
  })).default([]),
  vibes: z.array(z.object({
    trait: z.string(),
    value: z.number().optional().default(75),
    label: z.string().optional().default(""),
  })).optional().default([]),
  feelsLike: z.string().default(""),
  hiddenAesthetics: z.array(z.object({
    name: z.string(),
    confidence: z.number().optional().default(60),
    description: z.string().optional().default(""),
    emoji: z.string().optional().default("✨"),
  })).optional().default([]),
  drift: z.array(z.object({
    period: z.string(),
    aesthetic: z.string(),
    color: z.string().optional().default("#ffffff"),
  })).optional().default([]),
  shopKeywords: z.array(z.object({
    title: z.string(),
    note: z.string(),
    emoji: z.string().optional().default("✨"),
    searchQuery: z.string(),
  })).optional().default([]),
});

// Helper: build affiliate shop items from real keywords & AFFILIATE_TAG
function buildShopProducts(shopKeywords: any[], fallbackAesthetic: string = "aesthetic"): any[] {
  const affiliateTag = process.env.AFFILIATE_TAG || "";
  const colorGradients = [
    "linear-gradient(135deg, #e2278d, #7a2cff)",
    "linear-gradient(135deg, #d42a2a, #ff8a3d)",
    "linear-gradient(135deg, #19b6ff, #7a2cff)",
    "linear-gradient(135deg, #2f9e6b, #19c6c6)",
  ];

  let items = (shopKeywords || []).slice(0, 4);
  if (items.length === 0) {
    items = [
      { title: "Archival Art Print", note: "Museum-grade visual print", emoji: "🖼️", searchQuery: `${fallbackAesthetic} art print` },
      { title: "Vintage Canvas Tote", note: "Heavyweight daily essential", emoji: "👜", searchQuery: `${fallbackAesthetic} tote bag` },
      { title: "Ambient Studio Lamp", note: "Warm aesthetic diffused glow", emoji: "💡", searchQuery: `${fallbackAesthetic} aesthetic lamp` },
      { title: "Curator Grid Journal", note: "Hardcover archive notebook", emoji: "📓", searchQuery: `${fallbackAesthetic} aesthetic journal` },
    ];
  }

  return items.map((p: any, idx: number) => {
    const query = encodeURIComponent(p.searchQuery || p.title);
    const url = affiliateTag
      ? `https://www.amazon.in/s?k=${query}&tag=${affiliateTag}`
      : `https://www.amazon.in/s?k=${query}`;

    return {
      title: p.title,
      note: p.note,
      emoji: p.emoji || "✨",
      bg: colorGradients[idx % colorGradients.length],
      url,
    };
  });
}

// Helper: Extract top category and pin info from RSS items
function parsePinterestRss(rssText: string) {
  const items = [...rssText.matchAll(/<item>([\s\S]*?)<\/item>/g)];
  const categories: string[] = [];
  const titles: string[] = [];

  for (const item of items) {
    const itemContent = item[1];
    const catMatch = itemContent.match(/<category[^>]*>(.*?)<\/category>/i);
    if (catMatch && catMatch[1].trim()) {
      categories.push(catMatch[1].trim());
    }
    const titleMatch = itemContent.match(/<title[^>]*>(.*?)<\/title>/i);
    if (titleMatch && titleMatch[1].trim()) {
      titles.push(titleMatch[1].trim());
    }
  }

  // Find most frequent category
  const catCount: Record<string, number> = {};
  for (const c of categories) {
    const upper = c.toUpperCase();
    catCount[upper] = (catCount[upper] || 0) + 1;
  }
  const sortedCats = Object.entries(catCount).sort((a, b) => b[1] - a[1]);
  const topCategory = sortedCats[0]?.[0] || (titles[0] ? titles[0].slice(0, 20).toUpperCase() : "VISUAL ART");

  return {
    itemCount: items.length,
    topCategory,
    recentTitles: titles.slice(0, 5),
    categories: sortedCats.slice(0, 4).map(([name]) => name),
  };
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const isStreamRequest = request.headers.get("accept")?.includes("text/event-stream") || url.searchParams.get("stream") === "true";

  let body: any = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  const { username, force } = body;

  if (!username) {
    return NextResponse.json({ error: "Missing Pinterest username." }, { status: 400 });
  }

  const cleanUsername = username.replace("@", "").trim().toLowerCase();

  // If streaming request, return Server-Sent Events stream
  if (isStreamRequest) {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let isClosed = false;
        function sendEvent(event: string, data: any) {
          if (isClosed) return;
          try {
            controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
          } catch {
            isClosed = true;
          }
        }

        try {
          // 1. Fetch Pinterest RSS and Profile HTML
          const rssUrl = `https://www.pinterest.com/${cleanUsername}/feed.rss`;
          const profileUrl = `https://www.pinterest.com/${cleanUsername}/`;

          const [rssRes, profileRes] = await Promise.all([
            fetch(rssUrl, {
              headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
            }),
            fetch(profileUrl, {
              headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
            }),
          ]);

          if (!rssRes.ok) {
            if (rssRes.status === 404) {
              sendEvent("error", { message: "Check the username, and make sure its saved pins are public." });
              controller.close();
              return;
            }
            sendEvent("error", { message: "Could not read that Pinterest account. Please try again." });
            controller.close();
            return;
          }

          const rssText = await rssRes.text();
          const profileHtml = profileRes.ok ? await profileRes.text() : "";

          if (!rssText.includes("<rss") && !rssText.includes("<feed")) {
            sendEvent("error", { message: "Check the username, and make sure its saved pins are public." });
            controller.close();
            return;
          }

          // Extract counts from profile HTML
          const pinMatch = [...profileHtml.matchAll(/"pin_count":(\d+)/g)].map((m) => parseInt(m[1]));
          const boardMatch = [...profileHtml.matchAll(/"board_count":(\d+)/g)].map((m) => parseInt(m[1]));
          const totalPins = pinMatch.length ? Math.max(...pinMatch) : 0;
          const totalBoards = boardMatch.length ? Math.max(...boardMatch) : 0;

          if (totalPins === 0) {
            sendEvent("error", { message: "Check the username, and make sure its saved pins are public." });
            controller.close();
            return;
          }

          if (totalPins < 3) {
            sendEvent("error", { message: "Very few pins found on this account. Save more pins to public boards to scan." });
            controller.close();
            return;
          }

          const { topCategory, recentTitles, categories } = parsePinterestRss(rssText);

          // STAGE 1: Boards fetched -> category tag, pin and board counts
          sendEvent("stage1", {
            category: topCategory,
            pins: totalPins,
            boards: totalBoards,
          });

          // STAGE 2: Pin details & signature pink gradient
          const gradient = "linear-gradient(110deg, #e2278d 0%, #cf2aa8 38%, #d42a62 72%, #dc2d34 100%)";

          const headLine = categories.length > 0 ? categories.slice(0, 3).join(" / ").toUpperCase() : topCategory;
          const fixationText = recentTitles[0] ? recentTitles[0].slice(0, 32).toUpperCase() : topCategory;
          const alsoText = categories[1] ? categories[1].toUpperCase() : (recentTitles[1] ? recentTitles[1].slice(0, 32).toUpperCase() : "VISUAL CULTURE");

          sendEvent("stage2", {
            gradient,
            head: headLine,
            fixation: fixationText,
            also: alsoText,
          });

          // Check Cache if not forced
          if (!force) {
            const cached = await getCachedProfile(cleanUsername, totalPins);
            if (cached && cached.data) {
              const cachedData = cached.data;
              sendEvent("stage3", { title: cachedData.identity.primary });
              sendEvent("stage4", { quote: cachedData.identity.tagline });
              sendEvent("done", {
                profileId: cached.profileId,
                storyData: {
                  ...cachedData,
                  gradient: cachedData.gradient || gradient,
                  categoryTag: cachedData.categoryTag || topCategory,
                  headCategories: cachedData.headCategories || headLine,
                  fixation: cachedData.fixation || fixationText,
                  alsoSaves: cachedData.alsoSaves || alsoText,
                  shopProducts: (cachedData.shopProducts && cachedData.shopProducts.length > 0) ? cachedData.shopProducts : buildShopProducts(cachedData.shopKeywords || [], cachedData.identity?.primary),
                },
              });
              controller.close();
              return;
            }
          }

          // STAGE 3 & 4: Call Gemini 2.5 Flash (with 1 retry on failure)
          const cleanRssText = rssText.replace(/<img[^>]*>/g, "");
          const prompt = `
            You are a funny, casual Gen-Z best friend looking at someone's Pinterest board. You know that Pinterest is just a fantasy board and that in reality, they probably don't do half the things they save.
            Analyze the following raw Pinterest RSS feed for a user named @${cleanUsername} to determine their true "Aesthetic DNA".
            
            CRITICAL INSTRUCTION: Your tone MUST be casual, banter-heavy, and use slang like "blud", "chic", "knower".
            NEVER use aspirational terms like "Productivity Princess", "Creator", or "Dreamer" because they don't actually do anything in reality—they just save pins.
            
            RULES FOR THE MAIN TITLE:
            - If they save fashion/beauty: The title MUST include the word "Chic" (e.g., "Retro Chic", "K-Pop Chic", "Downtown Chic").
            - If they save nature/sunsets: The title MUST be something funny like "Blud Loves Nature" or "Chronically Indoors Grass Toucher".
            - If they save sports/cars/music: The title MUST be specific like "F1 Ball Knower" or "High-Octane Metal Head".
            - If they save productivity/study pins: DO NOT call them a princess or boss. Call them a "Delusional Planner" or "Aesthetic Procrastinator".
            
            For the tagline, make it a funny, casual roast about how their Pinterest board is a fantasy (e.g., "Saving 100 recipes but still ordering takeout." or "Planning a life you will never actually live.").
            
            SHOP KEYWORDS: Return exactly 4 specific, real physical products/decor items matching their aesthetic taste that they would actually buy to fit their vibe.
            
            IMPORTANT: Adjust the terms to fit the user's perceived gender or vibe based on their pins! Keep it fun, extremely casual, and like a group chat roast.
            
            CRITICAL ANALYSIS RULE: Look at what they save the *most* across the pins. Base their identity on what they save the most.
            
            User's Pinterest RSS Feed:
            ${cleanRssText}
            
            Return the exact JSON structure requested.
          `;

          let aiResponse: any = null;
          let attempts = 0;
          while (attempts < 2) {
            attempts++;
            try {
              const aiPromise = ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                  responseMimeType: "application/json",
                  responseSchema: StorySchema,
                },
              });
              const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error("TIMEOUT")), 45000);
              });
              aiResponse = await Promise.race([aiPromise, timeoutPromise]);
              if (aiResponse?.text) break;
            } catch (err) {
              if (attempts >= 2) throw err;
              await new Promise((r) => setTimeout(r, 1500));
            }
          }

          if (!aiResponse?.text) {
            throw new Error("Failed to generate aesthetic profile.");
          }

          const rawAiData = JSON.parse(aiResponse.text);
          const aiData = ZodStorySchema.parse(rawAiData);

          // STAGE 3: Title
          sendEvent("stage3", { title: aiData.identity.primary });

          // STAGE 4: Quote
          sendEvent("stage4", { quote: aiData.identity.tagline });

          // Build dynamic shop items from real Gemini keywords using AFFILIATE_TAG
          const shopProducts = buildShopProducts(aiData.shopKeywords || [], aiData.identity?.primary);

          // Extract avatar if present
          const avatarMatch = profileHtml.match(/"image_xlarge_url":"([^"]+)"/) || profileHtml.match(/"image_medium_url":"([^"]+)"/);
          const avatarUrl = avatarMatch ? avatarMatch[1].replace(/\\u002F/g, "/") : "";

          // Final Story Data
          const fullStoryData = {
            user: {
              username: cleanUsername,
              displayName: cleanUsername,
              avatarUrl,
              totalPins,
              totalBoards,
            },
            ...aiData,
            gradient,
            categoryTag: topCategory,
            headCategories: headLine,
            fixation: fixationText,
            alsoSaves: alsoText,
            shopProducts,
          };

          const profileId = await saveAestheticProfile(cleanUsername, fullStoryData);

          sendEvent("done", {
            profileId,
            storyData: fullStoryData,
          });

          controller.close();
        } catch (err: any) {
          console.error("Stream error in analyze:", err);
          sendEvent("error", {
            message: err?.message?.includes("TIMEOUT")
              ? "Scanning took too long. Please try again."
              : "Could not read that account. Please check the username and try again.",
          });
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
      },
    });
  }

  // Non-streaming fallback
  try {
    const rssUrl = `https://www.pinterest.com/${cleanUsername}/feed.rss`;
    const profileUrl = `https://www.pinterest.com/${cleanUsername}/`;

    const [rssRes, profileRes] = await Promise.all([
      fetch(rssUrl, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" } }),
      fetch(profileUrl, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" } }),
    ]);

    if (!rssRes.ok) {
      return NextResponse.json({ error: "Check the username, and make sure its saved pins are public." }, { status: 404 });
    }

    const rssText = await rssRes.text();
    const profileHtml = profileRes.ok ? await profileRes.text() : "";

    const pinMatch = [...profileHtml.matchAll(/"pin_count":(\d+)/g)].map((m) => parseInt(m[1]));
    const boardMatch = [...profileHtml.matchAll(/"board_count":(\d+)/g)].map((m) => parseInt(m[1]));
    const totalPins = pinMatch.length ? Math.max(...pinMatch) : 0;
    const totalBoards = boardMatch.length ? Math.max(...boardMatch) : 0;

    if (totalPins === 0) {
      return NextResponse.json({ error: "Check the username, and make sure its saved pins are public." }, { status: 400 });
    }

    if (totalPins < 3) {
      return NextResponse.json({ error: "Very few pins found on this account. Save more pins to public boards to scan." }, { status: 400 });
    }

    const { topCategory, recentTitles, categories } = parsePinterestRss(rssText);
    const gradient = "linear-gradient(110deg, #e2278d 0%, #cf2aa8 38%, #d42a62 72%, #dc2d34 100%)";

    if (!body.force) {
      const cached = await getCachedProfile(cleanUsername, totalPins);
      if (cached) {
        return NextResponse.json({ success: true, profileId: cached.profileId });
      }
    }

    const headLine = categories.length > 0 ? categories.slice(0, 3).join(" / ").toUpperCase() : topCategory;
    const fixationText = recentTitles[0] ? recentTitles[0].slice(0, 32).toUpperCase() : topCategory;
    const alsoText = categories[1] ? categories[1].toUpperCase() : (recentTitles[1] ? recentTitles[1].slice(0, 32).toUpperCase() : "VISUAL CULTURE");

    const cleanRssText = rssText.replace(/<img[^>]*>/g, "");
    const prompt = `
      You are a funny, casual Gen-Z best friend looking at someone's Pinterest board.
      Analyze the following raw Pinterest RSS feed for a user named @${cleanUsername} to determine their true "Aesthetic DNA".
      
      RULES: Tone must be casual banter. Use words like "chic", "knower".
      Tagline must be a roast about fantasy vs reality.
      shopKeywords: return exactly 4 aesthetic products to shop matching their vibe.
      
      User's Pinterest RSS Feed:
      ${cleanRssText}
      
      Return the exact JSON structure requested.
    `;

    const aiPromise = ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: StorySchema,
      },
    });
    const aiResponse = await aiPromise;
    const rawAiData = JSON.parse(aiResponse.text || "{}");
    const aiData = ZodStorySchema.parse(rawAiData);

    const shopProducts = buildShopProducts(aiData.shopKeywords || [], aiData.identity?.primary);
    const fullStoryData = {
      user: {
        username: cleanUsername,
        displayName: cleanUsername,
        avatarUrl: "",
        totalPins,
        totalBoards,
      },
      ...aiData,
      gradient,
      categoryTag: topCategory,
      headCategories: headLine,
      fixation: fixationText,
      alsoSaves: alsoText,
      shopProducts,
    };

    const profileId = await saveAestheticProfile(cleanUsername, fullStoryData);
    return NextResponse.json({ success: true, profileId });
  } catch (err: any) {
    console.error("Non-stream error:", err);
    return NextResponse.json({ error: err?.message || "Failed to generate aesthetic profile." }, { status: 500 });
  }
}
