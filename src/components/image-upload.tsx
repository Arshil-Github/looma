"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, X, Eye, Trash2, Plus } from "lucide-react";
import { Button } from "./button";

interface ImageUploadProps {
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
  maxSize?: number; // in MB
}

export function ImageUpload({ onImagesChange, maxImages = 5, maxSize = 10 }: ImageUploadProps) {
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const newImages: File[] = [];
    const newPreviewUrls: string[] = [];

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        if (file.size > maxSize * 1024 * 1024) {
          alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`);
          return;
        }
        
        if (images.length + newImages.length >= maxImages) {
          alert(`Maximum ${maxImages} images allowed.`);
          return;
        }

        newImages.push(file);
        newPreviewUrls.push(URL.createObjectURL(file));
      } else {
        alert(`File ${file.name} is not an image.`);
      }
    });

    if (newImages.length > 0) {
      const updatedImages = [...images, ...newImages];
      const updatedPreviewUrls = [...previewUrls, ...newPreviewUrls];
      
      setImages(updatedImages);
      setPreviewUrls(updatedPreviewUrls);
      onImagesChange(updatedImages);
    }
  }, [images, previewUrls, maxImages, maxSize, onImagesChange]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  }, [handleFiles]);

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviewUrls = previewUrls.filter((_, i) => i !== index);
    
    // Revoke the URL to free up memory
    URL.revokeObjectURL(previewUrls[index]);
    
    setImages(updatedImages);
    setPreviewUrls(updatedPreviewUrls);
    onImagesChange(updatedImages);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-primary bg-primary/10'
            : 'border-border hover:border-primary/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
            <Upload className="text-primary" size={32} />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Upload Images
            </h3>
            <p className="text-foreground/60 mb-4">
              Drag and drop images here, or click to browse
            </p>
            <p className="text-sm text-foreground/50">
              Maximum {maxImages} images, {maxSize}MB each
            </p>
          </div>
          
          <Button onClick={openFileDialog} Icon={Plus}>
            Choose Images
          </Button>
        </div>
      </div>

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">
            Uploaded Images ({images.length}/{maxImages})
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative group"
              >
                <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg overflow-hidden">
                  <img
                    src={previewUrls[index]}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                  <Button
                    onClick={() => window.open(previewUrls[index], '_blank')}
                    size="sm"
                    variant="outline"
                    Icon={Eye}
                    className="bg-white/20 hover:bg-white/30"
                  >
                    View
                  </Button>
                  <Button
                    onClick={() => removeImage(index)}
                    size="sm"
                    variant="outline"
                    Icon={Trash2}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-200"
                  >
                    Delete
                  </Button>
                </div>
                
                {/* Image Info */}
                <div className="mt-2 text-xs text-foreground/60">
                  <div className="font-medium truncate">{image.name}</div>
                  <div>{(image.size / 1024 / 1024).toFixed(1)} MB</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Add More Button */}
      {images.length > 0 && images.length < maxImages && (
        <div className="text-center">
          <Button
            onClick={openFileDialog}
            variant="outline"
            Icon={Plus}
          >
            Add More Images
          </Button>
        </div>
      )}
    </div>
  );
}

