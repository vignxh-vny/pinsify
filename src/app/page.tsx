"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [username, setUsername] = useState("");
  const router = useRouter();

  const loadingPhrases = [
    "SCANNING PINTEREST BOARDS...",
    "EXTRACTING VISUAL DNA...",
    "ANALYZING COLOR AURAS...",
    "MATCHING AESTHETIC SIGNATURES...",
    "PRINTING VIP BADGE...",
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnalyzing) {
      interval = setInterval(() => {
        setLoadingTextIndex((prev) =>
          prev < loadingPhrases.length - 1 ? prev + 1 : prev
        );
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing, loadingPhrases.length]);

  const handleAnalyze = async () => {
    if (!username.trim()) return;
    setIsAnalyzing(true);
    try {
      // Artificial delay for testing the loading screen
      await new Promise((resolve) => setTimeout(resolve, 8000));

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() }),
      });
      const data = await res.json();

      if (res.ok) {
        router.push(`/story?id=${data.profileId}`);
      } else {
        alert("Error: " + data.error);
        setIsAnalyzing(false);
      }
    } catch {
      alert("Something went wrong analyzing your Pinterest.");
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden font-sans bg-[#f4f4f4] flex flex-col items-center justify-center">
      {/* ══════════════════════════════════
          BACKGROUND TEXTURES & GRIDS
          ══════════════════════════════════ */}
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      />
      
      {/* Paper / Crinkle Texture Overlay (CSS Pattern) */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-20 mix-blend-multiply"
        style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')",
        }}
      />

      {/* ══════════════════════════════════
          MAIN CONTENT
          ══════════════════════════════════ */}
      <section className="relative z-10 w-full max-w-md px-6 flex flex-col items-center mt-[-10vh]">
        
        {/* TOP BADGE */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full flex justify-between items-start mb-12"
        >
          <div className="flex flex-col gap-1">
            <div className="bg-black text-white font-black px-3 py-1 text-xs tracking-widest uppercase shadow-md">
              SYSTEM v1.0
            </div>
            <div className="bg-black text-white font-black px-3 py-1 text-xs tracking-widest uppercase inline-block self-start shadow-md">
              ONLINE
            </div>
          </div>
          <div className="text-[#E60023] font-black text-3xl tracking-tighter" style={{ fontFamily: "Impact, sans-serif" }}>
            P/ID
          </div>
        </motion.div>

        {/* HEADLINE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full flex flex-col mb-10 relative"
        >
          <h1 
            className="text-black font-black uppercase text-[4rem] sm:text-[5rem] leading-[0.8] tracking-tighter z-10"
            style={{ fontFamily: "Impact, sans-serif" }}
          >
            AESTHETIC
          </h1>
          <div className="bg-[#E60023] w-fit px-2 mt-2 -ml-2 z-20 shadow-lg rotate-1">
            <h1 
              className="text-white font-black uppercase text-[4rem] sm:text-[5rem] leading-[0.85] tracking-tighter"
              style={{ fontFamily: "Impact, sans-serif" }}
            >
              SCANNER
            </h1>
          </div>
          
          {/* Subtext Grid */}
          <div className="grid grid-cols-2 gap-4 mt-8 border-t-4 border-black pt-4 text-black">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Process</p>
              <p className="text-xs font-bold leading-tight">Extract visual DNA from pins & boards.</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Output</p>
              <p className="text-xs font-bold leading-tight">Generate official VIP Aesthetic Badge.</p>
            </div>
          </div>
        </motion.div>

        {/* INPUT & ACTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full flex flex-col gap-4"
        >
          <div className="relative">
            <div className="absolute -top-3 left-4 bg-white text-black px-2 text-[10px] font-black tracking-widest uppercase z-10 border-2 border-black">
              TARGET USERNAME
            </div>
            <div className="flex items-center bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-within:border-[#E60023] transition-colors w-full">
              <span className="pl-4 text-xl font-bold text-black select-none">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                placeholder="USERNAME"
                className="w-full bg-transparent p-4 pl-1 text-xl font-bold uppercase tracking-widest text-black placeholder-gray-400 focus:outline-none rounded-none"
              />
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!username.trim() || isAnalyzing}
            className="w-full bg-[#E60023] border-4 border-black text-white p-4 text-2xl font-black uppercase tracking-widest hover:bg-black transition-colors disabled:bg-gray-200 disabled:border-gray-400 disabled:text-gray-400 disabled:shadow-[4px_4px_0px_0px_rgba(156,163,175,1)] disabled:cursor-not-allowed shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] rounded-none"
            style={{ fontFamily: "Impact, sans-serif" }}
          >
            GENERATE ID
          </button>
        </motion.div>
      </section>

      {/* ══════════════════════════════════
          BRUTALIST DATA SCANNER (LOADING)
          ══════════════════════════════════ */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden font-mono"
          >
            {/* Red Grid Background */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: "linear-gradient(#E60023 1px, transparent 1px), linear-gradient(90deg, #E60023 1px, transparent 1px)",
                backgroundSize: "30px 30px"
              }}
            />

            {/* Scanning Laser Line */}
            <motion.div 
              className="absolute left-0 right-0 h-1 bg-[#E60023] shadow-[0_0_20px_5px_rgba(230,0,35,0.8)] z-50"
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 3, ease: "linear", repeat: Infinity }}
            />

            {/* Central Badge Graphic */}
            <div className="relative w-48 h-64 border-4 border-[#E60023] bg-black/50 flex flex-col items-center justify-center mb-12 p-4">
              <div className="w-full h-24 border-2 border-[#E60023] border-dashed mb-4 flex items-center justify-center opacity-50 relative overflow-hidden">
                <motion.div 
                  className="absolute inset-0 bg-[#E60023]"
                  animate={{ top: ["100%", "0%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <span className="text-[#E60023] font-black tracking-widest text-xs z-10 mix-blend-difference">PROCESSING</span>
              </div>
              <div className="w-full flex-1 flex flex-col gap-2">
                <div className="h-4 bg-[#E60023] w-full opacity-75" />
                <div className="h-4 bg-[#E60023] w-3/4 opacity-75" />
                <div className="h-4 bg-[#E60023] w-1/2 opacity-75" />
              </div>
            </div>

            {/* Dynamic Loading Text */}
            <div className="relative z-10 flex flex-col items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={loadingTextIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-[#E60023] text-white px-4 py-1 text-sm sm:text-base font-bold tracking-widest uppercase mb-2"
                >
                  {loadingPhrases[loadingTextIndex]}
                </motion.div>
              </AnimatePresence>
              
              <div className="text-gray-500 text-xs tracking-[0.3em] uppercase">
                PLEASE DO NOT CLOSE TERMINAL
              </div>
            </div>

            {/* Scrolling Code / Logs (Fake) */}
            <div className="absolute bottom-4 left-4 right-4 h-24 overflow-hidden opacity-30 text-[#E60023] text-[10px] leading-tight select-none">
               {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2, duration: 0.1 }}
                  >
                    {`[${new Date().toISOString()}] VERIFYING NODE 0x${Math.floor(Math.random()*16777215).toString(16).toUpperCase()}... OK`}
                  </motion.div>
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
