"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function LandingPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [username, setUsername] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const router = useRouter();

  const filteredHistory = username.trim() === "" 
    ? [] 
    : history.filter(h => h.toLowerCase().includes(username.toLowerCase()));

  useEffect(() => {
    try {
      const stored = localStorage.getItem("pinsbyme_history");
      if (stored) setHistory(JSON.parse(stored));
    } catch (e) {
      console.error("Failed to load history", e);
    }
  }, []);

  const loadingPhrases = [
    "SCANNING PINTEREST BOARDS...",
    "EXTRACTING VISUAL DNA...",
    "ANALYZING COLOR AURAS...",
    "MATCHING AESTHETIC SIGNATURES...",
    "PRINTING VIP BADGE...",
  ];

  useEffect(() => {
    let textInterval: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;
    
    if (isAnalyzing) {
      setLoadingProgress(0);
      setLoadingTextIndex(0);
      
      textInterval = setInterval(() => {
        setLoadingTextIndex((prev) =>
          prev < loadingPhrases.length - 1 ? prev + 1 : prev
        );
      }, 4000);
      
      progressInterval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 99) return 99;
          const increment = prev > 85 ? 0.2 : (Math.random() * 2 + 0.5);
          const next = prev + increment;
          return next > 99 ? 99 : next;
        });
      }, 300);
    }
    
    return () => {
      clearInterval(textInterval);
      clearInterval(progressInterval);
    };
  }, [isAnalyzing, loadingPhrases.length]);

  const handleAnalyze = async (force: boolean = false) => {
    if (!username.trim()) return;
    setIsAnalyzing(true);
    setErrorMsg("");
    
    const trimmedUser = username.trim();
    try {
      setHistory(prev => {
        const newHistory = [trimmedUser, ...prev.filter(u => u.toLowerCase() !== trimmedUser.toLowerCase())].slice(0, 5);
        localStorage.setItem("pinsbyme_history", JSON.stringify(newHistory));
        return newHistory;
      });
    } catch (e) {
      console.error("Failed to save history", e);
    }
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), force }),
      });
      const data = await res.json();

      if (res.ok) {
        router.push(`/story?id=${data.profileId}`);
      } else {
        setErrorMsg(data.error);
        setIsAnalyzing(false);
      }
    } catch {
      setErrorMsg("Something went wrong analyzing your Pinterest.");
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
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
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
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#E60023] font-black text-2xl tracking-normal" style={{ fontFamily: "var(--next-font-anton), Impact, sans-serif" }}
          >
            PIN CHECK
          </motion.div>
        </motion.div>

        {/* HEADLINE */}
        <div className="w-full flex flex-col mb-10 relative">
          <div className="overflow-hidden">
            <motion.h1 
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-black font-black uppercase text-[4rem] sm:text-[5rem] leading-[0.8] tracking-normal z-10"
              style={{ fontFamily: "var(--next-font-anton), Impact, sans-serif" }}
            >
              AESTHETIC
            </motion.h1>
          </div>
          <div className="overflow-hidden bg-[#E60023] w-fit px-2 mt-2 -ml-2 z-20 shadow-lg rotate-1">
            <motion.h1 
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-white font-black uppercase text-[4rem] sm:text-[5rem] leading-[0.85] tracking-normal"
              style={{ fontFamily: "var(--next-font-anton), Impact, sans-serif" }}
            >
              SCANNER
            </motion.h1>
          </div>
          
          {/* Subtext Grid */}
          <motion.div 
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.3, delay: 0.7 }}
            className="grid grid-cols-2 gap-4 mt-8 border-t-4 border-black pt-4 text-black"
          >
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Process</p>
              <p className="text-xs font-bold leading-tight">Extract visual DNA from pins & boards.</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Output</p>
              <p className="text-xs font-bold leading-tight">Generate official VIP Aesthetic Badge.</p>
            </div>
          </motion.div>
        </div>

        {/* INPUT & ACTION */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex flex-col gap-4"
        >
          <div className="relative">
            <div className="flex items-center bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-within:border-[#E60023] transition-colors w-full relative z-20">
              <span className="pl-4 text-xl font-bold text-black select-none">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setShowHistory(false);
                    handleAnalyze(false);
                  }
                }}
                onFocus={() => setShowHistory(true)}
                onBlur={() => setShowHistory(false)}
                placeholder="PINTEREST USERNAME"
                className="w-full bg-transparent p-4 pl-1 text-xl font-bold uppercase tracking-widest text-black placeholder-gray-400 focus:outline-none rounded-none"
              />
            </div>
            
            <AnimatePresence>
              {showHistory && filteredHistory.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-30"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <div className="px-4 py-2 bg-black text-white text-[10px] font-black tracking-widest uppercase flex justify-between items-center">
                    <span>Recent Searches</span>
                    <button 
                      onClick={() => {
                        setHistory([]);
                        localStorage.removeItem("pinsbyme_history");
                      }}
                      className="hover:text-[#E60023] transition-colors"
                    >
                      CLEAR
                    </button>
                  </div>
                  <ul>
                    {filteredHistory.map((histUser, idx) => (
                      <li key={idx}>
                        <button
                          onClick={() => {
                            setUsername(histUser);
                            setShowHistory(false);
                          }}
                          className="w-full text-left px-4 py-3 text-lg font-bold uppercase tracking-widest text-black hover:bg-[#E60023] hover:text-white transition-colors border-b-2 border-black last:border-b-0"
                        >
                          @{histUser}
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => handleAnalyze(false)}
            disabled={!username.trim() || isAnalyzing}
            className="w-full bg-[#E60023] border-4 border-black text-white p-4 text-2xl font-black uppercase tracking-widest hover:bg-black transition-colors disabled:bg-gray-200 disabled:border-gray-400 disabled:text-gray-400 disabled:shadow-[4px_4px_0px_0px_rgba(156,163,175,1)] disabled:cursor-not-allowed shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] rounded-none"
            style={{ fontFamily: "Impact, sans-serif" }}
          >
            GENERATE ID
          </button>
          
          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full bg-black text-white p-4 text-xs sm:text-sm font-bold uppercase tracking-widest border-4 border-[#E60023] shadow-[4px_4px_0px_0px_rgba(230,0,35,1)] mt-4"
            >
              <span className="text-[#E60023]">SYSTEM WARNING: </span>
              {errorMsg}
            </motion.div>
          )}
          
          <div className="text-center mt-2">
            <p className="text-[10px] font-black tracking-[0.2em] text-gray-500">
              * REQUIRES PUBLIC SAVED PINS TO WORK
            </p>
          </div>
          
          <button
            onClick={() => handleAnalyze(true)}
            disabled={!username.trim() || isAnalyzing}
            className="w-full bg-white border-4 border-black text-black p-3 text-xl font-black uppercase tracking-widest hover:bg-gray-100 transition-colors disabled:bg-gray-200 disabled:border-gray-400 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] rounded-none"
            style={{ fontFamily: "Impact, sans-serif" }}
          >
            FORCE REGENERATE
          </button>
        </motion.div>
      </section>

      {/* ══════════════════════════════════
          ID BADGE PRINTING (LOADING)
          ══════════════════════════════════ */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-[#f4f4f4] overflow-hidden font-mono"
          >
            {/* Subtle Grid Background */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
                backgroundSize: "40px 40px"
              }}
            />

            {/* Lottie Loading Animation */}
            <motion.div 
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative w-80 h-80 z-10 flex items-center justify-center mix-blend-multiply drop-shadow-xl"
            >
              <DotLottieReact
                src="/talent-search.json"
                loop
                autoplay
              />
            </motion.div>


            {/* Dynamic Loading Text */}
            <div className="relative z-10 flex flex-col items-center mt-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={loadingTextIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-black text-white px-4 py-1 text-sm font-bold tracking-widest uppercase mb-2 shadow-[4px_4px_0px_0px_rgba(230,0,35,0.5)]"
                >
                  {loadingPhrases[loadingTextIndex]}
                </motion.div>
              </AnimatePresence>
              
              <div className="text-gray-500 text-xs tracking-[0.3em] uppercase mt-2">
                PLEASE DO NOT CLOSE
              </div>
              
              <div className="w-64 h-1 bg-gray-300 mt-6 overflow-hidden rounded-full shadow-inner">
                <motion.div 
                  className="h-full bg-[#E60023]"
                  animate={{ width: `${loadingProgress}%` }}
                  transition={{ ease: "linear", duration: 0.3 }}
                />
              </div>
              <div className="text-gray-400 text-[10px] font-mono mt-2 font-bold tracking-widest">
                {Math.floor(loadingProgress)}%
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
