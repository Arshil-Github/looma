"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = "", onClick }: CardProps) {
  return (
    <motion.div
      className={`bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-lg ${className}`}
      onClick={onClick}
      whileHover={{
        y: -5,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        transition: {
          type: "spring",
          stiffness: 300,
        },
      }}
    >
      {children}
    </motion.div>
  );
} 