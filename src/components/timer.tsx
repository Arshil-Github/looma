"use client";

import { motion } from "framer-motion";
import { Play, Pause, Square } from "lucide-react";

interface TimerProps {
  elapsedTime: number;
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export function Timer({ elapsedTime, isRunning, onStart, onPause, onResume, onStop }: TimerProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-3">
      <div className="bg-background border border-border rounded-lg px-3 py-2 flex-1">
        <span className="font-mono text-sm font-bold text-foreground">
          {formatTime(elapsedTime)}
        </span>
      </div>
      
      <div className="flex gap-1">
        {!isRunning ? (
          elapsedTime === 0 ? (
            <motion.button
              onClick={onStart}
              className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play size={14} />
            </motion.button>
          ) : (
            <motion.button
              onClick={onResume}
              className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play size={14} />
            </motion.button>
          )
        ) : (
          <motion.button
            onClick={onPause}
            className="p-2 bg-secondary text-primary-foreground rounded-lg hover:bg-secondary/90"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Pause size={14} />
          </motion.button>
        )}
        
        {elapsedTime > 0 && (
          <motion.button
            onClick={onStop}
            className="p-2 bg-accent text-primary-foreground rounded-lg hover:bg-accent/90"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Square size={14} />
          </motion.button>
        )}
      </div>
    </div>
  );
} 