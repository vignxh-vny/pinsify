import { NextResponse } from "next/server";
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// The schema we want Gemini to return
const StorySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    identity: {
      type: Type.OBJECT,
      properties: {
        primary: { type: Type.STRING, description: "The core aesthetic identity (e.g., 'Dark Academia Dreamer', 'Contemporary Iconography'). Must be a conceptual vibe, not literal names." },
        secondary: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 secondary aesthetic tags (e.g., 'Modern Masculinity', 'Soft Grunge')" },
        emoji: { type: Type.STRING, description: "A single representative emoji" },
        tagline: { type: Type.STRING, description: "A poetic one-liner summarizing their conceptual vibe" },
        description: { type: Type.STRING, description: "A beautifully written 2-3 sentence paragraph about their curated world and what it says about their personality." },
      },
    },
    colorAura: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: "Name of their color aura (e.g., 'Amber Dusk')" },
        colors: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array of exactly 6 hex color codes representing their palette" },
        description: { type: Type.STRING, description: "A poetic description of their colors" },
        mood: { type: Type.STRING, description: "Short phrase describing the emotional mood of their colors" },
      },
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
      description: "A highly descriptive, cinematic paragraph starting with 'Your Pinterest feels like...' painting a vivid sensory picture of their boards.",
    },
    hiddenAesthetics: {
      type: Type.ARRAY,
      description: "2 unexpected or hidden niche aesthetics they dabble in",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          confidence: { type: Type.INTEGER, description: "A value between 40 and 80" },
          description: { type: Type.STRING },
          emoji: { type: Type.STRING },
        },
      },
    },
    drift: {
      type: Type.ARRAY,
      description: "A chronological timeline of 5 eras of their aesthetic evolution. Make up creative eras based on typical internet aesthetics over the years leading up to their current vibe.",
      items: {
        type: Type.OBJECT,
        properties: {
          period: { type: Type.STRING, description: "e.g., 'Early', '2022', 'Now'" },
          aesthetic: { type: Type.STRING },
          color: { type: Type.STRING, description: "Hex color" },
        },
      },
    },
  },
  required: ["identity", "colorAura", "themes", "vibes", "feelsLike", "hiddenAesthetics", "drift"],
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username } = body;

    if (!username) {
      return NextResponse.json({ error: "Missing Pinterest username." }, { status: 400 });
    }

    const cleanUsername = username.replace("@", "");

    // Check if we already have this user cached to save AI tokens
    if (!body.force) {
      const dummyEmail = `${cleanUsername}@pinsbyme.local`;
      const existingUser = await prisma.user.findUnique({
        where: { email: dummyEmail },
        include: { 
          aestheticProfiles: {
            orderBy: { createdAt: 'desc' },
            take: 1
          } 
        }
      });

      if (existingUser && existingUser.aestheticProfiles.length > 0) {
        console.log("Returning cached profile for", cleanUsername);
        return NextResponse.json({ success: true, profileId: existingUser.aestheticProfiles[0].id });
      }
    }

    // 1. Fetch RSS Feed and Profile HTML
    const rssUrl = `https://www.pinterest.com/${cleanUsername}/feed.rss`;
    const profileUrl = `https://www.pinterest.com/${cleanUsername}/`;
    
    const [rssRes, profileRes] = await Promise.all([
      fetch(rssUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
      }),
      fetch(profileUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
      })
    ]);

    if (!rssRes.ok) {
      if (rssRes.status === 404) {
         return NextResponse.json({ error: "Pinterest user not found." }, { status: 404 });
      }
      throw new Error(`Failed to fetch RSS feed. Status: ${rssRes.status}`);
    }

    const rssText = await rssRes.text();
    const profileHtml = profileRes.ok ? await profileRes.text() : "";

    if (!rssText.includes("<rss") && !rssText.includes("<feed")) {
      return NextResponse.json({ error: "Invalid RSS feed returned by Pinterest." }, { status: 400 });
    }

    // Extract stats
    const pinMatch = [...profileHtml.matchAll(/"pin_count":(\d+)/g)].map(m => parseInt(m[1]));
    const boardMatch = [...profileHtml.matchAll(/"board_count":(\d+)/g)].map(m => parseInt(m[1]));
    const totalPins = pinMatch.length ? Math.max(...pinMatch) : 0;
    const totalBoards = boardMatch.length ? Math.max(...boardMatch) : 0;

    if (totalPins === 0) {
      return NextResponse.json(
        { error: "ACCESS DENIED: No public pins found. You must save pins to a public board for the scanner to work." }, 
        { status: 400 }
      );
    }

    // 2. Prepare Prompt for Gemini
    // Strip out image tags to save tokens, we only care about text descriptions/titles
    const cleanRssText = rssText.replace(/<img[^>]*>/g, "");

    const prompt = `
      You are an expert aesthetic analyst and poetic storyteller deeply embedded in TikTok and Pinterest Gen-Z culture. 
      Analyze the following raw Pinterest RSS feed for a user named @${cleanUsername} to determine their true "Aesthetic DNA".
      
      CRITICAL INSTRUCTION: You MUST use trendy Gen-Z internet slang and "-core" aesthetics for everyone. NEVER use formal, academic, or robotic words like "Cerebral", "Algorithms", or "Enlightenment".
      - For anime/manga: use terms like "Otaku Baddie", "Animecore", "Webcore".
      - For cars/sports: use terms like "Motorcore", "Blokecore", "Starboy".
      - For fashion/lifestyle: use terms like "Clean Girl", "Y2K Baddie", "Coquette", "Downtown Girl".
      - For nature/outdoors: use terms like "Gorpcore", "Fairycore", "Granola Girl/Boy".
      
      Always frame their identity using these fun, trendy internet aesthetics. Make the tagline punchy and highly relatable to current Gen-Z internet culture.
      
      The XML feed contains their most recent pins, titles, and descriptions. Extract the themes, colors, vibes, and hidden aesthetics.
      
      User's Pinterest RSS Feed:
      ${cleanRssText}
      
      Write beautifully and cinematically. Return the exact JSON structure requested.
    `;

    // 3. Call Gemini AI (with retries for high demand)
    let aiResponse;
    let retries = 3;
    while (retries > 0) {
      try {
        aiResponse = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: StorySchema,
          },
        });
        break; // Success!
      } catch (err: any) {
        if (err.status === 503 && retries > 1) {
          console.warn("Gemini 2.5 is overloaded, retrying in 2 seconds...");
          await new Promise(r => setTimeout(r, 2000));
          retries--;
        } else {
          throw err;
        }
      }
    }

    if (!aiResponse?.text) {
      throw new Error("Failed to generate AI content");
    }

    const aiData = JSON.parse(aiResponse.text);

    // 4. Construct Final Story Object
    const fullStoryData = {
      user: {
        username: cleanUsername,
        displayName: cleanUsername,
        avatarUrl: "https://i.pinimg.com/75x75_RS/52/bd/27/52bd2782e36bf22bfad6c9dc89ea5b83.jpg", // placeholder
        totalPins: totalPins, 
        totalBoards: totalBoards,
      },
      ...aiData
    };

    // 5. Save to MongoDB
    const dummyEmail = `${cleanUsername}@pinsbyme.local`;
    let user = await prisma.user.findUnique({ where: { email: dummyEmail } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: dummyEmail,
          name: cleanUsername,
        }
      });
    }

    // Create a new profile history entry
    const profile = await prisma.aestheticProfile.create({
      data: {
        userId: user.id,
        data: fullStoryData,
      }
    });

    return NextResponse.json({ success: true, profileId: profile.id });

  } catch (error: any) {
    console.error("Analysis Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
