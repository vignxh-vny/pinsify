"use client";

import { motion } from "framer-motion";
import { StoryCardProps } from "@/types/story";

export default function ShareCard({ data, isActive }: StoryCardProps) {
  const { identity, colorAura } = data;

  return (
    <div className="story-card items-center justify-center text-center px-6">
      {/* Celebratory background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Multi-color glow */}
        {colorAura.colors.slice(0, 3).map((color, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: "200px",
              height: "200px",
              background: `radial-gradient(circle, ${color}44, transparent 70%)`,
              top: `${20 + i * 25}%`,
              left: `${10 + i * 30}%`,
              filter: "blur(40px)",
            }}
            animate={
              isActive
                ? {
                    x: [0, 20 * (i % 2 === 0 ? 1 : -1), 0],
                    y: [0, -15, 0],
                    scale: [1, 1.1, 1],
                  }
                : {}
            }
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Identity card */}
        <motion.div
          initial={{ opacity: 0, y: 0, scale: 0.9 }}
          animate={isActive ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.3, type: "tween", ease: "easeOut" }}
          className="glass-strong rounded-3xl p-8 max-w-xs w-full mb-8"
        >
          {/* Brand */}
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-tertiary)] mb-6">
            PinsByMe
          </p>

          {/* Identity */}
          <div className="text-4xl mb-3">{identity.emoji}</div>
          <h2 className="text-2xl font-bold text-gradient mb-2 font-heading">
            {identity.primary}
          </h2>
          <p className="text-sm text-[var(--text-accent)] italic mb-4">
            &ldquo;{identity.tagline}&rdquo;
          </p>

          {/* Color palette */}
          <div className="flex justify-center gap-1.5 mb-4">
            {colorAura.colors.map((color, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-md"
                style={{ background: color }}
              />
            ))}
          </div>

          {/* Aura name */}
          <p className="text-xs text-[var(--text-secondary)]">
            Color Aura: <span className="text-[var(--text-primary)]">{colorAura.name}</span>
          </p>

          {/* Secondary aesthetics */}
          <div className="flex flex-wrap justify-center gap-1.5 mt-4">
            {identity.secondary.map((sec) => (
              <span
                key={sec}
                className="px-2.5 py-1 rounded-full bg-white/5 text-[10px] text-[var(--text-secondary)]"
              >
                {sec}
              </span>
            ))}
          </div>

          {/* Watermark */}
          <div className="mt-6 pt-4 border-t border-white/5">
            <p className="text-[9px] text-[var(--text-tertiary)] uppercase tracking-[0.2em]">
              pinsbyme.com · discover your aesthetic
            </p>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 0.2 }}
          className="flex flex-col gap-3 w-full max-w-xs"
        >
          <button className="btn-primary w-full py-3.5">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            Share My Aesthetic
          </button>
          <button className="btn-ghost w-full">
            📸 Save as Image
          </button>
        </motion.div>

        {/* Bottom text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 1.5, duration: 0.2 }}
          className="mt-6 text-xs text-[var(--text-tertiary)]"
        >
          Your aesthetic identity is uniquely yours. ✨
        </motion.p>
      </div>
    </div>
  );
}
