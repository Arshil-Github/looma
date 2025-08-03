"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface WovenProgressBarProps {
  progress: number;
}

export function WovenProgressBar({ progress }: WovenProgressBarProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    setAnimatedProgress(progress);
  }, [progress]);

  return (
    <div className="w-full rounded-full bg-black/5 border border-border overflow-hidden">
      <motion.div
        className="h-3 bg-gradient-to-r from-accent to-secondary"
        initial={{ width: 0 }}
        animate={{ width: `${animatedProgress}%` }}
        transition={{
          duration: 1.5,
          ease: [0.22, 1, 0.36, 1],
        }}
      />
    </div>
  );
} 