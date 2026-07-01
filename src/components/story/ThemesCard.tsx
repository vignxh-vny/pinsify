"use client";

import { motion } from "framer-motion";
import { StoryCardProps } from "@/types/story";

export default function ThemesCard({ data, isActive }: StoryCardProps) {
  return (
    <div className="story-card items-center justify-center text-center px-6">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(20,184,166,0.12), transparent 70%)",
          }}
          animate={isActive ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-sm">
        <motion.p
          initial={{ opacity: 0, y: 0 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.2 }}
          className="text-sm uppercase tracking-[0.25em] text-[var(--text-secondary)] mb-8"
        >
          Visual DNA
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 0 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="text-2xl sm:text-3xl font-bold mb-8 font-heading"
        >
          Your Top Themes
        </motion.h2>

        {/* Theme bars */}
        <div className="w-full space-y-4">
          {data.themes.map((theme, i) => (
            <motion.div
              key={theme.name}
              initial={{ opacity: 0, x: -10 }}
              animate={isActive ? { opacity: 1, x: 0 } : {}}
              transition={{
                delay: 0.6 + i * 0.15,
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="w-full"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-2 text-sm">
                  <span className="text-lg">{theme.emoji}</span>
                  <span className="text-[var(--text-primary)]">{theme.name}</span>
                </span>
                <span className="text-xs text-[var(--text-secondary)] tabular-nums font-mono">
                  {theme.percentage}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, var(--accent-violet), var(--accent-rose))`,
                  }}
                  initial={{ width: 0 }}
                  animate={isActive ? { width: `${theme.percentage}%` } : {}}
                  transition={{
                    delay: 0.8 + i * 0.15,
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
