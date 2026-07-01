"use client";

import { motion } from "framer-motion";
import { StoryCardProps } from "@/types/story";

export default function HiddenAestheticCard({ data, isActive }: StoryCardProps) {
  return (
    <div className="story-card items-center justify-center text-center px-6">
      {/* Mysterious background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[350px] h-[350px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(245,158,11,0.15), rgba(139,92,246,0.08), transparent 70%)",
          }}
          animate={isActive ? { scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] } : {}}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-sm">
        {/* Surprise intro */}
        <motion.p
          initial={{ opacity: 0, y: 0 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.2 }}
          className="text-sm uppercase tracking-[0.25em] text-[var(--text-secondary)] mb-3"
        >
          Hidden Discovery
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 0 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="text-xl sm:text-2xl font-semibold mb-2 text-[var(--text-accent)]"
        >
          You might not know this, but...
        </motion.h2>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={isActive ? { scaleX: 1 } : {}}
          transition={{ delay: 1, duration: 0.5 }}
          className="w-12 h-px bg-gradient-to-r from-transparent via-[var(--accent-amber)] to-transparent mb-8"
        />

        {/* Hidden aesthetics */}
        <div className="w-full space-y-4">
          {data.hiddenAesthetics.map((hidden, i) => (
            <motion.div
              key={hidden.name}
              initial={{ opacity: 0, y: 0, rotateX: 90 }}
              animate={
                isActive
                  ? { opacity: 1, y: 0, rotateX: 0 }
                  : {}
              }
              transition={{
                delay: 1.2 + i * 0.5,
                duration: 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="glass-card rounded-2xl p-5 text-left"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{hidden.emoji}</span>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">
                    {hidden.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-[var(--accent-amber)]"
                        initial={{ width: 0 }}
                        animate={
                          isActive ? { width: `${hidden.confidence}%` } : {}
                        }
                        transition={{
                          delay: 1.6 + i * 0.5,
                          duration: 0.3,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      />
                    </div>
                    <span className="text-xs text-[var(--text-tertiary)] font-mono tabular-nums">
                      {hidden.confidence}% match
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {hidden.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
