"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { mockStoryData } from "@/lib/mock-data";
import WelcomeCard from "@/components/story/WelcomeCard";
import StatsCard from "@/components/story/StatsCard";
import IdentityRevealCard from "@/components/story/IdentityRevealCard";
import FeelsLikeCard from "@/components/story/FeelsLikeCard";
import ColorAuraCard from "@/components/story/ColorAuraCard";
import ThemesCard from "@/components/story/ThemesCard";
import VibeCard from "@/components/story/VibeCard";
import HiddenAestheticCard from "@/components/story/HiddenAestheticCard";
import DriftCard from "@/components/story/DriftCard";
import ShareCard from "@/components/story/ShareCard";

const TOTAL_CARDS = 10;
const AUTO_ADVANCE_MS = 12000;

const cardVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 1,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 1,
  }),
};

function StoryViewer() {
  const [currentCard, setCurrentCard] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [data, setData] = useState(mockStoryData);
  const [isLoading, setIsLoading] = useState(true);
  
  const searchParams = useSearchParams();
  const profileId = searchParams.get("id");

  useEffect(() => {
    if (profileId) {
      fetch(`/api/profile?id=${profileId}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.data) {
            setData(json.data);
          }
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [profileId]);

  const goNext = useCallback(() => {
    if (currentCard < TOTAL_CARDS - 1) {
      setDirection(1);
      setCurrentCard((prev) => prev + 1);
    }
  }, [currentCard]);

  const goPrev = useCallback(() => {
    if (currentCard > 0) {
      setDirection(-1);
      setCurrentCard((prev) => prev - 1);
    }
  }, [currentCard]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goNext();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  // Auto-advance
  useEffect(() => {
    if (isPaused || currentCard >= TOTAL_CARDS - 1) return;
    const timer = setTimeout(goNext, AUTO_ADVANCE_MS);
    return () => clearTimeout(timer);
  }, [currentCard, isPaused, goNext]);

  const cards = [
    <WelcomeCard key="welcome" data={data} isActive={currentCard === 0} />,
    <StatsCard key="stats" data={data} isActive={currentCard === 1} />,
    <IdentityRevealCard key="identity" data={data} isActive={currentCard === 2} />,
    <FeelsLikeCard key="feels" data={data} isActive={currentCard === 3} />,
    <ColorAuraCard key="color" data={data} isActive={currentCard === 4} />,
    <ThemesCard key="themes" data={data} isActive={currentCard === 5} />,
    <VibeCard key="vibe" data={data} isActive={currentCard === 6} />,
    <HiddenAestheticCard key="hidden" data={data} isActive={currentCard === 7} />,
    <DriftCard key="drift" data={data} isActive={currentCard === 8} />,
    <ShareCard key="share" data={data} isActive={currentCard === 9} />,
  ];

  if (isLoading) {
    return (
      <main className="min-h-dvh flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh flex items-center justify-center bg-[var(--bg-primary)]">
      <div className="story-viewport">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 z-50 flex gap-1 p-3">
          {Array.from({ length: TOTAL_CARDS }).map((_, i) => (
            <div
              key={i}
              className="flex-1 h-[3px] rounded-full overflow-hidden bg-white/10"
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "var(--text-primary)",
                }}
                initial={{ width: "0%" }}
                animate={{
                  width:
                    i < currentCard
                      ? "100%"
                      : i === currentCard
                        ? "100%"
                        : "0%",
                }}
                transition={{
                  duration: i === currentCard ? AUTO_ADVANCE_MS / 1000 : 0.3,
                  ease: i === currentCard ? "linear" : "easeOut",
                }}
              />
            </div>
          ))}
        </div>

        {/* Touch / click zones */}
        <div
          className="absolute inset-0 z-40 flex"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div className="w-1/3 h-full cursor-pointer" onClick={goPrev} />
          <div className="w-1/3 h-full" />
          <div className="w-1/3 h-full cursor-pointer" onClick={goNext} />
        </div>

        {/* Card renderer */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentCard}
            custom={direction}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "tween", duration: 0.25, ease: "easeInOut" },
              opacity: { duration: 0.1 },
            }}
            className="story-card"
          >
            {cards[currentCard]}
          </motion.div>
        </AnimatePresence>

        {/* Card counter */}
        <div className="absolute bottom-4 left-0 right-0 z-50 flex justify-center">
          <span className="text-[11px] text-[var(--text-secondary)] font-black font-mono tracking-wider">
            {currentCard + 1} / {TOTAL_CARDS}
          </span>
        </div>
      </div>
    </main>
  );
}

export default function StoryPage() {
  return (
    <Suspense fallback={<main className="min-h-dvh flex items-center justify-center bg-black"></main>}>
      <StoryViewer />
    </Suspense>
  );
}
