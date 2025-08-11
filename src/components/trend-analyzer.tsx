"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "./card";
import { Modal } from "./modal";
import React from "react";
import { ImageOff } from "lucide-react";

// --- Type Definitions (Updated) ---
interface MatchResult {
  rank: number;
  trend_id: string;
  trend_name: string;
  category: string;
  // Add the new fields here to match your API response
  value: number; // The price/value of the trend
  popularity: number;
  match_score: number;
  // Let's assume 'colors' is an array of strings (hex codes)
  colors?: string[]; // Make it optional in case some trends don't have colors
}

interface ModalContentProps {
  isLoading: boolean;
  error: string | null;
  matches: MatchResult[];
}
interface ScrapedProduct {
  name: string;
  image_url: string | null; // Allow for null image URLs
  price: string;
  product_url: string | null; // Allow for null product URLs
}
const ProductImage: React.FC<{ src: string | null; alt: string }> = ({
  src,
  alt,
}) => {
  const [hasError, setHasError] = useState(false);

  // If there's an error or no src, render a placeholder
  if (hasError || !src) {
    return (
      <div className="w-full h-32 bg-gray-200 rounded-md mb-2 flex items-center justify-center">
        <ImageOff className="h-8 w-8 text-gray-400" />
      </div>
    );
  }

  // Otherwise, render the image with an error handler
  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-32 object-cover rounded-md mb-2"
      onError={() => setHasError(true)}
    />
  );
};

/**
 * A dedicated, typed component to render the content inside the modal.
 */
const ModalContent: React.FC<ModalContentProps> = ({
  isLoading,
  error,
  matches,
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-4 text-foreground/70">
          Matching trends against weaver skills...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <h4 className="text-lg font-bold text-red-600">An Error Occurred</h4>
        <p className="mt-2 text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>
      </div>
    );
  }

  if (matches.length > 0) {
    return (
      <div>
        <h4 className="font-semibold text-foreground mb-4">
          Top Matches Found:
        </h4>
        <ul className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {matches.map((match) => (
            <li
              key={match.trend_id}
              className="border-b border-border pb-3 last:border-b-0"
            >
              {/* Trend Name and Category */}
              <div>
                <p className="font-bold text-lg text-foreground">
                  {match.trend_name}
                </p>
                <p className="text-sm text-foreground/70">{match.category}</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                <div>
                  <p className="text-xs font-semibold text-foreground/60">
                    VALUE
                  </p>
                  <p className="font-bold text-primary">
                    ${match.value.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground/60">
                    POPULARITY
                  </p>
                  <p className="font-bold text-primary">{match.popularity}%</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground/60">
                    MATCH
                  </p>
                  <p className="font-bold text-primary">
                    {(match.match_score * 100).toFixed(0)}%
                  </p>
                </div>
              </div>

              {/* Colors Display */}
              {match.colors && match.colors.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-foreground/60 mb-1">
                    COLORS
                  </p>
                  <div className="flex items-center gap-2">
                    {match.colors.slice(0, 5).map((color, index) => (
                      <div
                        key={index}
                        className="h-6 w-6 rounded-full border border-border"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return null;
};
const ScrapeResults: React.FC<{ products: ScrapedProduct[] }> = ({
  products,
}) => {
  if (products.length === 0) return null;
  return (
    <div className="mt-6">
      <h4 className="font-bold text-foreground mb-3">
        Newly Scraped Products:
      </h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
        {products.map((product, index) => (
          // Make the entire card a clickable link if a URL exists
          <a
            key={index}
            href={product.product_url || "#"} // Fallback to '#' if no URL
            target="_blank"
            rel="noopener noreferrer"
            className={`block border border-border rounded-lg p-2 text-center transition-all duration-200 ease-in-out hover:shadow-lg hover:border-primary/50 ${
              !product.product_url ? "pointer-events-none opacity-80" : ""
            }`}
          >
            <ProductImage src={product.image_url} alt={product.name} />
            <p className="text-sm font-semibold truncate" title={product.name}>
              {product.name}
            </p>
            <p className="text-xs text-foreground/70">{product.price}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

export function TrendAnalyzer(): React.ReactElement {
  // --- State Management (Unchanged) ---
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [isMatching, setIsMatching] = useState<boolean>(false);
  const [matchError, setMatchError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // --- NEW State for Scraping ---
  const [scrapedProducts, setScrapedProducts] = useState<ScrapedProduct[]>([]);
  const [isScraping, setIsScraping] = useState<boolean>(false);
  const [scrapeError, setScrapeError] = useState<string | null>(null);

  // --- Functions (Unchanged) ---
  const handleRunMatchingAlgorithm = async (): Promise<void> => {
    setIsMatching(true);
    setMatchError(null);
    setMatches([]);
    setIsModalOpen(true);

    const weaverId = "W003";
    const apiUrl = `http://127.0.0.1:8000/match/${weaverId}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to fetch trend data.");
      }
      const data: MatchResult[] = await response.json();
      setMatches(data);
    } catch (err) {
      if (err instanceof Error) {
        setMatchError(err.message);
      } else {
        setMatchError("An unknown error occurred.");
      }
      console.error("Matching algorithm error:", err);
    } finally {
      setIsMatching(false);
    }
  };
  const handleWebscrape = async (): Promise<void> => {
    setIsScraping(true);
    setScrapeError(null);
    setScrapedProducts([]);

    const apiUrl = `http://127.0.0.1:8000/scrape?products_per_site=10`;

    try {
      const response = await fetch(apiUrl, { method: "POST" });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || "Failed to start scraping pipeline."
        );
      }
      const data = await response.json();
      setScrapedProducts(data.new_products || []);
    } catch (err) {
      if (err instanceof Error) setScrapeError(err.message);
      else setScrapeError("An unknown scraping error occurred.");
    } finally {
      setIsScraping(false);
    }
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
  };

  // --- JSX Return (Unchanged) ---
  return (
    <>
      <Card className="bg-pink-50/50 border-pink-200">
        <div className="border-b border-foreground/20 pb-3 mb-4">
          <h3 className="text-lg font-bold text-foreground">Data Management</h3>
        </div>

        <div className="flex flex-wrap gap-4">
          <motion.button
            onClick={handleWebscrape}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg transition-colors disabled:bg-gray-400"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isScraping || isMatching}
          >
            {isScraping ? "Scraping..." : "Scrape New Products"}
          </motion.button>

          <motion.button
            onClick={handleRunMatchingAlgorithm}
            className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg transition-colors disabled:bg-gray-400"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isScraping || isMatching}
          >
            {isMatching ? "Matching..." : "Run Matching Algorithm"}
          </motion.button>
        </div>

        {isScraping && (
          <p className="mt-4 text-blue-600">
            Pipeline running... This may take a minute.
          </p>
        )}
        {scrapeError && (
          <p className="mt-4 text-red-600 font-medium">
            Scrape Error: {scrapeError}
          </p>
        )}
        <ScrapeResults products={scrapedProducts} />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Trend Matching Results"
      >
        <ModalContent
          isLoading={isMatching}
          error={matchError}
          matches={matches}
        />
      </Modal>
    </>
  );
}
