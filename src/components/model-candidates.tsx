// src/components/model-candidates.tsx

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "./card";
import { Users, CheckCircle } from "lucide-react";
import React from "react";

// 1. Define the data structure for a model
interface ModelCandidate {
  id: string;
  name: string;
  height: string;
  pay: number;
  place: string;
  age: number;
  bio: string;
  imageUrl: string;
}

// 2. Create sample data for the models
const candidates: ModelCandidate[] = [
  {
    id: "M01",
    name: "Ananya Rao",
    height: "5' 8\"",
    place: "Mumbai",
    pay: 200,
    age: 20,
    bio: "Ananya is a performing arts student with a passion for traditional textiles. Her expressive features and graceful posture make her ideal for showcasing elegant sarees and lehengas.",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRl0Lx0KYd1P2lqMrjBO3CoBTGYaRRqMkoQcw&s",
  },
  {
    id: "M02",
    name: "Vikram Singh",
    height: "6' 1\"",
    place: "Delhi",
    pay: 1000,
    age: 22,
    bio: "Vikram studies architecture and has a keen eye for minimalist and geometric designs. He has a strong, confident look, perfect for modern and fusion ethnic wear.",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtnQy1Zfq2aHyBvEIrfm3g7DNQSefO_LDGeg&s",
  },
  {
    id: "M03",
    name: "Jiya Patel",
    height: "5' 6\"",
    place: "Ahmedabad",
    pay: 1400,
    age: 19,
    bio: "Jiya is a fashion design student who embodies a vibrant, youthful energy. She excels at bringing a fresh and contemporary feel to block prints and casual wear.",
    imageUrl:
      "https://static.vecteezy.com/system/resources/previews/039/334/802/non_2x/ai-generated-indian-female-student-free-photo.jpg",
  },
];

export function ModelCandidates(): React.ReactElement {
  // 3. State to track the currently selected model
  const [selectedModel, setSelectedModel] = useState<ModelCandidate | null>(
    null
  );

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Users className="text-secondary" size={20} />
        <h3 className="text-lg font-bold text-secondary border-b-2 border-foreground pb-1">
          Potential Models
        </h3>
      </div>
      <Card className="bg-purple-50/50 border-purple-200">
        <div className="space-y-3">
          {/* 4. List of clickable candidates */}
          {candidates.map((candidate) => (
            <motion.div
              key={candidate.id}
              className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                selectedModel?.id === candidate.id
                  ? "bg-purple-200/60 ring-2 ring-purple-400"
                  : "bg-purple-100/50 hover:bg-purple-200/50"
              }`}
              onClick={() => setSelectedModel(candidate)}
              layoutId={`model-card-${candidate.id}`} // For smooth animation
            >
              <div>
                <span className="font-bold text-foreground">
                  {candidate.name}
                </span>
                <p className="text-xs text-foreground/70">
                  {candidate.place}, {candidate.age}
                </p>
              </div>
              <AnimatePresence>
                {selectedModel?.id === candidate.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <CheckCircle className="text-purple-600" size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* 5. Animated section to display details of the selected model */}
        <AnimatePresence>
          {selectedModel && (
            <motion.div
              className="mt-4 pt-4 border-t border-purple-200"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="flex items-start gap-4">
                <img
                  src={selectedModel.imageUrl}
                  alt={selectedModel.name}
                  className="h-24 w-24 rounded-lg object-cover border-2 border-white shadow-md"
                />
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-foreground">
                    {selectedModel.name}
                  </h4>
                  <p className="text-sm font-semibold text-foreground/80 mb-2">
                    Height: {selectedModel.height}
                  </p>
                  <p className="text-sm font-semibold text-foreground/80 mb-2">
                    Asking Price: ₹{selectedModel.pay}
                  </p>
                  <p className="text-sm text-foreground/70">
                    {selectedModel.bio}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}
