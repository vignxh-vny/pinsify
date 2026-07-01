"use client";

import { motion } from "framer-motion";
import { StoryCardProps } from "@/types/story";

export default function VibeCard({ data, isActive }: StoryCardProps) {
  return (
    <div className="story-card items-center justify-center text-center px-6">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(99,102,241,0.12), transparent 70%)",
          }}
          animate={isActive ? { scale: [1, 1.15, 1], rotate: [0, 180, 360] } : {}}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-sm">
        <motion.p
          initial={{ opacity: 0, y: 0 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.2 }}
          className="text-sm uppercase tracking-[0.25em] text-[var(--text-secondary)] mb-4"
        >
          Personality Profile
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 0 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="text-2xl sm:text-3xl font-bold mb-8 text-gradient-subtle font-heading"
        >
          Your Vibe Check
        </motion.h2>

        {/* Vibe meters */}
        <div className="w-full space-y-5">
          {data.vibes.map((vibe, i) => (
            <motion.div
              key={vibe.trait}
              initial={{ opacity: 0, y: 0 }}
              animate={isActive ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.6 + i * 0.2,
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="glass-card rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  {vibe.trait}
                </span>
                <span className="text-xs text-[var(--text-tertiary)]">
                  {vibe.label}
                </span>
              </div>

              <div className="relative w-full h-3 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full rounded-full relative"
                  style={{
                    background: `linear-gradient(90deg, 
                      hsl(${260 - (i * 20)}, 80%, 65%), 
                      hsl(${260 - (i * 20) + 30}, 70%, 55%)
                    )`,
                  }}
                  initial={{ width: 0 }}
                  animate={isActive ? { width: `${vibe.value}%` } : {}}
                  transition={{
                    delay: 0.9 + i * 0.2,
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {/* Glow tip */}
                  <motion.div
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                    style={{
                      background: `hsl(${260 - (i * 20) + 30}, 70%, 55%)`,
                      boxShadow: `0 0 12px hsl(${260 - (i * 20) + 30}, 70%, 55%)`,
                    }}
                    initial={{ opacity: 0 }}
                    animate={isActive ? { opacity: 1 } : {}}
                    transition={{ delay: 1.5 + i * 0.2 }}
                  />
                </motion.div>
              </div>

              <div className="flex justify-end mt-1">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={isActive ? { opacity: 1 } : {}}
                  transition={{ delay: 1.5 + i * 0.2 }}
                  className="text-xs font-mono text-[var(--text-accent)] tabular-nums"
                >
                  {vibe.value}%
                </motion.span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
