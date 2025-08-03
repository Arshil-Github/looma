"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  Icon?: LucideIcon;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export function Button({ children, onClick, Icon, type = "button", className = "" }: ButtonProps) {
  return (
    <motion.button
      type={type}
      className={`bg-primary text-primary-foreground font-bold rounded-full py-3 px-6 shadow-lg flex items-center gap-2 ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
      whileTap={{ scale: 0.95 }}
    >
      {Icon && <Icon size={20} />}
      {children}
    </motion.button>
  );
} 