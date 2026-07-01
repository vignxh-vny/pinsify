"use client";

import { motion } from "framer-motion";
import { StoryCardProps } from "@/types/story";
import { useEffect, useState } from "react";

function TypewriterText({
  text,
  delay,
  isActive,
}: {
  text: string;
  delay: number;
  isActive: boolean;
}) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!isActive) {
      setDisplayed("");
      return;
    }
    let i = 0;
    const timeout = setTimeout(() => {
      // Calculate typing speed based on length to ensure it finishes in ~7 seconds max
      const typingSpeed = Math.min(35, 7000 / text.length);
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
        }
      }, typingSpeed);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [text, delay, isActive]);

  return (
    <span>
      {displayed}
      {displayed.length < text.length && displayed.length > 0 && (
        <span className="inline-block w-0.5 h-5 bg-[var(--accent-violet)] ml-0.5 align-middle animate-[typewriter-cursor_0.8s_infinite]" />
      )}
    </span>
  );
}

export default function FeelsLikeCard({ data, isActive }: StoryCardProps) {
  return (
    <div className="story-card items-center justify-center text-center px-8">
      {/* Warm background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 right-0 bottom-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, rgba(196,125,59,0.12), transparent 70%)",
          }}
          animate={isActive ? { opacity: [0.5, 0.8, 0.5] } : {}}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-sm">
        <motion.p
          initial={{ opacity: 0, y: 0 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.2 }}
          className="text-sm uppercase tracking-[0.25em] text-[var(--text-secondary)] mb-8"
        >
          Emotional Reading
        </motion.p>

        {/* "Your Pinterest feels like..." */}
        <motion.p
          initial={{ opacity: 0, y: 0 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="text-lg text-[var(--text-accent)] italic mb-6 font-semibold"
        >
          &ldquo;Your Pinterest feels like...&rdquo;
        </motion.p>

        {/* Typewriter narrative */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="glass-card rounded-2xl p-6"
        >
          <p className="text-[15px] leading-[1.8] text-[var(--text-primary)]">
            <TypewriterText
              text={data.feelsLike}
              delay={1.2}
              isActive={isActive}
            />
          </p>
        </motion.div>
      </div>
    </div>
  );
}
