// src/components/set-price-modal.tsx

"use client";

import { useState } from "react";
import { Button } from "./button";
import { motion } from "framer-motion";
import { DollarSign, Info, TrendingUp } from "lucide-react";

// Define the props the modal content will accept
interface SetPriceModalProps {
  currentPrice: number;
  onSave: (newPrice: number) => void;
  onCancel: () => void;
}

// Sample market data for demonstration
const marketInsights = {
  averageAsking: 175,
  highestOffer: 350,
  demand: "High",
};

export function SetPriceModal({
  currentPrice,
  onSave,
  onCancel,
}: SetPriceModalProps) {
  // Local state to manage the input field value
  const [price, setPrice] = useState<number | string>(currentPrice);

  const suggestedPrices = [100, 150, 200];

  const handleSaveClick = () => {
    // Ensure the price is a valid number before saving
    const newPrice = Number(price);
    if (!isNaN(newPrice) && newPrice > 0) {
      onSave(newPrice);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Price Input Section */}
      <div>
        <label
          htmlFor="min-price"
          className="block text-sm font-medium text-foreground/80 mb-1"
        >
          Your minimum price per session/project
        </label>
        <div className="relative">
          <DollarSign
            className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50"
            size={18}
          />
          <input
            type="number"
            id="min-price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g., 150"
            className="w-full p-2 pl-10 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
          />
        </div>
      </div>

      {/* Suggested Prices Section */}
      <div>
        <h4 className="text-sm font-semibold text-foreground/80 mb-2">
          Suggested Prices
        </h4>
        <div className="flex gap-2">
          {suggestedPrices.map((p) => (
            <motion.button
              key={p}
              onClick={() => setPrice(p)}
              className="px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium hover:bg-primary/10 hover:border-primary transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              ${p}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Market Insights Section */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-foreground/80 mb-3 flex items-center gap-2">
          <Info size={16} /> Market Insights
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-foreground/70">Average Asking Price:</span>
            <span className="font-bold text-foreground">
              ${marketInsights.averageAsking}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground/70">Highest Recent Offer:</span>
            <span className="font-bold text-foreground">
              ${marketInsights.highestOffer}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground/70">Current Demand:</span>
            <span className="font-bold text-green-600 flex items-center gap-1">
              <TrendingUp size={14} /> {marketInsights.demand}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSaveClick}>Set Price</Button>
      </div>
    </div>
  );
}
