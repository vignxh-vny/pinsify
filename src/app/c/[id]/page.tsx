import { Metadata } from "next";
import Link from "next/link";
import { getProfileById } from "@/lib/db";
import IDBadgeCard from "@/components/story/IDBadgeCard";
import { StoryData } from "@/types/story";

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "https://pincheck.in";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const baseUrl = getBaseUrl();
  let profile: StoryData | null = null;

  try {
    profile = await getProfileById(id);
  } catch (err) {
    console.error("[generateMetadata] Error reading profile:", id, err);
  }

  if (!profile) {
    const title = "PinCheck — Discover Your Aesthetic Identity";
    const description = "Analyze your Pinterest boards and unlock your brutalist aesthetic identity.";
    const ogImage = `${baseUrl}/api/og/${id}`;

    return {
      metadataBase: new URL(baseUrl),
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${baseUrl}/c/${id}`,
        type: "website",
        siteName: "PinCheck",
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: "PinCheck Identity Card",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImage],
      },
      robots: {
        index: false,
      },
    };
  }

  const primary = (profile.identity?.primary || "Aesthetic Identity").toUpperCase();
  const rawTagline = (profile.identity?.tagline || "").replace(/^["“”]/, "").replace(/["“”]$/, "").trim();
  const title = `${primary} — PinCheck`;
  const description = rawTagline || `Discover @${profile.user?.username}'s official Pinterest aesthetic identity.`;
  const ogImage = `${baseUrl}/api/og/${id}`;

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/c/${id}`,
      type: "website",
      siteName: "PinCheck",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${primary} — PinCheck Aesthetic ID`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: false,
    },
  };
}

export default async function CardViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let profile: StoryData | null = null;

  try {
    profile = await getProfileById(id);
  } catch (err) {
    console.error("[CardViewPage] Failed to fetch profile:", id, err);
  }

  if (!profile) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#07070a] text-white select-none">
        <div className="w-full max-w-md bg-[#121216] border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-[#d42a2a]/20 border border-[#d42a2a]/40 flex items-center justify-center mb-6">
            <span className="font-['Anton'] text-2xl text-[#d42a2a]">!</span>
          </div>
          <h1 className="font-['Anton'] text-3xl tracking-wide uppercase mb-3">
            CARD NOT FOUND
          </h1>
          <p className="font-['Inter'] text-sm text-[#8b8e99] leading-relaxed mb-8 max-w-xs">
            This aesthetic card has either expired or was created in an earlier session. Scan any Pinterest username to generate a fresh official ID.
          </p>
          <Link
            href="/"
            className="w-full py-3.5 px-6 rounded-xl bg-white text-black font-['Inter'] font-bold text-sm tracking-wider uppercase hover:bg-neutral-200 transition-colors"
          >
            Create Your PinCheck ID
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-between p-4 bg-[#05060b] relative overflow-hidden select-none">
      {/* Background ambient radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(ellipse at 50% 40%, #15162a 0%, #05060b 70%)",
        }}
      />

      {/* Top Bar with Brand and CTA */}
      <header className="relative z-20 w-full max-w-md flex items-center justify-between pt-2 pb-1 px-2">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-[#d42a2a] flex items-center justify-center text-white font-['Anton'] text-sm group-hover:scale-105 transition-transform">
            P
          </div>
          <span className="font-['Anton'] text-xl tracking-wider text-white">
            PINCHECK
          </span>
        </Link>
        <Link
          href="/"
          className="text-xs font-['Inter'] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full bg-white/10 text-white/90 hover:bg-white hover:text-black transition-colors"
        >
          Check Yours →
        </Link>
      </header>

      {/* Center: ID Badge Card */}
      <div className="relative z-10 w-full flex-1 flex items-center justify-center py-2">
        <IDBadgeCard
          data={profile}
          stage={5}
          isLoading={false}
          isFail={false}
          profileId={id}
        />
      </div>

      {/* Bottom hint */}
      <footer className="relative z-20 w-full max-w-md pb-2 text-center">
        <span className="font-['Inter'] text-[11px] font-medium tracking-wide text-white/40">
          TAP CARD TO FLIP • POWERED BY PINCHECK.IN
        </span>
      </footer>
    </main>
  );
}
