"use client";

import { useRef, useState, useEffect } from "react";
import { StoryData } from "@/types/story";
import { Download, Share2 } from "lucide-react";
import * as htmlToImage from "html-to-image";

export default function IDBadgeCard({ data, isArchive = false }: { data: StoryData, isArchive?: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hostUrl, setHostUrl] = useState('PINCHECK');

  useEffect(() => {
    let host = window.location.host.toUpperCase();
    if (host.includes(".VERCEL.APP")) {
      host = "PINCHECK-APP.VERCEL.APP";
    }
    setHostUrl(host);
  }, []);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsProcessing(true);
    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 3, // High-res download
      });
      const link = document.createElement("a");
      link.download = `pincheck-id-${(data.user.displayName || data.user.username).replace(/\s+/g, "-")}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to save image", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    setIsProcessing(true);
    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 3,
      });
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `pincheck-id-${data.user.username}.png`, { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "My PinCheck ID",
          text: `Check out my PinCheck Pinterest ID: ${data.identity.primary}! Get yours at ${window.location.origin}`,
          files: [file],
        });
      } else {
        alert("Direct sharing is not supported on this browser. Please use the Save button instead!");
      }
    } catch (err) {
      console.error("Failed to share", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Convert color aura names into actual CSS colors for the gradient mesh
  const auraColors = data.colorAura.colors.map((color) => {
    const colorMap: Record<string, string> = {
      violet: "#8b5cf6",
      indigo: "#4f46e5",
      blue: "#3b82f6",
      teal: "#14b8a6",
      emerald: "#10b981",
      green: "#22c55e",
      lime: "#84cc16",
      yellow: "#eab308",
      amber: "#f59e0b",
      orange: "#f97316",
      red: "#ef4444",
      rose: "#f43f5e",
      pink: "#ec4899",
      fuchsia: "#d946ef",
      purple: "#a855f7",
      white: "#ffffff",
      black: "#111827",
      gray: "#6b7280",
    };
    return colorMap[color.toLowerCase()] || "#8b5cf6"; // Fallback to violet
  });

  return (
    <div className={`flex flex-col items-center justify-center p-4 sm:p-8 ${isArchive ? 'w-full' : 'min-h-dvh'}`}>
      {/* The ID Badge */}
      <div
        ref={cardRef}
        className="relative w-full max-w-[400px] aspect-[9/16] bg-[#f4f4f4] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col font-sans"
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(0,0,0,0.1)",
        }}
      >
        {/* Paper / Crinkle Texture Overlay (CSS Pattern) */}
        <div 
          className="absolute inset-0 z-50 pointer-events-none opacity-20 mix-blend-multiply"
          style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')",
          }}
        />

        {/* The Metal Clip */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-10 z-20 flex flex-col items-center">
          <div className="w-12 h-6 bg-gradient-to-b from-gray-300 to-gray-400 rounded-b-xl shadow-md flex justify-center border border-gray-500">
            <div className="w-4 h-4 bg-[#f4f4f4] rounded-full mt-1 shadow-inner border border-gray-400" />
          </div>
          <div className="w-4 h-6 bg-gradient-to-b from-gray-400 to-gray-500 shadow-lg border border-gray-600 rounded-b-sm" />
        </div>

        {/* Red Tags Top Left */}
        <div className="absolute top-8 left-0 flex flex-col gap-1 z-10 max-w-[80%]">
          <div className="bg-[#E60023] text-white font-black px-4 py-1 text-sm tracking-widest uppercase shadow-md inline-block self-start">
            PINTEREST
          </div>
          <div className="bg-[#E60023] text-white font-black px-4 py-1 text-sm tracking-widest uppercase inline-block self-start shadow-md">
            IDENTITY
          </div>
          <div className="bg-black text-white font-black px-3 py-1 text-[10px] tracking-widest uppercase inline-block self-start shadow-md mt-1 border-l-4 border-[#E60023] truncate">
            {data.themes[0]?.name || "VIBES"}
          </div>
        </div>

        {/* Date / Gen Top Right */}
        <div className="absolute top-8 right-8 text-black font-black text-4xl tracking-normal" style={{ fontFamily: "var(--next-font-anton), Impact, sans-serif" }}>
          20.26
        </div>

        {/* Photo Area (Abstract Mesh) */}
        <div className="w-[92%] sm:w-[85%] mx-auto mt-24 aspect-[4/3] border-4 border-black relative bg-[#E60023] overflow-hidden shrink-0">
          {/* Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-30 mix-blend-overlay"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "20px 20px"
            }}
          />
          
          {/* Aura Mesh */}
          <div 
            className="absolute inset-0 opacity-90 mix-blend-hard-light filter blur-2xl"
            style={{
              background: `radial-gradient(circle at 20% 30%, ${auraColors[0] || 'transparent'} 0%, transparent 50%),
                           radial-gradient(circle at 80% 70%, ${auraColors[1] || 'transparent'} 0%, transparent 50%),
                           radial-gradient(circle at 50% 50%, ${auraColors[2] || 'transparent'} 0%, transparent 50%)`
            }}
          />

          {/* User Initial / Avatar Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="text-white/80 font-black text-9xl tracking-normal mix-blend-overlay" style={{ fontFamily: "var(--next-font-anton), Impact, sans-serif" }}>
                {(data.user.displayName || data.user.username).charAt(0).toUpperCase()}
             </div>
          </div>

          {/* Circle Stamp */}
          <div className="absolute -bottom-5 -right-5 w-24 h-24 bg-[#f4f4f4] rounded-full border-[5px] border-[#E60023] flex items-center justify-center rotate-[15deg] z-20 shadow-xl overflow-hidden">
            <div className="text-[#E60023] font-black text-center leading-[0.85] tracking-tighter flex flex-col mt-1">
              <span className="text-[16px] tracking-widest">PIN</span>
              <span className="text-[28px] -translate-x-1">CHECK</span>
            </div>
          </div>
        </div>

        {/* Main Typography Area */}
        <div className="flex-1 w-[92%] sm:w-[85%] mx-auto mt-3 flex flex-col justify-start gap-2 pb-6 z-10">
          
          {/* Name & Identity */}
          <div className="flex">
            {/* Massive Text */}
            <div className="flex flex-col justify-center flex-1">
              <h1 className="text-black font-black uppercase text-3xl sm:text-4xl leading-[0.85] tracking-normal break-words drop-shadow-sm line-clamp-3" style={{ fontFamily: "var(--next-font-anton), Impact, sans-serif", textWrap: "balance" }}>
                {data.identity.primary}
              </h1>
            </div>
          </div>

          {/* Bottom Black Box */}
          <div className="bg-[#111] text-white px-3 py-3 rounded-xl border-b-4 border-r-4 border-[#333] shadow-lg mt-1 relative flex flex-col">
            <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wide text-gray-300 mb-1 leading-tight border-b border-gray-700 pb-1">
              {data.identity.secondary.join(" / ")}
            </p>
            <p className="text-[13px] sm:text-[15px] font-black leading-snug uppercase tracking-tight text-white drop-shadow-md mt-2 mb-1 pr-1 line-clamp-3">
              "{data.identity.tagline}"
            </p>
            <div className="mt-3 pr-20 min-h-[46px] flex flex-col justify-end">
              {data.identity.recentKeywords && data.identity.recentKeywords.length > 0 && (
                <p className="text-[7px] font-bold uppercase tracking-wide text-[#E60023] leading-tight line-clamp-1 mb-1">
                  CURRENT FIXATION: <span className="text-gray-300">{data.identity.recentKeywords.join(" / ")}</span>
                </p>
              )}
              <p className="text-[7px] font-bold uppercase tracking-wide text-[#E60023] leading-tight line-clamp-1">
                ALSO SAVES: <span className="text-gray-300">{data.themes[1]?.name || "MIXED VIBES"}</span>
              </p>
              <p className="text-[7px] text-gray-500 mt-1 font-mono uppercase">
                {data.user.totalPins} PINS &bull; {data.user.totalBoards} BOARDS
              </p>
            </div>
            
            {/* Barcode (CSS simulated) */}
            <div className="absolute bottom-3 right-3 w-auto min-w-[64px] max-w-[96px] h-[46px] flex flex-col justify-end bg-[#f4f4f4] p-1 rounded-sm shadow-inner shrink-0">
              <div className="flex-1 flex gap-[2px] w-full items-end justify-center">
                {Array.from({ length: 12 }).map((_, i) => {
                  const heights = [100, 80, 100, 90, 100, 60, 100, 100, 70, 90, 100, 80];
                  const widths = [2, 1, 3, 1, 2, 1, 2, 1, 2, 3, 1, 2];
                  return (
                    <div key={i} className="bg-black" style={{ height: `${heights[i]}%`, width: `${widths[i]}px` }} />
                  )
                })}
              </div>
              <div className="text-[6px] text-black font-mono text-center mt-1 font-bold w-full truncate px-0.5">
                {data.user.username.toUpperCase()}
              </div>
            </div>
          </div>
          
          {/* WATERMARK */}
          <div className="w-full text-center mt-auto pt-2">
            <span className="text-[9px] font-black tracking-[0.3em] text-black/30 uppercase bg-[#f4f4f4] px-2 relative z-20">
              {hostUrl}
            </span>
          </div>

        </div>
      </div>

      {/* Action Buttons */}
      {!isArchive && (
        <div className="mt-8 flex items-center gap-4 z-10">
          <button
            onClick={handleDownload}
            disabled={isProcessing}
            className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            <Download size={18} />
            {isProcessing ? "Processing..." : "Save ID"}
          </button>

          <button
            onClick={handleShare}
            disabled={isProcessing}
            className="flex items-center gap-2 bg-[#E60023] text-white px-6 py-3 rounded-full font-bold shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            <Share2 size={18} />
            Share
          </button>
        </div>
      )}
    </div>
  );
}
