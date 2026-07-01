"use client";

import { motion } from "framer-motion";
import { StoryCardProps } from "@/types/story";

export default function DriftCard({ data, isActive }: StoryCardProps) {
  const { drift } = data;

  return (
    <div className="story-card items-center justify-center text-center px-6">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[500px]"
          style={{
            background:
              "radial-gradient(ellipse, rgba(167,139,250,0.1), transparent 70%)",
          }}
          animate={isActive ? { opacity: [0.3, 0.6, 0.3] } : {}}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-xs">
        <motion.p
          initial={{ opacity: 0, y: 0 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.2 }}
          className="text-sm uppercase tracking-[0.25em] text-[var(--text-secondary)] mb-4"
        >
          Evolution
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 0 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="text-2xl sm:text-3xl font-bold mb-10 font-heading"
        >
          <span className="text-gradient">Aesthetic Drift</span>
        </motion.h2>

        {/* Timeline */}
        <div className="relative w-full">
          {/* Vertical line */}
          <motion.div
            className="absolute left-6 top-0 bottom-0 w-px"
            style={{
              background:
                "linear-gradient(to bottom, transparent, var(--accent-violet), var(--accent-rose), transparent)",
              transformOrigin: "top",
            }}
            initial={{ scaleY: 0 }}
            animate={isActive ? { scaleY: 1 } : {}}
            transition={{ delay: 0.6, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />

          <div className="space-y-6">
            {drift.map((point, i) => (
              <motion.div
                key={point.period}
                initial={{ opacity: 0, x: 10 }}
                animate={isActive ? { opacity: 1, x: 0 } : {}}
                transition={{
                  delay: 0.8 + i * 0.3,
                  duration: 0.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex items-center gap-4"
              >
                {/* Dot */}
                <div className="relative flex-shrink-0">
                  <motion.div
                    className="w-3 h-3 rounded-full border-2 border-white/20 z-10 relative"
                    style={{ background: point.color }}
                    initial={{ scale: 0 }}
                    animate={isActive ? { scale: 1 } : {}}
                    transition={{
                      delay: 1 + i * 0.3,
                      type: "tween", ease: "easeOut",
                    }}
                  />
                  {/* Glow */}
                  {i === drift.length - 1 && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: point.color,
                        boxShadow: `0 0 20px ${point.color}`,
                      }}
                      animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 text-left glass-card rounded-xl p-3 flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex-shrink-0"
                    style={{ background: point.color }}
                  />
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)] mb-0.5">
                      {point.period}
                    </p>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">
                      {point.aesthetic}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 0 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 2.5, duration: 0.2 }}
          className="mt-8 text-xs text-[var(--text-tertiary)] leading-relaxed"
        >
          Your taste has evolved beautifully — from raw to refined, always authentic.
        </motion.p>
      </div>
    </div>
  );
}
