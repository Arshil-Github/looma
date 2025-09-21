"use client";

import { motion } from "framer-motion";
import { X, Star, MapPin, Clock, ShoppingCart, Heart, Share2 } from "lucide-react";
import { ConsumerProduct } from "@/types";
import { Button } from "./button";
import { Card } from "./card";

interface ProductDetailModalProps {
  product: ConsumerProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: ConsumerProduct) => void;
}

export function ProductDetailModal({ product, isOpen, onClose, onAddToCart }: ProductDetailModalProps) {
  if (!product || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-background rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row h-full">
            {/* Product Images */}
            <div className="lg:w-1/2 p-6">
              <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg mb-4 flex items-center justify-center">
                <ShoppingCart className="text-primary/60" size={64} />
              </div>
              <div className="flex gap-2">
                {product.images.map((image, index) => (
                  <div key={index} className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="text-primary/60" size={20} />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="lg:w-1/2 p-6 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{product.name}</h2>
                  <p className="text-foreground/60">by {product.artisanName}</p>
                </div>
                <button
                  onClick={onClose}
                  className="text-foreground/60 hover:text-foreground transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-foreground/60">({product.reviewCount} reviews)</span>
              </div>

              {/* Price */}
              <div className="text-3xl font-bold text-primary mb-4">
                ₹{product.price.toLocaleString()}
              </div>

              {/* Description */}
              <p className="text-foreground/80 mb-6">{product.description}</p>

              {/* Product Details */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="text-accent" size={16} />
                  <span className="text-sm text-foreground/60">Made in {product.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="text-accent" size={16} />
                  <span className="text-sm text-foreground/60">Production time: {product.productionTime} days</span>
                </div>
              </div>

              {/* Materials and Techniques */}
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Materials</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.materials.map((material, index) => (
                      <span key={index} className="px-3 py-1 bg-accent/20 text-accent text-sm rounded-full">
                        {material}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Techniques</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.techniques.map((technique, index) => (
                      <span key={index} className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full">
                        {technique}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Colors</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color, index) => (
                      <span key={index} className="px-3 py-1 bg-secondary/20 text-secondary text-sm rounded-full">
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div className="mb-6">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.availability === 'in-stock' ? 'bg-green-100 text-green-800' :
                  product.availability === 'limited' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {product.availability === 'in-stock' ? 'In Stock' :
                   product.availability === 'limited' ? 'Limited Stock' : 'Out of Stock'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-auto">
                <Button
                  onClick={() => onAddToCart(product)}
                  className="flex-1"
                  Icon={ShoppingCart}
                  disabled={product.availability === 'out-of-stock'}
                >
                  Add to Cart
                </Button>
                <Button variant="outline" Icon={Heart}>
                  Wishlist
                </Button>
                <Button variant="outline" Icon={Share2}>
                  Share
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

