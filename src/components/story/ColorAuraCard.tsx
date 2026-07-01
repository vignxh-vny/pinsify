"use client";

import { motion } from "framer-motion";
import { StoryCardProps } from "@/types/story";

export default function ColorAuraCard({ data, isActive }: StoryCardProps) {
  const { colorAura } = data;

  return (
    <div className="story-card items-center justify-center text-center">
      {/* Animated color orb */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <motion.div
          className="relative w-[280px] h-[280px]"
          initial={{ scale: 0, opacity: 0 }}
          animate={
            isActive
              ? { scale: 1, opacity: 1 }
              : {}
          }
          transition={{ delay: 0.4, duration: 0.4, type: "tween", ease: "easeOut" }}
        >
          {/* Orbiting color rings */}
          {colorAura.colors.map((color, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${280 - i * 40}px`,
                height: `${280 - i * 40}px`,
                top: `${i * 20}px`,
                left: `${i * 20}px`,
                background: `radial-gradient(circle, ${color}88, transparent 70%)`,
                filter: "blur(8px)",
              }}
              animate={
                isActive
                  ? {
                      rotate: [0, i % 2 === 0 ? 360 : -360],
                      scale: [1, 1.05 + i * 0.02, 1],
                    }
                  : {}
              }
              transition={{
                rotate: {
                  duration: 20 + i * 5,
                  repeat: Infinity,
                  ease: "linear",
                },
                scale: {
                  duration: 3 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            />
          ))}

          {/* Center glow */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full"
            style={{
              background: `radial-gradient(circle, ${colorAura.colors[2]}, transparent)`,
              boxShadow: `0 0 60px ${colorAura.colors[2]}80`,
            }}
            animate={
              isActive
                ? { scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }
                : {}
            }
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>

      <div className="relative z-10 flex flex-col items-center mt-auto pb-16">
        <motion.p
          initial={{ opacity: 0, y: 0 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.2 }}
          className="text-sm uppercase tracking-[0.25em] text-[var(--text-secondary)] mb-4"
        >
          Your Color Aura
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 0 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.3 }}
          className="text-3xl sm:text-4xl font-bold mb-4 font-heading"
          style={{
            background: `linear-gradient(135deg, ${colorAura.colors[2]}, ${colorAura.colors[3]})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {colorAura.name}
        </motion.h2>

        {/* Color palette swatches */}
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2, duration: 0.2 }}
          className="flex gap-2 mb-6"
        >
          {colorAura.colors.map((color, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={isActive ? { scale: 1 } : {}}
              transition={{ delay: 1.4 + i * 0.1, type: "tween", ease: "easeOut" }}
              className="w-8 h-8 rounded-lg border border-white/10"
              style={{ background: color }}
              title={color}
            />
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 0 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.8, duration: 0.2 }}
          className="text-sm text-[var(--text-secondary)] max-w-xs leading-relaxed"
        >
          {colorAura.description}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 2.2, duration: 0.2 }}
          className="mt-3 text-xs text-[var(--text-tertiary)] italic"
        >
          {colorAura.mood}
        </motion.p>
      </div>
    </div>
  );
}
