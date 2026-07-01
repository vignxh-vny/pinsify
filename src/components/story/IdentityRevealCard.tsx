"use client";

import { motion } from "framer-motion";
import { StoryCardProps } from "@/types/story";

export default function IdentityRevealCard({ data, isActive }: StoryCardProps) {
  return (
    <div className="story-card items-center justify-center text-center">
      {/* Big dramatic background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(139,92,246,0.25), rgba(236,72,153,0.15), transparent 70%)",
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={
            isActive
              ? {
                  scale: [0, 1.5, 1.2],
                  opacity: [0, 0.8, 0.5],
                }
              : {}
          }
          transition={{ delay: 0.5, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Particle burst */}
        {isActive &&
          Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
              style={{
                background: i % 2 === 0 ? "var(--accent-violet)" : "var(--accent-rose)",
              }}
              initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
              animate={{
                x: Math.cos((i * 30 * Math.PI) / 180) * 150,
                y: Math.sin((i * 30 * Math.PI) / 180) * 150,
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                delay: 1.2 + i * 0.05,
                duration: 0.4,
                ease: "easeOut",
              }}
            />
          ))}
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Pre-reveal */}
        <motion.p
          initial={{ opacity: 0, y: 0 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.2 }}
          className="text-sm uppercase tracking-[0.25em] text-[var(--text-secondary)] mb-3"
        >
          Your Aesthetic Identity
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="text-4xl mb-6"
        >
          {data.identity.emoji}
        </motion.p>

        {/* THE BIG REVEAL */}
        <motion.h2
          initial={{ opacity: 0, scale: 0.95, y: 0 }}
          animate={isActive ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{
            delay: 1,
            duration: 0.4,
            type: "tween", ease: "easeOut",
          }}
          className="text-4xl sm:text-5xl font-bold text-gradient glow-text mb-4 font-heading leading-tight"
        >
          {data.identity.primary}
        </motion.h2>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 0 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.8, duration: 0.2 }}
          className="text-[var(--text-accent)] italic text-base mb-8"
        >
          &ldquo;{data.identity.tagline}&rdquo;
        </motion.p>

        {/* Secondary aesthetics */}
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 2.2, duration: 0.2 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {data.identity.secondary.map((sec, i) => (
            <motion.span
              key={sec}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isActive ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 2.4 + i * 0.15 }}
              className="px-3 py-1.5 rounded-full glass text-xs text-[var(--text-secondary)]"
            >
              {sec}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
