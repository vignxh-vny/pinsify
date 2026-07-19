import type { Metadata, Viewport } from "next";
import { Syne, Cormorant_Garamond, Inter, Playfair_Display, Courier_Prime, Anton } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--next-font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const anton = Anton({
  variable: "--next-font-anton",
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
});

const cormorant = Cormorant_Garamond({
  variable: "--next-font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--next-font-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--next-font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const courier = Courier_Prime({
  variable: "--next-font-courier",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "PinCheck — Discover Your Aesthetic Identity",
  description:
    "An AI-powered brutalist Pinterest profile analyzer.",
  keywords: [
    "pinterest",
    "aesthetic",
    "visual identity",
    "color analysis",
    "ai",
    "personality",
    "vibe check",
    "wrapped",
  ],
  openGraph: {
    title: "PinCheck — Discover Your Aesthetic Identity",
    description:
      "An AI-powered brutalist Pinterest profile analyzer.",
    type: "website",
    siteName: "PinCheck",
  },
  twitter: {
    card: "summary_large_image",
    title: "PinCheck — Discover Your Aesthetic Identity",
    description:
      "An AI-powered brutalist Pinterest profile analyzer.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#050508",
};

import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${cormorant.variable} ${inter.variable} ${playfair.variable} ${courier.variable} ${anton.variable} dark`}
    >
      <body className="antialiased bg-black text-[var(--text-primary)] selection:bg-[var(--accent-violet)] selection:text-white flex items-center justify-center min-h-dvh sm:p-4 overflow-hidden">
        {/* Mobile Viewport Container */}
        <div className="relative w-full h-[100dvh] sm:h-[min(95dvh,900px)] sm:w-[min(100vw,430px)] sm:aspect-[9/16] sm:rounded-[2.5rem] sm:border-[8px] border-[#1a1a24] overflow-hidden shadow-2xl bg-[var(--bg-primary)] ring-1 ring-white/10 mx-auto flex flex-col">
          
          {/* Ambient background effects */}
          <div className="gradient-mesh" aria-hidden="true" />
          <div className="grain-overlay" aria-hidden="true" />

          {/* Main Content */}
          <div className="relative z-10 h-full w-full overflow-y-auto overflow-x-hidden hide-scrollbar">
            {children}
            <Analytics />
          </div>
        </div>
      </body>
    </html>
  );
}
