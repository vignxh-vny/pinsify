"use client";

import { motion } from "framer-motion";
import { StoryCardProps } from "@/types/story";

export default function WelcomeCard({ data, isActive }: StoryCardProps) {
  return (
    <div className="story-card items-center justify-center text-center">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(139,92,246,0.3), transparent 70%)",
          }}
          animate={
            isActive
              ? {
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }
              : {}
          }
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Avatar placeholder */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={isActive ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
          className="w-24 h-24 rounded-full glass-strong flex items-center justify-center mb-8 glow-border"
        >
          <span className="text-4xl">✨</span>
        </motion.div>

        {/* Greeting */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-sm uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-4"
        >
          Welcome back
        </motion.p>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl sm:text-4xl font-bold mb-6 glow-text"
        >
          {data.user.displayName}
        </motion.h1>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isActive ? { scaleX: 1 } : {}}
          transition={{ delay: 1, duration: 0.6 }}
          className="w-16 h-px bg-gradient-to-r from-transparent via-[var(--accent-violet)] to-transparent mb-6"
        />

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-[var(--text-secondary)] text-lg leading-relaxed max-w-xs"
        >
          Let&apos;s explore your
          <br />
          <span className="text-gradient font-semibold">aesthetic universe</span>
        </motion.p>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 2 }}
          className="mt-12"
        >
          <motion.p
            className="text-xs text-[var(--text-tertiary)]"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Tap to continue →
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
