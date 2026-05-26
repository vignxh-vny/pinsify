"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [username, setUsername] = useState("");
  const router = useRouter();

  const loadingPhrases = [
    "Connecting to Pinterest...",
    "Reading your boards...",
    "Extracting color auras...",
    "Decoding your aesthetic DNA...",
    "Almost ready..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnalyzing) {
      interval = setInterval(() => {
        setLoadingTextIndex((prev) => (prev < loadingPhrases.length - 1 ? prev + 1 : prev));
      }, 2500); // Change text every 2.5 seconds
    }
    return () => clearInterval(interval);
  }, [isAnalyzing, loadingPhrases.length]);

  const handleAnalyze = async () => {
    if (!username.trim()) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/analyze", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() })
      });
      const data = await res.json();
      
      if (res.ok) {
        // Navigate to the story page with the generated profile ID
        router.push(`/story?id=${data.profileId}`);
      } else {
        alert("Error: " + data.error);
        setIsAnalyzing(false);
      }
    } catch (err) {
      alert("Something went wrong analyzing your Pinterest.");
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-halftone overflow-hidden font-sans">
      {/* ── Navigation ── */}
      <nav className="relative z-50 w-full p-6 flex justify-between items-center max-w-md mx-auto">
        <Link href="/" className="flex items-center gap-2 z-10">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center sticker-shadow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#E60023" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.689 0 1.029-.653 2.568-.994 3.995-.285 1.192.597 2.164 1.774 2.164 2.133 0 3.771-2.25 3.771-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.279 1.14c-.038.154-.127.19-.286.115-1.068-.498-1.738-2.063-1.738-3.323 0-2.708 1.968-5.198 5.679-5.198 2.986 0 5.309 2.128 5.309 4.966 0 2.967-1.87 5.357-4.464 5.357-1.053 0-1.897-.562-2.185-1.125l-.596 2.308c-.215.845-.806 1.884-1.191 2.536 1.008.31 2.072.477 3.165.477 6.627 0 12-5.372 12-12 0-6.628-5.373-12-12-12z" />
            </svg>
          </div>
          <span className="text-[20px] font-bold text-white font-sans tracking-tight">
            Pinterestify
          </span>
        </Link>

        <button className="p-2 z-10">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </nav>

      {/* ═══════════════════════════════════════
          BACKGROUND STICKERS & DOODLES
          ═══════════════════════════════════════ */}
      <div className="absolute inset-0 pointer-events-none max-w-md mx-auto overflow-hidden">
        {/* Top Right Flower */}
        <motion.div 
          className="absolute top-[8%] right-[15%]"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          <svg width="40" height="40" viewBox="0 0 100 100" fill="none" stroke="#fcdbb0" strokeWidth="3">
            <path d="M50 20 C 60 10, 70 20, 50 40 C 80 20, 90 30, 60 50 C 90 60, 80 70, 50 60 C 70 80, 60 90, 50 80 C 40 90, 30 80, 50 60 C 20 70, 10 60, 40 50 C 10 30, 20 20, 50 40 C 30 20, 40 10, 50 20 Z" />
            <circle cx="50" cy="50" r="8" fill="#fcdbb0" />
          </svg>
        </motion.div>

        {/* Squiggly Arrow Top Left */}
        <motion.svg 
          width="80" height="80" viewBox="0 0 100 100" 
          className="absolute top-[14%] left-[6%] -rotate-12" 
          fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        >
          <path d="M70,20 Q90,10 80,40 Q70,70 20,80" />
          <path d="M35,65 L20,80 L25,60" />
        </motion.svg>

        {/* "YOUR WORLD" Sticker */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 6 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute top-[8%] right-[2%] sm:right-[4%] scrapbook-card px-4 py-3 rotate-6 max-w-[140px] z-20"
        >
          <p className="font-bold text-[11px] leading-tight text-center uppercase tracking-wider">
            Your<br/>World, Your<br/>Aesthetic.
          </p>
          <svg width="24" height="24" viewBox="0 0 100 100" fill="black" className="absolute -bottom-3 -right-3 rotate-[15deg]">
            <path d="M50,10 L55,40 L85,45 L55,50 L50,80 L45,50 L15,45 L45,40 Z" />
          </svg>
        </motion.div>

        {/* "made for you" stamp */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="absolute top-[22%] right-[2%] sm:right-[8%] z-20"
        >
          <div className="relative border-[1.5px] border-black rounded-[50%] w-[90px] h-[45px] flex items-center justify-center -rotate-12">
            <p className="font-serif italic font-bold text-[12px] text-black pt-1">
              made<br/>for you
            </p>
            {/* Sparkle */}
            <svg width="20" height="20" viewBox="0 0 100 100" fill="none" stroke="black" strokeWidth="2" className="absolute -top-4 -right-4">
              <path d="M50,10 L55,40 L85,45 L55,50 L50,80 L45,50 L15,45 L45,40 Z" />
            </svg>
          </div>
        </motion.div>

        {/* Bottom Right Sticker */}
        <motion.div 
          initial={{ opacity: 0, y: 20, rotate: 10 }}
          animate={{ opacity: 1, y: 0, rotate: -6 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="absolute bottom-[3%] right-[2%] px-4 py-3 rotate-[-6deg] z-20 bg-[#9370DB] rounded-md shadow-lg border border-black/20"
        >
          <p className="font-bold text-[12px] leading-tight text-center uppercase text-black tracking-wide">
            Aesthetics<br/>start here.
          </p>
          {/* Mouse cursor icon */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5" className="absolute -bottom-4 -right-2">
            <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
            <path d="M13 13l6 6" />
          </svg>
        </motion.div>

        {/* Bottom Left Purple Flower Image/SVG */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="absolute -bottom-4 -left-6 z-20 w-24 h-24"
        >
          {/* Abstract flower shape */}
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
             <path d="M50 10 C 65 10, 75 30, 50 45 C 75 30, 90 45, 50 55 C 90 45, 75 70, 50 50 C 75 70, 65 90, 50 65 C 35 90, 25 70, 50 50 C 25 70, 10 45, 50 55 C 10 45, 25 30, 50 45 C 25 30, 35 10, 50 10 Z" fill="#663399" stroke="#33194D" strokeWidth="2"/>
             <circle cx="50" cy="50" r="12" fill="#1a1a1a" />
             <circle cx="50" cy="50" r="4" fill="#663399" />
          </svg>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════
          MAIN CONTENT HERO
          ═══════════════════════════════════════ */}
      <section className="relative z-10 flex flex-col items-center max-w-md mx-auto pt-10 pb-8 px-5 h-[calc(100vh-80px)]">
        
        {/* Giant Typography */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full text-left -ml-2"
        >
          <h1 
            className="text-[3.8rem] sm:text-[4.8rem] leading-[0.85] text-scrapbook-title uppercase tracking-tighter"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Discover
            <br />
            Your
          </h1>
          <h1 
            className="text-[3.5rem] sm:text-[4.5rem] leading-[0.85] text-gradient-silver uppercase tracking-tighter sticker-shadow mt-1"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Pinterest
            <br />
            World
          </h1>
        </motion.div>

        {/* Middle Section: Text & 3D Logo stack */}
        <div className="w-full flex-1 flex flex-row items-center justify-between relative mt-6 mb-8">
          
          {/* Subtext on the left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-1/2 relative z-30 pt-16"
          >
            <p className="text-white text-[15px] font-medium leading-snug drop-shadow-md">
              AI-powered insights
              <br />
              to unlock the story
              <br />
              behind your saves.
            </p>
            <svg width="120" height="15" viewBox="0 0 120 15" className="mt-1" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round">
              <path d="M2,10 Q30,2 60,8 T118,5" />
            </svg>
          </motion.div>

          {/* Layered Images / 3D Logo on the right */}
          <div className="w-1/2 relative h-full flex items-center justify-center">
            
            {/* Background Scrapbook Paper 1 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: -15 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="absolute w-[140px] h-[160px] right-2 top-0 bg-[#e3d7c5] rounded-sm shadow-xl border border-black/10 overflow-hidden"
              style={{ backgroundImage: "radial-gradient(rgba(0,0,0,0.1) 1px, transparent 1px)", backgroundSize: "4px 4px" }}
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#8a4fff] rotate-45 transform translate-x-8 -translate-y-8 blur-sm opacity-50" />
            </motion.div>

            {/* Background Image / Polaroid */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.5, rotate: 10 }}
              animate={{ opacity: 1, scale: 1, rotate: 8 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="absolute w-[130px] h-[150px] right-6 top-4 bg-white p-2 shadow-2xl border border-black/5"
            >
              <div className="w-full h-full bg-[#fcdbb0] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/40 to-pink-500/40" />
                <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=80" alt="aesthetic" className="w-full h-full object-cover mix-blend-multiply opacity-80" />
              </div>
            </motion.div>

            {/* 3D Pinterest Logo representation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.2, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.5 }}
              className="absolute right-0 top-10 w-[150px] h-[150px] rounded-full flex items-center justify-center z-20"
              style={{
                background: "radial-gradient(circle at 30% 30%, #ff4d4d, #cc0000 70%, #800000)",
                boxShadow: "-10px 15px 25px rgba(0,0,0,0.4), inset -5px -5px 15px rgba(0,0,0,0.3), inset 5px 5px 15px rgba(255,255,255,0.4)"
              }}
            >
              <svg width="90" height="90" viewBox="0 0 24 24" fill="white" style={{ filter: "drop-shadow(-2px 4px 6px rgba(0,0,0,0.3))" }}>
                <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.689 0 1.029-.653 2.568-.994 3.995-.285 1.192.597 2.164 1.774 2.164 2.133 0 3.771-2.25 3.771-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.279 1.14c-.038.154-.127.19-.286.115-1.068-.498-1.738-2.063-1.738-3.323 0-2.708 1.968-5.198 5.679-5.198 2.986 0 5.309 2.128 5.309 4.966 0 2.967-1.87 5.357-4.464 5.357-1.053 0-1.897-.562-2.185-1.125l-.596 2.308c-.215.845-.806 1.884-1.191 2.536 1.008.31 2.072.477 3.165.477 6.627 0 12-5.372 12-12 0-6.628-5.373-12-12-12z" />
              </svg>
            </motion.div>
            
            {/* White burst/asterisk under 3D logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="absolute left-0 bottom-4 z-10"
            >
              <svg width="50" height="50" viewBox="0 0 100 100" fill="#fdfcf0" stroke="black" strokeWidth="3">
                <path d="M50,10 L55,40 L85,45 L55,50 L50,80 L45,50 L15,45 L45,40 Z" />
              </svg>
            </motion.div>

          </div>
        </div>

        {/* ── Call to Action ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="w-full mt-auto mb-4 z-30"
        >
          <div className="flex flex-col gap-3">
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your Pinterest Username"
              className="w-full py-4 px-6 rounded-full font-bold text-black text-[16px] tracking-wide text-center border-2 border-black focus:outline-none focus:ring-4 focus:ring-[#E60023]/30 shadow-[0_4px_0_0_#000]"
            />
            <button
              onClick={handleAnalyze}
              disabled={!username.trim() || isAnalyzing}
              className="group relative flex items-center justify-center w-full py-4 px-6 rounded-full font-bold text-black text-[16px] tracking-wide overflow-hidden btn-scrapbook disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Analyze Aesthetic
              
              <div className="absolute right-6 opacity-80 group-hover:translate-x-1 transition-all">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </button>
          </div>
          
          <p className="mt-5 text-[10px] text-white/70 text-center mx-auto max-w-[280px]">
            By continuing, you agree to our <a href="#" className="underline underline-offset-2">Terms of Service</a> and <a href="#" className="underline underline-offset-2">Privacy Policy</a>
          </p>
        </motion.div>

      </section>

      {/* ═══════════════════════════════════════
          CINEMATIC LOADING OVERLAY
          ═══════════════════════════════════════ */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="relative z-10 mb-8"
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.689 0 1.029-.653 2.568-.994 3.995-.285 1.192.597 2.164 1.774 2.164 2.133 0 3.771-2.25 3.771-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.279 1.14c-.038.154-.127.19-.286.115-1.068-.498-1.738-2.063-1.738-3.323 0-2.708 1.968-5.198 5.679-5.198 2.986 0 5.309 2.128 5.309 4.966 0 2.967-1.87 5.357-4.464 5.357-1.053 0-1.897-.562-2.185-1.125l-.596 2.308c-.215.845-.806 1.884-1.191 2.536 1.008.31 2.072.477 3.165.477 6.627 0 12-5.372 12-12 0-6.628-5.373-12-12-12z" />
              </svg>
            </motion.div>

            <div className="relative z-10 h-12 flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={loadingTextIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="text-lg font-serif italic text-white/80"
                >
                  {loadingPhrases[loadingTextIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
