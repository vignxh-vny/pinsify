"use client";

import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { StoryData } from "@/types/story";
import * as htmlToImage from "html-to-image";
import "./id-badge-card.css";

interface IDBadgeCardProps {
  data: StoryData;
  profileId?: string;
  stage?: number; // 0..4, 5 for done/ready
  isLoading?: boolean;
  isFail?: boolean;
  isArchive?: boolean;
  statusMessage?: string;
  statusSub?: string;
  onRetry?: () => void;
  onShareComplete?: () => void;
}

async function copyToClipboard(text: string): Promise<boolean> {
  // 1. Modern Clipboard API (available in secure contexts: https or localhost)
  if (typeof navigator !== "undefined" && navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to execCommand
    }
  }

  // 2. Fallback for insecure contexts (e.g. http://192.168.x.x:3000 on mobile)
  if (typeof document !== "undefined") {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.opacity = "0";
      textArea.setAttribute("readonly", "");
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);
      if (successful) return true;
    } catch {
      // Fall through to prompt
    }
  }

  // 3. Last-resort fallback for mobile webviews without clipboard access
  try {
    window.prompt("Copy your PinCheck link:", text);
    return true;
  } catch {
    return false;
  }
}

export default function IDBadgeCard({
  data,
  profileId,
  stage = 5,
  isLoading = false,
  isFail = false,
  isArchive = false,
  statusMessage,
  statusSub,
  onRetry,
}: IDBadgeCardProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLSpanElement>(null);
  const imgFrameRef = useRef<HTMLDivElement>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [typedQuote, setTypedQuote] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  }, []);

  const username = data?.user?.username || "curator";
  const cleanUsername = username.replace("@", "").toLowerCase();
  const currentYear = new Date().getFullYear();
  const cardYear = `20.${String(currentYear).slice(-2)}`;

  const primaryName = (data?.identity?.primary || "").toUpperCase();
  const rawTagline = (data?.identity?.tagline || "").trim().toUpperCase();

  const defaultProducts = useMemo(() => {
    const colorGradients = [
      "linear-gradient(135deg, #e2278d, #7a2cff)",
      "linear-gradient(135deg, #d42a2a, #ff8a3d)",
      "linear-gradient(135deg, #19b6ff, #7a2cff)",
      "linear-gradient(135deg, #2f9e6b, #19c6c6)",
    ];
    const aestheticQuery = primaryName || cleanUsername || "aesthetic";
    return [
      {
        title: "Archival Art Print",
        note: "Museum-grade visual print",
        emoji: "🖼️",
        bg: colorGradients[0],
        url: `https://www.amazon.in/s?k=${encodeURIComponent(aestheticQuery + " aesthetic print")}`,
      },
      {
        title: "Vintage Canvas Tote",
        note: "Heavyweight daily essential",
        emoji: "👜",
        bg: colorGradients[1],
        url: `https://www.amazon.in/s?k=${encodeURIComponent(aestheticQuery + " aesthetic tote bag")}`,
      },
      {
        title: "Ambient Studio Lamp",
        note: "Warm diffused aesthetic glow",
        emoji: "💡",
        bg: colorGradients[2],
        url: `https://www.amazon.in/s?k=${encodeURIComponent(aestheticQuery + " aesthetic desk lamp")}`,
      },
      {
        title: "Curator Grid Journal",
        note: "Hardcover archive notebook",
        emoji: "📓",
        bg: colorGradients[3],
        url: `https://www.amazon.in/s?k=${encodeURIComponent(aestheticQuery + " aesthetic journal")}`,
      },
    ];
  }, [primaryName, cleanUsername]);

  const products = useMemo(() => {
    if (data?.shopProducts && data.shopProducts.length > 0) {
      return data.shopProducts;
    }
    return defaultProducts;
  }, [data?.shopProducts, defaultProducts]);

  const hasProducts = products.length > 0;
  const productCountFormatted = String(products.length).padStart(2, "0");

  // Dynamic font sizing for primary aesthetic name
  const nameFontSize = useMemo(() => {
    const len = primaryName.length;
    if (len === 0) return "11.6cqw";
    return Math.min(12.8, 76 / (len * 0.5)).toFixed(1) + "cqw";
  }, [primaryName]);

  // Fit the signature handle to the frame width dynamically
  const fitHandle = useCallback(() => {
    if (!handleRef.current || !imgFrameRef.current) return;
    const el = handleRef.current;
    const frame = imgFrameRef.current;
    el.style.fontSize = "100px";
    const w = el.scrollWidth || 1;
    const target = frame.clientWidth * 0.8;
    const size = Math.min((100 * target) / w, frame.clientWidth * 0.26);
    el.style.fontSize = `${size}px`;
  }, []);

  useEffect(() => {
    fitHandle();
    if (typeof document !== "undefined" && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(fitHandle);
    }
    window.addEventListener("resize", fitHandle);
    return () => window.removeEventListener("resize", fitHandle);
  }, [fitHandle, cleanUsername]);

  // Generate deterministic barcode rects from username
  const barcodeBars = useMemo(() => {
    const seed = cleanUsername.toUpperCase();
    let h = 0;
    for (let i = 0; i < seed.length; i++) {
      h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    }
    const rnd = () => {
      h = (h * 1664525 + 1013904223) >>> 0;
      return h / 4294967296;
    };
    const bars: { x: number; w: number }[] = [];
    let x = 0;
    while (x < 100) {
      const w = 1 + Math.floor(rnd() * 3);
      const gap = 1 + Math.floor(rnd() * 2);
      bars.push({ x, w });
      x += w + gap;
    }
    return bars;
  }, [cleanUsername]);

  // Typewriter effect for roast quote when reaching Stage 4
  useEffect(() => {
    if (stage < 4 || !rawTagline) {
      setTypedQuote("");
      setIsTyping(false);
      return;
    }

    const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fullText = `"${rawTagline}"`;

    if (prefersReducedMotion || !isLoading) {
      setTypedQuote(fullText);
      setIsTyping(false);
      return;
    }

    let i = 0;
    setTypedQuote("");
    setIsTyping(true);

    const interval = setInterval(() => {
      i += 2;
      setTypedQuote(fullText.slice(0, i));
      if (i >= fullText.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 28);

    return () => clearInterval(interval);
  }, [stage, rawTagline, isLoading]);

  // Track isFlipped with a ref to allow seamless physics interpolation without restarting loop
  const isFlippedRef = useRef(isFlipped);
  useEffect(() => {
    isFlippedRef.current = isFlipped;
  }, [isFlipped]);

  // 3D physics and tilt loop with flip support
  useEffect(() => {
    const card = cardRef.current;
    const stageEl = stageRef.current;
    if (!card || !stageEl) return;

    if (isArchive) {
      const s = card.style;
      s.setProperty("--rx", "-3deg");
      s.setProperty("--ry", "5deg");
      s.setProperty("--flip", "0deg");
      s.setProperty("--ready", "1");
      s.setProperty("--mx", "60%");
      s.setProperty("--my", "40%");
      s.setProperty("--hx", "55%");
      s.setProperty("--hy", "45%");
      s.setProperty("--holo", "0.35");
      s.setProperty("--glare", "0.45");
      s.setProperty("--sx", "-8px");
      s.setProperty("--sy", "16px");
      return;
    }

    const MAX = 18;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let fl = isFlippedRef.current ? 180 : 0;
    let rd = isLoading ? 0 : 1;
    let active = false;
    let lastMove = 0;
    let animId: number;

    const setTarget = (clientX: number, clientY: number) => {
      const r = card.getBoundingClientRect();
      const nx = (clientX - (r.left + r.width / 2)) / (r.width / 2);
      const ny = (clientY - (r.top + r.height / 2)) / (r.height / 2);
      tx = Math.max(-1, Math.min(1, nx * 0.9));
      ty = Math.max(-1, Math.min(1, ny * 0.9));
      active = true;
      lastMove = performance.now();
    };

    const handlePointerMove = (e: PointerEvent) => {
      setTarget(e.clientX, e.clientY);
    };

    const handlePointerLeave = () => {
      active = false;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);
    document.addEventListener("mouseleave", handlePointerLeave);

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma == null) return;
      tx = Math.max(-1, Math.min(1, e.gamma / 30));
      ty = Math.max(-1, Math.min(1, ((e.beta || 45) - 45) / 30));
      active = true;
      lastMove = performance.now();
    };

    let orientEnabled = false;
    const enableOrientation = () => {
      if (orientEnabled || typeof window === "undefined" || !("DeviceOrientationEvent" in window)) return;
      const doe = window.DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<string>;
      };
      if (typeof doe.requestPermission === "function") {
        doe
          .requestPermission()
          .then((state) => {
            if (state === "granted") {
              window.addEventListener("deviceorientation", handleOrientation);
              orientEnabled = true;
            }
          })
          .catch(() => {});
      } else {
        window.addEventListener("deviceorientation", handleOrientation);
        orientEnabled = true;
      }
    };

    stageEl.addEventListener("pointerdown", enableOrientation, { once: true });

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderLoop = (t: number) => {
      if (!active || t - lastMove > 2500) {
        tx = Math.sin(t / 1700) * 0.45;
        ty = Math.cos(t / 2100) * 0.3;
      }

      if (prefersReducedMotion) {
        tx = 0;
        ty = 0;
      }

      cx += (tx - cx) * 0.1;
      cy += (ty - cy) * 0.1;

      const targetFl = isFlippedRef.current ? 180 : 0;
      const targetRd = isLoading ? 0 : 1;

      if (prefersReducedMotion) {
        fl = targetFl;
        rd = targetRd;
      } else {
        fl += (targetFl - fl) * 0.14;
        rd += (targetRd - rd) * 0.06;
      }

      const ry = cx * MAX;
      const rx = -cy * MAX;
      const s = card.style;

      s.setProperty("--flip", `${fl.toFixed(2)}deg`);
      s.setProperty("--ready", `${rd.toFixed(3)}`);
      s.setProperty("--rx", `${rx.toFixed(2)}deg`);
      s.setProperty("--ry", `${ry.toFixed(2)}deg`);
      s.setProperty("--mx", `${(50 + cx * 50).toFixed(1)}%`);
      s.setProperty("--my", `${(50 + cy * 50).toFixed(1)}%`);
      s.setProperty("--hx", `${(50 + cx * 45).toFixed(1)}%`);
      s.setProperty("--hy", `${(50 + cy * 45).toFixed(1)}%`);
      const d = Math.min(1, Math.hypot(cx, cy));
      s.setProperty("--holo", (0.22 + d * 0.55).toFixed(2));
      s.setProperty("--glare", (0.35 + d * 0.65).toFixed(2));
      s.setProperty("--sx", `${(-cx * 26).toFixed(1)}px`);
      s.setProperty("--sy", `${(-cy * 26 + 18).toFixed(1)}px`);

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("mouseleave", handlePointerLeave);
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [isArchive, isLoading]);

  // Flip Toggle
  const toggleFlip = useCallback(() => {
    if (isLoading) return;
    setIsFlipped((prev) => !prev);
  }, [isLoading]);

  // Pointer Tap detection (prevents dragging from flipping, responsive to mobile touch)
  const downRef = useRef<{ x: number; y: number; t: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    downRef.current = { x: e.clientX, y: e.clientY, t: performance.now() };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!downRef.current) return;
    const moved = Math.hypot(e.clientX - downRef.current.x, e.clientY - downRef.current.y);
    const dt = performance.now() - downRef.current.t;
    downRef.current = null;
    const target = e.target as HTMLElement;
    if (moved < 25 && dt < 600 && !target.closest("a, button")) {
      toggleFlip();
    }
  };

  // High-res Image Export
  const handleDownload = async () => {
    setIsSaving(true);
    try {
      // 1. Try high-res server-rendered story export if profileId is available
      if (profileId) {
        try {
          const res = await fetch(`/api/og/${profileId}?format=story`);
          if (res.ok) {
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.download = `pincheck-story-${cleanUsername}.png`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
            showToast("Story ID saved successfully!");
            return;
          }
        } catch {
          // fallback to client-side capture below
        }
      }

      if (!cardRef.current) return;
      const card = cardRef.current;
      const shadow = card.querySelector(".shadow, .card-shadow") as HTMLElement | null;
      const prevTransform = card.style.transform;
      const wasFlipped = isFlipped;

      if (wasFlipped) {
        setIsFlipped(false);
        await new Promise((r) => setTimeout(r, 150));
      }

      card.style.transform = "none";
      if (shadow) shadow.style.display = "none";

      const dataUrl = await htmlToImage.toPng(card, {
        quality: 1,
        pixelRatio: 3,
      });

      card.style.transform = prevTransform;
      if (shadow) shadow.style.display = "";
      if (wasFlipped) setIsFlipped(true);

      const link = document.createElement("a");
      link.download = `pincheck-id-${cleanUsername}.png`;
      link.href = dataUrl;
      link.click();
      showToast("ID Card saved successfully!");
    } catch (err) {
      console.error("Failed to save image", err);
      showToast("Failed to save ID card");
    } finally {
      setIsSaving(false);
    }
  };

  // Native Web Share
  const handleShare = async () => {
    setIsSharing(true);
    const shareUrl = profileId
      ? `${window.location.origin}/c/${profileId}`
      : `${window.location.origin}/?u=${cleanUsername}`;

    try {
      // 1. Try native mobile share sheet (iOS/Android over HTTPS or localhost)
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        try {
          await navigator.share({
            title: `${primaryName} — PinCheck`,
            text: `Check out my official Pinterest ID: ${primaryName}!`,
            url: shareUrl,
          });
          showToast("Shared successfully!");
          return;
        } catch (err: any) {
          // If the user cancelled the share dialog, do not show error
          if (err?.name === "AbortError") {
            return;
          }
          console.warn("navigator.share failed, copying link instead", err);
        }
      }

      // 2. Resilient clipboard copy (works on mobile LAN http://192.168.x.x and desktop)
      const copied = await copyToClipboard(shareUrl);
      if (copied) {
        showToast("Link copied to clipboard!");
      } else {
        showToast("Link: " + shareUrl);
      }
    } catch (err) {
      console.error("Failed to share", err);
      showToast("Link copied to clipboard!");
    } finally {
      setIsSharing(false);
    }
  };

  const isCardReady = !isLoading && !isFail;
  const cardClassName = [
    "card-wrap",
    isLoading ? "loading" : "",
    isCardReady ? "ready" : "",
    isFail ? "fail" : "",
  ].filter(Boolean).join(" ");

  const defaultStepTexts = [
    { msg: "CONNECTING TO PINTEREST...", sub: "Knocking on your boards." },
    { msg: "COUNTING YOUR BOARDS...", sub: "Even the ones you forgot about." },
    { msg: "READING YOUR PINS...", sub: "Judging your 3am saves." },
    { msg: "FINDING YOUR VIBE...", sub: "Naming the aesthetic. No pressure." },
    { msg: "WRITING YOUR ROAST...", sub: "It will be affectionate. Mostly." },
  ];
  const stepIdx = Math.min(Math.max(0, stage), defaultStepTexts.length - 1);
  const activeMsg = statusMessage || defaultStepTexts[stepIdx].msg;
  const activeSub = statusSub || defaultStepTexts[stepIdx].sub;

  const categoryTag = data?.categoryTag || data?.themes?.[0]?.name || "";
  const pinCount = data?.user?.totalPins;
  const boardCount = data?.user?.totalBoards;
  const headCategories = data?.headCategories || (data?.identity?.secondary && data.identity.secondary.length > 0 ? data.identity.secondary.join(" / ") : "");
  const fixation = data?.fixation || data?.identity?.recentKeywords?.[0] || "";
  const alsoSaves = data?.alsoSaves || data?.themes?.[1]?.name || "";

  return (
    <div className={`flex flex-col items-center justify-center w-full select-none ${isArchive ? "p-0" : "py-4 sm:py-6"}`}>
      {/* 3D Perspective Stage */}
      <div
        className={`card-stage stage ${isFail ? "shake" : ""}`}
        ref={stageRef}
        id="stage"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <div className={cardClassName} ref={cardRef} id="card">
          {/* Dynamic 3D Red Shadow */}
          <div className="card-shadow shadow" />

          {/* FRONT SIDE */}
          <div className="front" inert={isFlipped ? true : undefined}>
            <div className="card-face face" />

            {/* Clip */}
            <div className="layer l-clip card-l-clip">
              <div className="clip-top" />
              <div className="clip-stem" />
            </div>

            {/* Tags */}
            <div className="layer l-tags card-l-tags">
              <span className="tag a card-tag a">PINTEREST</span>
              <span className="tag b card-tag b">IDENTITY</span>
            </div>

            {/* Year */}
            <div className="layer l-date card-l-date">{cardYear}</div>

            {/* Image Panel */}
            <div className="layer l-image card-l-image">
              <div className="img-frame" ref={imgFrameRef}>
                <div
                  className={`paint ${stage >= 2 ? "on" : ""}`}
                  id="paint"
                  style={{ "--g": "linear-gradient(110deg, #e2278d 0%, #cf2aa8 38%, #d42a62 72%, #dc2d34 100%)" } as React.CSSProperties}
                />
                <div className="grid img-frame-grid" />
                <div className={`letter ${stage >= 1 ? "on" : ""}`} id="sigw">
                  <span className="handle" ref={handleRef} id="handle">
                    {cleanUsername}
                  </span>
                  <svg viewBox="0 0 200 20" preserveAspectRatio="none">
                    <path
                      d="M4 15 C 45 3, 120 2, 196 9"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M40 18 C 80 11, 130 10, 176 14"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      opacity="0.8"
                    />
                  </svg>
                </div>
                <div className="stamp card-stamp">
                  <span>
                    <small>PIN</small>CHECK
                  </span>
                </div>
                <div className="holo card-holo" />
                <div className="glare card-glare" />
              </div>

              {/* Category Tab */}
              {(categoryTag || stage < 1) && (
                <div className={`tab card-tab ${stage >= 1 ? "on" : ""}`} id="tab" data-s="1">
                  {stage >= 1 ? categoryTag.toUpperCase() : "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"}
                </div>
              )}
            </div>

            {/* Title / Aesthetic Name */}
            <div
              className={`layer l-name card-l-name ${stage >= 3 ? "on" : ""}`}
              id="name"
              data-s="3"
              data-text={stage >= 3 ? primaryName : ""}
              style={{ fontSize: nameFontSize }}
            >
              {stage >= 3 ? primaryName : "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"}
            </div>

            {/* Dark Brutalist Panel */}
            <div className="layer l-panel card-l-panel">
              <div className="panel card-panel">
                {(headCategories || stage < 2) && (
                  <div className={`panel-head card-panel-head ${stage >= 2 ? "on" : ""}`} id="head" data-s="2">
                    {stage >= 2 ? headCategories.toUpperCase() : "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"}
                  </div>
                )}

                <p
                  className={`quote card-quote ${stage >= 4 ? "on" : ""} ${isTyping ? "caret" : ""}`}
                  id="quote"
                  data-s="4"
                >
                  {stage >= 4 ? typedQuote : "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"}
                </p>

                <div className="meta card-meta">
                  {(fixation || stage < 2) && (
                    <div data-s="2" className={stage >= 2 ? "on" : ""}>
                      <b>CURRENT FIXATION:</b>{" "}
                      <span>{stage >= 2 ? fixation.toUpperCase() : "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"}</span>
                    </div>
                  )}
                  {(alsoSaves || stage < 2) && (
                    <div data-s="2" className={stage >= 2 ? "on" : ""}>
                      <b>ALSO SAVES:</b>{" "}
                      <span>{stage >= 2 ? alsoSaves.toUpperCase() : "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"}</span>
                    </div>
                  )}
                  <span className={`count ${stage >= 1 ? "on" : ""}`} id="count" data-s="1">
                    {stage >= 1 && pinCount != null && boardCount != null
                      ? `${pinCount} PINS • ${boardCount} BOARDS`
                      : "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"}
                  </span>
                </div>

                {/* Procedural Barcode */}
                <div className={`barcode card-barcode ${stage >= 3 ? "on" : ""}`} data-s="3">
                  <svg id="bars" viewBox="0 0 100 40" preserveAspectRatio="none">
                    {barcodeBars.map((b) => (
                      <rect key={b.x} x={b.x} y="0" width={b.w} height="40" fill="#000" />
                    ))}
                  </svg>
                  <span id="bcname">{cleanUsername.toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* Footer Brand */}
            <div className="layer l-foot card-l-foot">PINCHECK.IN</div>

            {/* Surface Sheen & Sweep */}
            <div className="layer l-sheen card-l-sheen" />
            <div className="l-shine" />
          </div>

          {/* BACK SIDE (SHOP YOUR VIBE) */}
          <div className="back" id="back" inert={!isFlipped ? true : undefined}>
            <div className="card-face face" />

            <div className="layer l-clip card-l-clip">
              <div className="clip-top" />
              <div className="clip-stem" />
            </div>

            <span className="tag back-tag card-tag">SHOP YOUR VIBE</span>

            {primaryName && (
              <div className="back-tab" id="backtab">
                PICKED FOR {primaryName}
              </div>
            )}

            <div className="layer l-date card-l-date">{productCountFormatted}</div>

            <div className="shop" id="shop">
              {products.map((p, idx) => (
                <a
                  key={idx}
                  className="prod"
                  href={p.url}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                >
                  <div className="thumb" style={{ background: p.bg || "linear-gradient(135deg, #e2278d, #7a2cff)" }}>
                    {p.emoji || "✨"}
                  </div>
                  <div className="ptxt">
                    <b>{p.title}</b>
                    <span>{p.note}</span>
                  </div>
                  <div className="go">SHOP</div>
                </a>
              ))}
            </div>

            <div className="back-foot">
              <p>Affiliate links. We may earn a commission if you buy, at no extra cost to you.</p>
              <button
                className="flip-back"
                id="flipBack"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFlip();
                }}
              >
                FLIP BACK
              </button>
            </div>

            <div className="layer l-foot card-l-foot">PINCHECK.IN</div>
          </div>
        </div>
      </div>

      {/* STATUS AREA / RESULT BUTTONS (BELOW THE CARD) */}
      {!isArchive && (
        <div className={`below ${isCardReady ? "ready" : ""}`}>
          {/* While scanning or in error */}
          <div
            className={`status ${isFail ? "err" : ""}`}
            id="status"
            role="status"
            aria-live="polite"
            style={{ opacity: isCardReady ? 0 : 1, pointerEvents: isCardReady ? "none" : "auto" }}
          >
            <span className="msg" id="msg">
              {isFail ? "COULD NOT READ THAT ACCOUNT" : activeMsg}
            </span>
            <p className="sub" id="sub">
              {activeSub}
            </p>
            {!isFail && (
              <div className="pips" aria-hidden="true">
                <i className={stage >= 1 ? "on" : ""} />
                <i className={stage >= 2 ? "on" : ""} />
                <i className={stage >= 3 ? "on" : ""} />
                <i className={stage >= 4 ? "on" : ""} />
              </div>
            )}
            {isFail && onRetry && (
              <button
                className="btn save mt-2"
                id="retry"
                type="button"
                onClick={onRetry}
              >
                Try again
              </button>
            )}
          </div>

          {/* When finished */}
          <div
            className="result"
            id="result"
            style={{ opacity: isCardReady ? 1 : 0, pointerEvents: isCardReady ? "auto" : "none" }}
          >
            <button
              className="hint"
              id="hint"
              type="button"
              onClick={toggleFlip}
            >
              {isFlipped ? "Tap the card to go back" : "Tap the card to shop your vibe"}
            </button>

            <div className="actions">
              <button
                className="btn save"
                id="save"
                onClick={handleDownload}
                disabled={isSaving}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="M12 3v12m0 0l-4.5-4.5M12 15l4.5-4.5M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
                </svg>
                {isSaving ? "Saving..." : "Save ID"}
              </button>
              <button
                className="btn share"
                id="share"
                onClick={handleShare}
                disabled={isSharing}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
                </svg>
                Share
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification (Top dynamic pill banner) */}
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[9999] bg-white text-black font-['Inter'] font-black text-xs tracking-wider uppercase px-5 py-2.5 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.8)] pointer-events-none whitespace-nowrap border-2 border-black flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#E60023]" />
          {toastMessage}
        </div>
      )}
    </div>
  );
}
