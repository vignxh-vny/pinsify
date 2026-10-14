import { NextRequest } from "next/server";
import { getProfileById } from "@/lib/db";
import { renderOGImage } from "@/lib/og-renderer";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const searchParams = request.nextUrl.searchParams;
  const format = (searchParams.get("format") || searchParams.get("size")) === "story" ? "story" : "og";

  let data = null;
  if (id) {
    try {
      data = await getProfileById(id);
    } catch (err) {
      console.error("[API OG] Error fetching profile by id:", id, err);
      // Fallback is rendered below, never return an error to user/crawlers
    }
  }

  const response = await renderOGImage({ data, format });

  // Add sensible cache headers:
  // Stored cards are immutable per ID -> long cache.
  // Missing/fallback cards -> short cache so newly created cards update quickly.
  if (data) {
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  } else {
    response.headers.set("Cache-Control", "public, max-age=60, s-maxage=60, stale-while-revalidate=300");
  }

  return response;
}
