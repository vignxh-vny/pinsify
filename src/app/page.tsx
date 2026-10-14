"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import IDBadgeCard from "@/components/story/IDBadgeCard";
import { StoryData } from "@/types/story";

function PinCheckApp() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanStage, setScanStage] = useState(0);
  const [isFail, setIsFail] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [statusSub, setStatusSub] = useState("");
  const [username, setUsername] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null);

  const [cardData, setCardData] = useState<StoryData>({
    user: {
      username: "",
      displayName: "",
      avatarUrl: "",
      totalPins: 0,
      totalBoards: 0,
    },
    identity: {
      primary: "",
      secondary: [],
      emoji: "✨",
      tagline: "",
      description: "",
    },
    colorAura: {
      name: "",
      colors: [],
      description: "",
      mood: "",
    },
    themes: [],
    vibes: [],
    feelsLike: "",
    hiddenAesthetics: [],
    drift: [],
  });

  const searchParams = useSearchParams();
  const profileId = searchParams.get("id");
  const queryUser = searchParams.get("u");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("pinsbyme_history");
      if (stored) setHistory(JSON.parse(stored));
    } catch (e) {
      console.error("Failed to load history", e);
    }
  }, []);

  const handleAnalyze = useCallback(async (cleanUser: string, force: boolean = false) => {
    if (!cleanUser) return;

    try {
      setHistory((prev) => {
        const newHistory = [cleanUser, ...prev.filter((u) => u.toLowerCase() !== cleanUser.toLowerCase())].slice(0, 5);
        localStorage.setItem("pinsbyme_history", JSON.stringify(newHistory));
        return newHistory;
      });
    } catch {}

    setIsScanning(true);
    setIsFail(false);
    setScanStage(0);
    setStatusMsg("CONNECTING TO PINTEREST...");
    setStatusSub("Knocking on your boards.");

    setCardData({
      user: {
        username: cleanUser,
        displayName: cleanUser,
        avatarUrl: "",
        totalPins: 0,
        totalBoards: 0,
      },
      identity: {
        primary: "",
        secondary: [],
        emoji: "✨",
        tagline: "",
        description: "",
      },
      colorAura: {
        name: "",
        colors: [],
        description: "",
        mood: "",
      },
      themes: [],
      vibes: [],
      feelsLike: "",
      hiddenAesthetics: [],
      drift: [],
    });

    try {
      const res = await fetch("/api/analyze?stream=true", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify({ username: cleanUser, force }),
      });

      if (!res.ok || !res.body) {
        const errJson = await res.json().catch(() => ({}));
        setIsFail(true);
        setStatusMsg("COULD NOT READ THAT ACCOUNT");
        setStatusSub(errJson.error || "Check the username, and make sure its saved pins are public.");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          const eventMatch = line.match(/^event:\s*(.+)$/m);
          const dataMatch = line.match(/^data:\s*(.+)$/m);
          const event = eventMatch ? eventMatch[1].trim() : "message";
          const payload = dataMatch ? JSON.parse(dataMatch[1].trim()) : {};

          if (event === "stage1") {
            setScanStage(1);
            setStatusMsg("COUNTING YOUR BOARDS...");
            setStatusSub("Even the ones you forgot about.");
            setCardData((prev) => ({
              ...prev,
              categoryTag: payload.category,
              user: {
                ...prev.user,
                totalPins: payload.pins,
                totalBoards: payload.boards,
              },
            }));
          } else if (event === "stage2") {
            setScanStage(2);
            setStatusMsg("READING YOUR PINS...");
            setStatusSub("Judging your 3am saves.");
            setCardData((prev) => ({
              ...prev,
              gradient: payload.gradient,
              headCategories: payload.head,
              fixation: payload.fixation,
              alsoSaves: payload.also,
            }));
          } else if (event === "stage3") {
            setScanStage(3);
            setStatusMsg("FINDING YOUR VIBE...");
            setStatusSub("Naming the aesthetic. No pressure.");
            setCardData((prev) => ({
              ...prev,
              identity: {
                ...prev.identity,
                primary: payload.title,
              },
            }));
          } else if (event === "stage4") {
            setScanStage(4);
            setStatusMsg("WRITING YOUR ROAST...");
            setStatusSub("It will be affectionate. Mostly.");
            setCardData((prev) => ({
              ...prev,
              identity: {
                ...prev.identity,
                tagline: payload.quote,
              },
            }));
          } else if (event === "done") {
            setTimeout(() => {
              setScanStage(5);
              setCardData(payload.storyData);
              if (payload.profileId) {
                setCurrentProfileId(payload.profileId);
                window.history.replaceState(null, "", `/?id=${payload.profileId}`);
              }
            }, 1200);
          } else if (event === "error") {
            setIsFail(true);
            setStatusMsg("COULD NOT READ THAT ACCOUNT");
            setStatusSub(payload.message || "Check the username, and make sure its saved pins are public.");
          }
        }
      }
    } catch {
      setIsFail(true);
      setStatusMsg("COULD NOT READ THAT ACCOUNT");
      setStatusSub("Check the username, and make sure its saved pins are public.");
    }
  }, []);

  // Check URL params on initial load
  useEffect(() => {
    if (profileId) {
      setCurrentProfileId(profileId);
      setIsScanning(true);
      fetch(`/api/profile?id=${profileId}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.data) {
            setCardData(json.data);
            setScanStage(5);
          } else {
            setIsFail(true);
            setStatusMsg("PROFILE NOT FOUND");
            setStatusSub("Could not locate this saved Pinterest ID card.");
          }
        })
        .catch(() => {
          setIsFail(true);
          setStatusMsg("PROFILE NOT FOUND");
          setStatusSub("Could not locate this saved Pinterest ID card.");
        });
    } else if (queryUser) {
      const clean = queryUser.replace("@", "").trim().toLowerCase();
      setUsername(clean);
      handleAnalyze(clean, false);
    }
  }, [profileId, queryUser, handleAnalyze]);

  const filteredHistory =
    username.trim() === "" ? [] : history.filter((h) => h.toLowerCase().includes(username.toLowerCase()));

  // Render Dark Scan / Card Screen
  if (isScanning) {
    return (
      <main className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#05060b] select-none">
        {/* Radial Dark Space Background matching reference */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(ellipse at 50% 40%, #11122a 0%, #05060b 62%)",
          }}
        />

        <div className="relative z-10 w-full flex flex-col items-center justify-center p-4">
          <IDBadgeCard
            data={cardData}
            profileId={currentProfileId || undefined}
            stage={scanStage}
            isLoading={scanStage < 5 && !isFail}
            isFail={isFail}
            statusMessage={statusMsg}
            statusSub={statusSub}
            onRetry={() => {
              setIsScanning(false);
              setIsFail(false);
            }}
          />
        </div>
      </main>
    );
  }

  // Render Initial Brutalist Input Screen
  return (
    <main className="relative min-h-screen overflow-hidden font-sans bg-[#f4f4f4] flex flex-col items-center justify-center">
      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Paper Crinkle Overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-20 mix-blend-multiply"
        style={{
          backgroundImage:
            "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')",
        }}
      />

      <section className="relative z-10 w-full max-w-md px-6 flex flex-col items-center mt-[-10vh]">
        {/* Top Badges */}
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
            className="text-[#E60023] font-black text-2xl tracking-normal"
            style={{ fontFamily: "var(--next-font-anton), Impact, sans-serif" }}
          >
            PIN CHECK
          </motion.div>
        </motion.div>

        {/* Headline */}
        <div className="w-full flex flex-col mb-10 relative">
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-black font-black uppercase text-[2.95rem] sm:text-[3.4rem] leading-[0.85] tracking-normal z-10 whitespace-nowrap"
              style={{ fontFamily: "var(--next-font-anton), Impact, sans-serif" }}
            >
              YOUR PINS
            </motion.h1>
          </div>
          <div className="overflow-hidden bg-[#E60023] w-fit px-2 mt-2 -ml-2 z-20 shadow-lg rotate-1">
            <motion.h1
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-white font-black uppercase text-[2.95rem] sm:text-[3.4rem] leading-[0.9] tracking-normal whitespace-nowrap"
              style={{ fontFamily: "var(--next-font-anton), Impact, sans-serif" }}
            >
              ARE SNITCHING.
            </motion.h1>
          </div>

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

        {/* Input & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex flex-col gap-4"
        >
          <div className="relative">
            <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 pl-1">
              <span className="text-[#E60023] mr-1">*</span>
              No sign in required, just your username is enough
            </p>
            <div className="flex items-center bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-within:border-[#E60023] transition-colors w-full relative z-20">
              <span className="pl-4 text-xl font-bold text-black select-none">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setShowHistory(false);
                    const clean = username.replace("@", "").trim().toLowerCase();
                    handleAnalyze(clean, false);
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
                            const clean = histUser.replace("@", "").trim().toLowerCase();
                            handleAnalyze(clean, false);
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
            onClick={() => {
              const clean = username.replace("@", "").trim().toLowerCase();
              handleAnalyze(clean, false);
            }}
            disabled={!username.trim()}
            className="w-full bg-[#E60023] border-4 border-black text-white p-4 text-2xl font-black uppercase tracking-widest hover:bg-black transition-colors disabled:bg-gray-200 disabled:border-gray-400 disabled:text-gray-400 disabled:shadow-[4px_4px_0px_0px_rgba(156,163,175,1)] disabled:cursor-not-allowed shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] rounded-none cursor-pointer"
            style={{ fontFamily: "Impact, sans-serif" }}
          >
            GENERATE ID
          </button>

          <div className="text-center mt-2">
            <p className="text-[10px] font-black tracking-[0.2em] text-gray-500">
              * REQUIRES PUBLIC SAVED PINS TO WORK
            </p>
          </div>

          <button
            onClick={() => {
              const clean = username.replace("@", "").trim().toLowerCase();
              handleAnalyze(clean, true);
            }}
            disabled={!username.trim()}
            className="w-full bg-white border-4 border-black text-black p-3 text-xl font-black uppercase tracking-widest hover:bg-gray-100 transition-colors disabled:bg-gray-200 disabled:border-gray-400 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] rounded-none cursor-pointer"
            style={{ fontFamily: "Impact, sans-serif" }}
          >
            FORCE REGENERATE
          </button>
        </motion.div>
      </section>
    </main>
  );
}

export default function LandingPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#05060b]" />}>
      <PinCheckApp />
    </Suspense>
  );
}
