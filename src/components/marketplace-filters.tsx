"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown } from "lucide-react";
import { Card } from "./card";
import { Button } from "./button";

interface FilterState {
  priceRange: { min: number; max: number };
  categories: string[];
  materials: string[];
  techniques: string[];
  colors: string[];
  locations: string[];
  availability: string[];
  rating: number;
}

interface MarketplaceFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableOptions: {
    categories: string[];
    materials: string[];
    techniques: string[];
    colors: string[];
    locations: string[];
  };
}

export function MarketplaceFilters({ 
  isOpen, 
  onClose, 
  filters, 
  onFiltersChange, 
  availableOptions 
}: MarketplaceFiltersProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: 'categories' | 'materials' | 'techniques' | 'colors' | 'locations' | 'availability', value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      priceRange: { min: 0, max: 100000 },
      categories: [],
      materials: [],
      techniques: [],
      colors: [],
      locations: [],
      availability: [],
      rating: 0
    });
  };

  const FilterSection = ({ title, children, sectionKey }: { title: string; children: React.ReactNode; sectionKey: string }) => (
    <div className="border-b border-border pb-4">
      <button
        onClick={() => setExpandedSection(expandedSection === sectionKey ? null : sectionKey)}
        className="flex items-center justify-between w-full text-left font-semibold text-foreground mb-3"
      >
        {title}
        <ChevronDown 
          className={`transition-transform ${expandedSection === sectionKey ? 'rotate-180' : ''}`} 
          size={16} 
        />
      </button>
      <AnimatePresence>
        {expandedSection === sectionKey && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const CheckboxList = ({ 
    items, 
    selectedItems, 
    onToggle 
  }: { 
    items: string[]; 
    selectedItems: string[]; 
    onToggle: (item: string) => void; 
  }) => (
    <div className="space-y-2">
      {items.map(item => (
        <label key={item} className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedItems.includes(item)}
            onChange={() => onToggle(item)}
            className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary/20"
          />
          <span className="text-sm text-foreground/80 capitalize">{item}</span>
        </label>
      ))}
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-80 bg-background border-l border-border">
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button
              onClick={onClose}
              className="text-foreground/60 hover:text-foreground transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Price Range */}
            <FilterSection title="Price Range" sectionKey="price">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceRange.min || ''}
                    onChange={(e) => updateFilter('priceRange', { 
                      ...filters.priceRange, 
                      min: parseInt(e.target.value) || 0 
                    })}
                    className="w-full px-3 py-2 border border-border rounded bg-background/50 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceRange.max || ''}
                    onChange={(e) => updateFilter('priceRange', { 
                      ...filters.priceRange, 
                      max: parseInt(e.target.value) || 100000 
                    })}
                    className="w-full px-3 py-2 border border-border rounded bg-background/50 text-sm"
                  />
                </div>
                <div className="text-xs text-foreground/60">
                  Range: ₹{filters.priceRange.min.toLocaleString()} - ₹{filters.priceRange.max.toLocaleString()}
                </div>
              </div>
            </FilterSection>

            {/* Categories */}
            <FilterSection title="Categories" sectionKey="categories">
              <CheckboxList
                items={availableOptions.categories}
                selectedItems={filters.categories}
                onToggle={(item) => toggleArrayFilter('categories', item)}
              />
            </FilterSection>

            {/* Materials */}
            <FilterSection title="Materials" sectionKey="materials">
              <CheckboxList
                items={availableOptions.materials}
                selectedItems={filters.materials}
                onToggle={(item) => toggleArrayFilter('materials', item)}
              />
            </FilterSection>

            {/* Techniques */}
            <FilterSection title="Techniques" sectionKey="techniques">
              <CheckboxList
                items={availableOptions.techniques}
                selectedItems={filters.techniques}
                onToggle={(item) => toggleArrayFilter('techniques', item)}
              />
            </FilterSection>

            {/* Colors */}
            <FilterSection title="Colors" sectionKey="colors">
              <CheckboxList
                items={availableOptions.colors}
                selectedItems={filters.colors}
                onToggle={(item) => toggleArrayFilter('colors', item)}
              />
            </FilterSection>

            {/* Locations */}
            <FilterSection title="Artisan Locations" sectionKey="locations">
              <CheckboxList
                items={availableOptions.locations}
                selectedItems={filters.locations}
                onToggle={(item) => toggleArrayFilter('locations', item)}
              />
            </FilterSection>

            {/* Availability */}
            <FilterSection title="Availability" sectionKey="availability">
              <CheckboxList
                items={['in-stock', 'limited', 'out-of-stock']}
                selectedItems={filters.availability}
                onToggle={(item) => toggleArrayFilter('availability', item)}
              />
            </FilterSection>

            {/* Rating */}
            <FilterSection title="Minimum Rating" sectionKey="rating">
              <div className="space-y-2">
                {[4, 3, 2, 1].map(rating => (
                  <label key={rating} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.rating === rating}
                      onChange={() => updateFilter('rating', rating)}
                      className="w-4 h-4 text-primary bg-background border-border focus:ring-primary/20"
                    />
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-foreground/60">& up</span>
                  </label>
                ))}
              </div>
            </FilterSection>
          </div>

          <div className="mt-8 space-y-3">
            <Button onClick={clearAllFilters} className="w-full" variant="outline">
              Clear All Filters
            </Button>
            <Button onClick={onClose} className="w-full">
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

