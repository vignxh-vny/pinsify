import { NextRequest } from "next/server";
import { getProfileById } from "@/lib/db";
import { renderOGImage } from "@/lib/og-renderer";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");
  const type = searchParams.get("type");
  const format = (searchParams.get("format") || searchParams.get("size")) === "story" ? "story" : "og";

  let data = null;
  if (id) {
    try {
      data = await getProfileById(id);
    } catch (err) {
      console.error("[API OG] Error fetching profile by id:", id, err);
    }
  }

  // If type is compare, we can create a customized compare aesthetic card preview
  if (type === "compare") {
    data = {
      user: {
        username: "vs_mode",
        displayName: "Aesthetic Battle",
        avatarUrl: "",
        totalPins: 2026,
        totalBoards: 12,
      },
      identity: {
        primary: "AESTHETIC CLASH",
        secondary: ["Vibe Contrast", "Board Comparison"],
        emoji: "⚔️",
        tagline: "Put two Pinterest profiles in the ring. Compare taste, boards and true visual lore.",
        description: "Direct side-by-side aesthetic compatibility check.",
      },
      colorAura: {
        name: "Dual Chrome",
        colors: ["#FF1493", "#00F0FF", "#000000", "#FFFFFF"],
        description: "Contrast of two worlds.",
        mood: "Electric",
      },
      themes: [],
      vibes: [],
      feelsLike: "Aesthetic face-off",
      hiddenAesthetics: [],
      drift: [],
      categoryTag: "VERSUS // COMPATIBILITY CHECK",
    };
  }

  const response = await renderOGImage({ data, format });

  if (data && id) {
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  } else {
    response.headers.set("Cache-Control", "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800");
  }

  return response;
}
