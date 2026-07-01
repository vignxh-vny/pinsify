"use client";

import { motion } from "framer-motion";
import { StoryCardProps } from "@/types/story";
import { useEffect, useState } from "react";

function AnimatedNumber({
  target,
  delay,
  isActive,
}: {
  target: number;
  delay: number;
  isActive: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    const timeout = setTimeout(() => {
      const duration = 2000;
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCount(target);
          clearInterval(interval);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [target, delay, isActive]);

  return (
    <span className="tabular-nums">
      {count.toLocaleString()}
    </span>
  );
}

export default function StatsCard({ data, isActive }: StoryCardProps) {
  return (
    <div className="story-card items-center justify-center text-center">
      {/* Subtle gradient */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(244,63,94,0.15), transparent 70%)",
          }}
          animate={isActive ? { scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <motion.p
          initial={{ opacity: 0, y: 0 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.2 }}
          className="text-sm uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-10"
        >
          Your Pinterest Universe
        </motion.p>

        {/* Pins counter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isActive ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.4, type: "tween", ease: "easeOut" }}
          className="mb-8"
        >
          <div className="text-6xl sm:text-7xl font-bold text-gradient mb-2 font-heading">
            <AnimatedNumber target={data.user.totalPins} delay={0.6} isActive={isActive} />
          </div>
          <p className="text-[var(--text-secondary)] text-sm uppercase tracking-widest">
            Pins Saved
          </p>
        </motion.div>

        {/* Divider dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="flex gap-2 mb-8"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[var(--accent-violet)]"
              initial={{ scale: 0 }}
              animate={isActive ? { scale: 1 } : {}}
              transition={{ delay: 1 + i * 0.15, type: "tween", ease: "easeOut" }}
            />
          ))}
        </motion.div>

        {/* Boards counter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isActive ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 1.2, type: "tween", ease: "easeOut" }}
          className="mb-10"
        >
          <div className="text-5xl sm:text-6xl font-bold text-gradient-subtle mb-2 font-heading">
            <AnimatedNumber target={data.user.totalBoards} delay={1.4} isActive={isActive} />
          </div>
          <p className="text-[var(--text-secondary)] text-sm uppercase tracking-widest">
            Curated Boards
          </p>
        </motion.div>

        {/* Bottom text */}
        <motion.p
          initial={{ opacity: 0, y: 0 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 2.2, duration: 0.2 }}
          className="text-sm text-[var(--text-tertiary)] max-w-xs leading-relaxed"
        >
          Each one a window into your visual mind. Let&apos;s see what they reveal.
        </motion.p>
      </div>
    </div>
  );
}
