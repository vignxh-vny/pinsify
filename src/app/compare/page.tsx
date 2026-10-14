import { Metadata } from "next";
import Link from "next/link";

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

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getBaseUrl();
  const title = "Aesthetic Clash & Compare — PinCheck";
  const description = "Put two Pinterest profiles in the ring. Compare taste, boards and visual lore.";
  const ogImage = `${baseUrl}/api/og?type=compare`;

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/compare`,
      type: "website",
      siteName: "PinCheck",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "PinCheck Aesthetic Clash & Compare",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default function ComparePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#05060b] text-white select-none relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(ellipse at 50% 50%, #1a1226 0%, #05060b 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-md bg-[#111116] border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-[#FF1493]/20 border border-[#FF1493]/40 flex items-center justify-center mb-6">
          <span className="text-2xl">⚔️</span>
        </div>

        <div className="bg-[#d42a2a] text-white font-['Inter'] font-bold text-xs tracking-widest uppercase px-3 py-1 rounded mb-3">
          VERSUS MODE
        </div>

        <h1 className="font-['Anton'] text-4xl tracking-wide uppercase mb-3">
          AESTHETIC CLASH
        </h1>

        <p className="font-['Inter'] text-sm text-[#8b8e99] leading-relaxed mb-8 max-w-xs">
          Compare two Pinterest curators side by side. See whose boards have more cohesive lore and vibe compatibility.
        </p>

        <Link
          href="/"
          className="w-full py-3.5 px-6 rounded-xl bg-white text-black font-['Inter'] font-bold text-sm tracking-wider uppercase hover:bg-neutral-200 transition-colors"
        >
          Scan Your Profile First →
        </Link>
      </div>
    </main>
  );
}
