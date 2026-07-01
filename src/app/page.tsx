"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function LandingPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [username, setUsername] = useState("");
  const router = useRouter();

  const loadingPhrases = [
    "Gathering ingredients for your vibe...",
    "Stirring up your Pinterest boards...",
    "Adding a pinch of color auras...",
    "Letting your aesthetic simmer...",
    "Taste testing the final look...",
    "Almost ready to serve...",
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnalyzing) {
      interval = setInterval(() => {
        setLoadingTextIndex((prev) =>
          prev < loadingPhrases.length - 1 ? prev + 1 : prev
        );
      }, 2500);
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
    <main className="relative min-h-screen overflow-hidden font-sans">
      {/* ══════════════════════════════════
          SKY BACKGROUND
          ══════════════════════════════════ */}
      <div className="absolute inset-0 z-0">
        {/* Sky gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #4A90D9 0%, #6BA3E0 25%, #8AB8E8 50%, #A8CFF0 75%, #C8E2F8 100%)",
          }}
        />

        {/* Cloud shapes */}
        <motion.div
          className="absolute top-[8%] right-[-5%] w-[220px] h-[80px] rounded-full opacity-90"
          style={{
            background:
              "radial-gradient(ellipse, white 0%, rgba(255,255,255,0.8) 40%, transparent 70%)",
            filter: "blur(4px)",
          }}
          animate={{ x: [0, 15, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-[5%] right-[10%] w-[160px] h-[60px] rounded-full opacity-80"
          style={{
            background:
              "radial-gradient(ellipse, white 0%, rgba(255,255,255,0.7) 40%, transparent 70%)",
            filter: "blur(3px)",
          }}
          animate={{ x: [0, -10, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[5%] left-[-8%] w-[280px] h-[100px] rounded-full opacity-85"
          style={{
            background:
              "radial-gradient(ellipse, white 0%, rgba(255,255,255,0.75) 40%, transparent 70%)",
            filter: "blur(5px)",
          }}
          animate={{ x: [0, 20, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[2%] right-[-3%] w-[200px] h-[70px] rounded-full opacity-75"
          style={{
            background:
              "radial-gradient(ellipse, white 0%, rgba(255,255,255,0.7) 40%, transparent 70%)",
            filter: "blur(4px)",
          }}
          animate={{ x: [0, -12, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Small wisps */}
        <div
          className="absolute top-[15%] left-[5%] w-[100px] h-[35px] rounded-full opacity-50"
          style={{
            background:
              "radial-gradient(ellipse, white 0%, transparent 70%)",
            filter: "blur(6px)",
          }}
        />
        <div
          className="absolute bottom-[15%] right-[15%] w-[120px] h-[40px] rounded-full opacity-40"
          style={{
            background:
              "radial-gradient(ellipse, white 0%, transparent 70%)",
            filter: "blur(6px)",
          }}
        />
      </div>

      {/* ══════════════════════════════════
          HANGING SECTION (Rope, Clip, Paper)
          ══════════════════════════════════ */}
      <section className="relative z-20 flex flex-col items-center max-w-md mx-auto pt-[12vh] px-5 min-h-screen">
        
        {/* Rope / Clothesline (Spans full width, positioned absolutely behind the paper) */}
        <div className="absolute top-[12vh] mt-[35px] left-[-50vw] right-[-50vw] z-10">
          {/* Rope shadow */}
          <div
            className="absolute w-full h-[6px] rounded-full"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(139,109,70,0.8) 15%, #8B6D46 30%, #A07D50 50%, #8B6D46 70%, rgba(139,109,70,0.8) 85%, transparent 100%)",
              top: "2px",
              filter: "blur(0.5px)",
            }}
          />
          {/* Rope highlight */}
          <div
            className="absolute w-full h-[3px] rounded-full"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(190,165,120,0.6) 20%, rgba(210,185,140,0.8) 50%, rgba(190,165,120,0.6) 80%, transparent 100%)",
              top: "0px",
            }}
          />
          {/* Rope texture dots */}
          <div
            className="absolute w-full h-[5px]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(100,75,40,0.15) 8px, rgba(100,75,40,0.15) 10px)",
              top: "0px",
            }}
          />
        </div>

        {/* Clothespin (Absolutely positioned to clip exactly over the rope and top of the paper) */}
        <motion.div
          initial={{ opacity: 0, y: -30, rotate: -5 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 120 }}
          className="absolute z-30 w-[45px] h-[90px]"
          style={{ top: "calc(12vh - 10px)" }}
        >
          <Image
            src="/assets/clip.png"
            alt="Clothespin"
            fill
            sizes="45px"
            className="object-contain drop-shadow-lg"
          />
        </motion.div>

        {/* Paper Card */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotate: 2 }}
          animate={{ opacity: 1, y: 0, rotate: 0.5 }}
          transition={{ duration: 0.9, delay: 0.4, type: "spring", stiffness: 100 }}
          className="relative z-20 w-full max-w-[340px] mt-[30px]"
        >
          {/* Paper texture card */}
          <div
            className="relative px-8 pt-12 pb-8 overflow-hidden"
            style={{
              background: "linear-gradient(180deg, #F5F0E6 0%, #EDE7D9 40%, #E8E2D4 100%)",
              borderRadius: "3px",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.5)",
              /* Slightly torn/rough edge effect */
              clipPath: "polygon(0 0, 100% 0, 100% 97%, 98% 98%, 96% 97%, 94% 99%, 92% 97%, 90% 98%, 88% 97%, 85% 99%, 82% 97%, 80% 98%, 78% 97%, 75% 99%, 72% 97%, 70% 98%, 68% 97%, 65% 99%, 62% 97%, 60% 98%, 58% 97%, 55% 99%, 52% 97%, 50% 98%, 48% 97%, 45% 99%, 42% 97%, 40% 98%, 38% 97%, 35% 99%, 32% 97%, 30% 98%, 28% 97%, 25% 99%, 22% 97%, 20% 98%, 18% 97%, 15% 99%, 12% 97%, 10% 98%, 8% 97%, 5% 99%, 2% 97%, 0 98%)",
            }}
          >
            {/* Paper grain noise overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.04]"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
                backgroundSize: "200px",
                mixBlendMode: "multiply",
              }}
            />

            {/* PINSBYME header */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col items-center mb-6"
            >
              <span
                className="text-[12px] tracking-[0.25em] text-[#3B5998] font-bold uppercase"
                style={{ fontFamily: "var(--next-font-courier)" }}
              >
                PINTRESTIfy.
              </span>
              <div className="w-8 h-[1.5px] bg-[#3B5998]/30 mt-2" />
            </motion.div>

            {/* Main headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.7 }}
              className="mb-5"
            >
              <h1
                className="text-[#1a1a1a] text-[2.6rem] leading-[1.1] font-bold"
                style={{ fontFamily: "var(--next-font-courier)", letterSpacing: "-0.02em" }}
              >
                Your pins
                <br />
                tell stories.
              </h1>
              <h1
                className="text-[#2B5EA7] text-[2.6rem] leading-[1.1] font-bold"
                style={{ fontFamily: "var(--next-font-courier)", letterSpacing: "-0.02em" }}
              >
                We tell
                <br />
                your vibe.
              </h1>
            </motion.div>

            {/* Star divider */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              className="flex items-center gap-3 mb-5"
            >
              <div className="flex-1 h-[1px] bg-[#3B5998]/20" />
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="#3B5998"
                className="opacity-60"
              >
                <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" />
              </svg>
              <div className="flex-1 h-[1px] bg-[#3B5998]/20" />
            </motion.div>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.7, duration: 0.6 }}
              className="text-[#555] text-[14px] leading-[1.7] mb-6 font-medium"
              style={{ fontFamily: "var(--next-font-courier)" }}
            >
              Somewhere between 
              <br />
              pins, boards, and daydreams.
            </motion.p>@

          </div>
        </motion.div>

        {/* ══════════════════════════════════
            USERNAME INPUT (Below card)
            ══════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.3, duration: 0.6 }}
          className="w-full max-w-[340px] mt-6"
        >
          {/* Input field — paper/parchment style to match */}
          <div className="relative mb-3">
            <input
              id="username-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              placeholder="Enter your Pinterest username"
              className="w-full py-3.5 px-6 rounded-full text-center text-[14px] font-medium tracking-wide text-[#1a1a1a] placeholder-[#3B5998]/40 focus:outline-none focus:ring-2 focus:ring-[#3B5998]/30 transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(10px)",
                border: "1.5px solid rgba(59,89,152,0.25)",
                fontFamily: "var(--next-font-sans)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              }}
            />
          </div>

          {/* Let's Explore button */}
          <button
            onClick={handleAnalyze}
            disabled={!username.trim() || isAnalyzing}
            className="group flex items-center justify-center w-full py-3.5 rounded-full border-[1.5px] border-[#3B5998]/40 text-[#3B5998] text-[14px] font-bold tracking-wide transition-all duration-300 hover:bg-[#3B5998]/5 hover:border-[#3B5998]/60 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              fontFamily: "var(--next-font-sans)",
            }}
          >
            Let&apos;s explore
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:translate-x-1 transition-transform ml-2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>

          {/* Footer text */}
          <p
            className="mt-4 text-[10px] text-white/70 text-center leading-relaxed"
            style={{ textShadow: "0 1px 3px rgba(0,0,0,0.2)" }}
          >
            By continuing, you agree to our{" "}
            <a href="#" className="underline underline-offset-2 hover:text-white">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline underline-offset-2 hover:text-white">
              Privacy Policy
            </a>
          </p>
        </motion.div>
      </section>

      {/* ══════════════════════════════════
          KINETIC EDITORIAL LOADER
          ══════════════════════════════════ */}
      {/* ══════════════════════════════════
          STORAGE BOX DUMP LOADER
          ══════════════════════════════════ */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-[100] overflow-hidden flex flex-col items-center justify-center"
            style={{ backgroundColor: "#F0E8DC" }}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
              style={{ backgroundImage: "url('/assets/loading-bg.png')" }}
            />

            {/* ── SCENE ── */}
            <div className="relative flex flex-row items-end justify-center w-full h-[280px] gap-2 mb-4">
              
              {/* The Cat (Left side) */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative flex items-center justify-center w-[300px] h-auto pointer-events-none -mr-20 z-10"
              >
                <DotLottieReact
                  src="/ai-loading.lottie"
                  loop
                  autoplay
                  className="w-full h-full drop-shadow-xl"
                />
              </motion.div>

              {/* The Pan (Right side) */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="relative flex items-center justify-center w-[280px] h-auto pointer-events-none -ml-10 mb-6 z-0"
              >
                <DotLottieReact
                  src="/ai-loading-2.json"
                  loop
                  autoplay
                  className="w-full h-full drop-shadow-2xl"
                />
              </motion.div>

            </div>

            {/* Loading Typography */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-8 z-50 flex flex-col items-center justify-center min-h-[60px]"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={loadingTextIndex}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={{
                    visible: { transition: { staggerChildren: 0.08 } },
                    exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } }
                  }}
                  className="flex space-x-[0.3em]"
                >
                  {loadingPhrases[loadingTextIndex].split(" ").map((word, i) => (
                    <motion.span
                      key={i}
                      variants={{
                        hidden: { opacity: 0, y: 15, filter: "blur(4px)", scale: 0.9 },
                        visible: { opacity: 1, y: 0, filter: "blur(0px)", scale: 1, transition: { type: "spring", damping: 14, stiffness: 100 } },
                        exit: { opacity: 0, y: -10, filter: "blur(2px)", scale: 0.95 }
                      }}
                      className="text-[14px] sm:text-[16px] uppercase font-black tracking-tighter text-[#1a1a1a]"
                      style={{ fontFamily: "var(--next-font-sans)" }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.div>
              </AnimatePresence>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="mt-4 flex items-center space-x-3"
              >
                <div className="w-6 h-[1px] bg-[#1E2A45]/30" />
                <span className="text-[8px] font-mono tracking-[0.4em] uppercase text-[#3D4F72]/80 font-bold ml-1">
                  cooking
                </span>
                <div className="w-6 h-[1px] bg-[#1E2A45]/30" />
              </motion.div>
            </motion.div>

            {/* Floating ambient particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  background: ["#2B3654", "#EF476F", "#1E2A45", "#3D4F72", "#8338EC", "#D64B6A"][i],
                  left: `${15 + i * 14}%`,
                  top: `${20 + (i % 3) * 25}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0, 0.5, 0],
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  delay: 1 + i * 0.5,
                  ease: "easeInOut",
                }}
              />
            ))}

          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
