"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
       <motion.div
       className="fixed inset-0 z-50 flex items-center justify-center p-4"
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       exit={{ opacity: 0 }}
     >
       {/* Modal */}
       <motion.div
         className="relative z-50 bg-card bg-white border border-border rounded-2xl shadow-2xl shadow-black shadow-md w-full max-w-md mx-auto overflow-hidden"
         initial={{ scale: 0.9, opacity: 0, y: 20 }}
         animate={{ scale: 1, opacity: 1, y: 0 }}
         exit={{ scale: 0.9, opacity: 0, y: 20 }}
         transition={{ type: "spring", stiffness: 300, damping: 30 }}
         onClick={(e) => e.stopPropagation()}
       >
         {/* Header */}
         <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border px-6 py-4">
           <div className="flex justify-between items-center">
             <h2 className="text-xl font-bold text-foreground">{title}</h2>
             <button
               onClick={onClose}
               className="p-2 hover:bg-border rounded-full transition-colors group"
             >
               <X size={20} className="text-foreground/60 group-hover:text-foreground" />
             </button>
           </div>
         </div>
         
         {/* Content */}
         <div className="p-6">
           {children}
         </div>
       </motion.div>
     </motion.div>
      )}
    </AnimatePresence>
  );
} 