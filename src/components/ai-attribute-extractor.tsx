"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Check, X, Edit3 } from "lucide-react";
import { Button } from "./button";
import { Card } from "./card";

interface ExtractedAttributes {
  color: string[];
  style: string[];
  fabric: string[];
  purpose: string[];
  emotion: string[];
  size: string[];
}

interface AIAttributeExtractorProps {
  textContent: string;
  images: File[];
  voiceNotes: Blob[];
  onAttributesChange: (attributes: ExtractedAttributes) => void;
}

const SUGGESTED_ATTRIBUTES = {
  color: ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Black', 'White', 'Gold', 'Silver', 'Brown', 'Gray'],
  style: ['Traditional', 'Modern', 'Vintage', 'Contemporary', 'Classic', 'Bohemian', 'Minimalist', 'Rustic', 'Elegant', 'Casual', 'Formal'],
  fabric: ['Silk', 'Cotton', 'Wool', 'Linen', 'Leather', 'Denim', 'Chiffon', 'Satin', 'Velvet', 'Jute', 'Hemp', 'Bamboo'],
  purpose: ['Wedding', 'Daily Wear', 'Festival', 'Office', 'Party', 'Casual', 'Formal', 'Home Decor', 'Gift', 'Collection'],
  emotion: ['Joyful', 'Elegant', 'Comfortable', 'Luxurious', 'Peaceful', 'Bold', 'Delicate', 'Warm', 'Cool', 'Romantic'],
  size: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Small', 'Medium', 'Large', 'Extra Large', 'One Size']
};

export function AIAttributeExtractor({ 
  textContent, 
  images, 
  voiceNotes, 
  onAttributesChange 
}: AIAttributeExtractorProps) {
  const [extractedAttributes, setExtractedAttributes] = useState<ExtractedAttributes>({
    color: [],
    style: [],
    fabric: [],
    purpose: [],
    emotion: [],
    size: []
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  // Simulate AI processing
  useEffect(() => {
    if (textContent || images.length > 0 || voiceNotes.length > 0) {
      setIsProcessing(true);
      
      // Simulate processing delay
      const timer = setTimeout(() => {
        const mockExtracted = extractAttributesFromContent(textContent, images, voiceNotes);
        setExtractedAttributes(mockExtracted);
        onAttributesChange(mockExtracted);
        setIsProcessing(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [textContent, images, voiceNotes, onAttributesChange]);

  const extractAttributesFromContent = (
    text: string, 
    imgs: File[], 
    voices: Blob[]
  ): ExtractedAttributes => {
    // Mock AI extraction based on content analysis
    const extracted: ExtractedAttributes = {
      color: [],
      style: [],
      fabric: [],
      purpose: [],
      emotion: [],
      size: []
    };

    // Extract from text content
    if (text) {
      const textLower = text.toLowerCase();
      
      // Color extraction
      SUGGESTED_ATTRIBUTES.color.forEach(color => {
        if (textLower.includes(color.toLowerCase())) {
          extracted.color.push(color);
        }
      });

      // Style extraction
      SUGGESTED_ATTRIBUTES.style.forEach(style => {
        if (textLower.includes(style.toLowerCase())) {
          extracted.style.push(style);
        }
      });

      // Fabric extraction
      SUGGESTED_ATTRIBUTES.fabric.forEach(fabric => {
        if (textLower.includes(fabric.toLowerCase())) {
          extracted.fabric.push(fabric);
        }
      });

      // Purpose extraction
      SUGGESTED_ATTRIBUTES.purpose.forEach(purpose => {
        if (textLower.includes(purpose.toLowerCase())) {
          extracted.purpose.push(purpose);
        }
      });

      // Emotion extraction
      SUGGESTED_ATTRIBUTES.emotion.forEach(emotion => {
        if (textLower.includes(emotion.toLowerCase())) {
          extracted.emotion.push(emotion);
        }
      });

      // Size extraction
      SUGGESTED_ATTRIBUTES.size.forEach(size => {
        if (textLower.includes(size.toLowerCase())) {
          extracted.size.push(size);
        }
      });
    }

    // If no attributes found, add some defaults based on common patterns
    if (extracted.color.length === 0) {
      extracted.color = ['Red', 'Blue']; // Default colors
    }
    if (extracted.style.length === 0) {
      extracted.style = ['Traditional']; // Default style
    }
    if (extracted.fabric.length === 0) {
      extracted.fabric = ['Cotton']; // Default fabric
    }

    return extracted;
  };

  const toggleAttribute = (category: keyof ExtractedAttributes, attribute: string) => {
    const currentAttributes = extractedAttributes[category];
    const newAttributes = currentAttributes.includes(attribute)
      ? currentAttributes.filter(attr => attr !== attribute)
      : [...currentAttributes, attribute];
    
    const updated = { ...extractedAttributes, [category]: newAttributes };
    setExtractedAttributes(updated);
    onAttributesChange(updated);
  };

  const addCustomAttribute = (category: keyof ExtractedAttributes, attribute: string) => {
    if (attribute.trim() && !extractedAttributes[category].includes(attribute.trim())) {
      const updated = {
        ...extractedAttributes,
        [category]: [...extractedAttributes[category], attribute.trim()]
      };
      setExtractedAttributes(updated);
      onAttributesChange(updated);
    }
  };

  const AttributeCategory = ({ 
    title, 
    category, 
    attributes, 
    suggestedAttributes 
  }: { 
    title: string; 
    category: keyof ExtractedAttributes; 
    attributes: string[]; 
    suggestedAttributes: string[]; 
  }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-foreground">{title}</h4>
        <Button
          onClick={() => setEditingCategory(editingCategory === category ? null : category)}
          size="sm"
          variant="outline"
          Icon={Edit3}
        >
          {editingCategory === category ? 'Done' : 'Edit'}
        </Button>
      </div>
      
      {/* Selected Attributes */}
      <div className="flex flex-wrap gap-2">
        {attributes.map(attribute => (
          <motion.span
            key={attribute}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full flex items-center gap-1"
          >
            {attribute}
            <button
              onClick={() => toggleAttribute(category, attribute)}
              className="ml-1 hover:bg-primary-foreground/20 rounded-full p-0.5"
            >
              <X size={12} />
            </button>
          </motion.span>
        ))}
      </div>

      {/* Suggested Attributes */}
      {editingCategory === category && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-2"
        >
          <p className="text-sm text-foreground/60">Suggested attributes:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedAttributes
              .filter(attr => !attributes.includes(attr))
              .map(attribute => (
                <button
                  key={attribute}
                  onClick={() => toggleAttribute(category, attribute)}
                  className="px-2 py-1 bg-accent/20 text-accent text-sm rounded-full hover:bg-accent/30 transition-colors"
                >
                  {attribute}
                </button>
              ))}
          </div>
          
          {/* Custom Attribute Input */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add custom attribute..."
              className="flex-1 px-3 py-2 border border-border rounded bg-background/50 text-sm"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addCustomAttribute(category, e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
            <Button
              size="sm"
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                addCustomAttribute(category, input.value);
                input.value = '';
              }}
            >
              Add
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-primary" size={20} />
        <h3 className="text-lg font-semibold">AI Extracted Attributes</h3>
        {isProcessing && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
          />
        )}
      </div>

      {isProcessing ? (
        <div className="text-center py-8">
          <div className="space-y-4">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto"
            >
              <Sparkles className="text-primary" size={32} />
            </motion.div>
            <div>
              <h4 className="font-semibold text-foreground">Analyzing your request...</h4>
              <p className="text-sm text-foreground/60">
                Our AI is extracting attributes from your text, images, and voice notes
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <AttributeCategory
            title="Colors"
            category="color"
            attributes={extractedAttributes.color}
            suggestedAttributes={SUGGESTED_ATTRIBUTES.color}
          />
          <AttributeCategory
            title="Styles"
            category="style"
            attributes={extractedAttributes.style}
            suggestedAttributes={SUGGESTED_ATTRIBUTES.style}
          />
          <AttributeCategory
            title="Fabrics"
            category="fabric"
            attributes={extractedAttributes.fabric}
            suggestedAttributes={SUGGESTED_ATTRIBUTES.fabric}
          />
          <AttributeCategory
            title="Purpose"
            category="purpose"
            attributes={extractedAttributes.purpose}
            suggestedAttributes={SUGGESTED_ATTRIBUTES.purpose}
          />
          <AttributeCategory
            title="Emotion"
            category="emotion"
            attributes={extractedAttributes.emotion}
            suggestedAttributes={SUGGESTED_ATTRIBUTES.emotion}
          />
          <AttributeCategory
            title="Size"
            category="size"
            attributes={extractedAttributes.size}
            suggestedAttributes={SUGGESTED_ATTRIBUTES.size}
          />
        </div>
      )}
    </Card>
  );
}

