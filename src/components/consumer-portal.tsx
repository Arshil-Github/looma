"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, MessageSquare, Heart, Search, Filter, ShoppingCart, User } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Card } from "./card";
import { Button } from "./button";
import { ConsumerProduct } from "@/types";
import { ProductDetailModal } from "./product-detail-modal";
import { MarketplaceFilters } from "./marketplace-filters";
import { VoiceRecorder } from "./voice-recorder";
import { ImageUpload } from "./image-upload";
import { AIAttributeExtractor } from "./ai-attribute-extractor";

// Tab 1: Marketplace Component
function MarketplaceTab() {
  const { state, addToCart } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<ConsumerProduct | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 100000 },
    categories: [] as string[],
    materials: [] as string[],
    techniques: [] as string[],
    colors: [] as string[],
    locations: [] as string[],
    availability: [] as string[],
    rating: 0
  });

  const filteredProducts = state.consumerProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.artisanName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = product.price >= filters.priceRange.min && product.price <= filters.priceRange.max;
    const matchesCategory = filters.categories.length === 0 || filters.categories.includes(product.category);
    const matchesMaterials = filters.materials.length === 0 || filters.materials.some(material => 
      product.materials.includes(material)
    );
    const matchesTechniques = filters.techniques.length === 0 || filters.techniques.some(technique => 
      product.techniques.includes(technique)
    );
    const matchesColors = filters.colors.length === 0 || filters.colors.some(color => 
      product.colors.includes(color)
    );
    const matchesLocations = filters.locations.length === 0 || filters.locations.includes(product.location);
    const matchesAvailability = filters.availability.length === 0 || filters.availability.includes(product.availability);
    const matchesRating = product.rating >= filters.rating;
    
    return matchesSearch && matchesPrice && matchesCategory && matchesMaterials && 
           matchesTechniques && matchesColors && matchesLocations && matchesAvailability && matchesRating;
  });

  const availableOptions = {
    categories: [...new Set(state.consumerProducts.map(p => p.category))],
    materials: [...new Set(state.consumerProducts.flatMap(p => p.materials))],
    techniques: [...new Set(state.consumerProducts.flatMap(p => p.techniques))],
    colors: [...new Set(state.consumerProducts.flatMap(p => p.colors))],
    locations: [...new Set(state.consumerProducts.map(p => p.location))]
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/60" size={20} />
            <input
              type="text"
              placeholder="Search products, artisans..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              Icon={Filter} 
              className="px-4"
              onClick={() => setFiltersOpen(true)}
            >
              Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAddToCart={addToCart}
            onViewDetails={() => setSelectedProduct(product)}
          />
        ))}
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
      />

      {/* Filters Modal */}
      <MarketplaceFilters
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        availableOptions={availableOptions}
      />
    </div>
  );
}

// Product Card Component
function ProductCard({ 
  product, 
  onAddToCart, 
  onViewDetails 
}: { 
  product: ConsumerProduct; 
  onAddToCart: (product: ConsumerProduct) => void;
  onViewDetails: () => void;
}) {
  return (
    <Card className="group cursor-pointer overflow-hidden" onClick={onViewDetails}>
      <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg mb-4 flex items-center justify-center">
        <ShoppingBag className="text-primary/60" size={48} />
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-foreground/60">by {product.artisanName}</p>
        <div className="flex items-center gap-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}>
                ★
              </span>
            ))}
          </div>
          <span className="text-sm text-foreground/60">({product.reviewCount})</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">₹{product.price.toLocaleString()}</span>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="px-4 py-2 text-sm"
            Icon={ShoppingCart}
          >
            Add to Cart
          </Button>
        </div>
        <div className="flex flex-wrap gap-1">
          {product.materials.slice(0, 2).map((material, index) => (
            <span key={index} className="px-2 py-1 bg-accent/20 text-accent text-xs rounded-full">
              {material}
            </span>
          ))}
        </div>
        <div className="text-xs text-foreground/60">
          {product.location} • {product.productionTime} days
        </div>
      </div>
    </Card>
  );
}

// Tab 2: Request Portal Component
function RequestPortalTab() {
  const { state, addConsumerRequest } = useApp();
  const [activeInputType, setActiveInputType] = useState<'image' | 'voice' | 'text'>('text');
  const [requestContent, setRequestContent] = useState("");
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [voiceNotes, setVoiceNotes] = useState<Blob[]>([]);
  const [extractedAttributes, setExtractedAttributes] = useState({
    color: [] as string[],
    style: [] as string[],
    fabric: [] as string[],
    purpose: [] as string[],
    emotion: [] as string[],
    size: [] as string[]
  });

  return (
    <div className="space-y-6">
      {/* Input Type Selector */}
      <Card className="p-4">
        <div className="flex gap-2">
          {[
            { type: 'text', label: 'Text Description', icon: MessageSquare },
            { type: 'image', label: 'Upload Images', icon: User },
            { type: 'voice', label: 'Voice Note', icon: Heart }
          ].map(({ type, label, icon: Icon }) => (
            <Button
              key={type}
              onClick={() => setActiveInputType(type as any)}
              className={`px-4 py-2 ${activeInputType === type ? 'bg-primary' : 'bg-background/50'}`}
              Icon={Icon}
            >
              {label}
            </Button>
          ))}
        </div>
      </Card>

      {/* Request Input Area */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Describe Your Custom Request</h3>
        
        {activeInputType === 'text' && (
          <div className="space-y-4">
            <textarea
              value={requestContent}
              onChange={(e) => setRequestContent(e.target.value)}
              placeholder="Describe what you're looking for... (e.g., 'I want a handwoven silk saree in deep red with gold zari work for a wedding')"
              className="w-full h-32 p-4 border border-border rounded-lg bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
            <div className="text-sm text-foreground/60">
              {requestContent.length}/500 characters
            </div>
          </div>
        )}

        {activeInputType === 'image' && (
          <ImageUpload
            onImagesChange={setUploadedImages}
            maxImages={5}
            maxSize={10}
          />
        )}

        {activeInputType === 'voice' && (
          <VoiceRecorder
            onRecordingComplete={(audioBlob) => {
              setVoiceNotes(prev => [...prev, audioBlob]);
            }}
          />
        )}

        {/* AI Extracted Attributes */}
        <AIAttributeExtractor
          textContent={requestContent}
          images={uploadedImages}
          voiceNotes={voiceNotes}
          onAttributesChange={setExtractedAttributes}
        />

        <div className="mt-6 flex gap-4">
          <Button className="flex-1">Generate Mockup</Button>
          <Button 
            className="flex-1" 
            variant="outline"
            onClick={() => {
              if (requestContent || uploadedImages.length > 0 || voiceNotes.length > 0) {
                addConsumerRequest({
                  userId: 'current-user',
                  type: activeInputType,
                  content: requestContent,
                  images: uploadedImages.map(img => img.name),
                  voiceNotes: voiceNotes.map((_, i) => `voice-note-${i}.wav`),
                  extractedAttributes,
                  status: 'processing',
                  assignedArtisanId: undefined,
                  estimatedPrice: { min: 1000, max: 50000 },
                  estimatedTimeline: 7
                });
                
                // Reset form
                setRequestContent('');
                setUploadedImages([]);
                setVoiceNotes([]);
                setExtractedAttributes({
                  color: [],
                  style: [],
                  fabric: [],
                  purpose: [],
                  emotion: [],
                  size: []
                });
              }
            }}
          >
            Submit Request
          </Button>
        </div>
      </Card>

      {/* Request History */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Your Requests</h3>
        {state.consumerRequests.length === 0 ? (
          <p className="text-foreground/60 text-center py-8">No requests yet. Create your first custom request above!</p>
        ) : (
          <div className="space-y-4">
            {state.consumerRequests.map(request => (
              <div key={request.id} className="p-4 border border-border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{request.content}</h4>
                    <p className="text-sm text-foreground/60">
                      {request.status} • {request.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    request.status === 'completed' ? 'bg-green-100 text-green-800' :
                    request.status === 'in-production' ? 'bg-blue-100 text-blue-800' :
                    request.status === 'matched' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {request.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

// Tab 3: Marketing Portal Component
function MarketingPortalTab() {
  const { state, addToCart, dispatch } = useApp();
  const [selectedContent, setSelectedContent] = useState<string | null>(null);

  const markAsRead = (contentId: string) => {
    dispatch({
      type: 'UPDATE_PERSONALIZED_CONTENT',
      payload: {
        ...state.personalizedContent.find(c => c.id === contentId)!,
        isRead: true
      }
    });
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'deal': return '🎯';
      case 'recommendation': return '💡';
      case 'story': return '📖';
      case 'reel': return '🎬';
      default: return '💌';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Personalized Content Feed */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Messages for You</h3>
          <div className="text-sm text-foreground/60">
            {state.personalizedContent.filter(c => !c.isRead).length} unread
          </div>
        </div>
        
        <div className="space-y-4">
          {state.personalizedContent.map(content => (
            <motion.div
              key={content.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                content.isRead 
                  ? 'bg-background/50 border border-border' 
                  : 'bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20'
              }`}
              onClick={() => {
                setSelectedContent(selectedContent === content.id ? null : content.id);
                if (!content.isRead) markAsRead(content.id);
              }}
            >
              <div className="flex items-start gap-4">
                <div className="text-2xl">{getContentIcon(content.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{content.title}</h4>
                    {!content.isRead && (
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    )}
                  </div>
                  <p className="text-sm text-foreground/60 mb-2">{content.content}</p>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(content.priority)}`}>
                      {content.priority} priority
                    </span>
                    {content.expiresAt && (
                      <span className="text-xs text-foreground/60">
                        Expires {content.expiresAt.toLocaleDateString()}
                      </span>
                    )}
                    <span className="text-xs text-foreground/40">
                      {content.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Expanded Content */}
              {selectedContent === content.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t border-border"
                >
                  {content.type === 'deal' && (
                    <div className="space-y-3">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <p className="text-sm font-medium">Use code: SAVE20</p>
                        <p className="text-xs text-foreground/60">Valid until {content.expiresAt?.toLocaleDateString()}</p>
                      </div>
                      <Button className="w-full">Shop Now</Button>
                    </div>
                  )}
                  
                  {content.type === 'recommendation' && (
                    <div className="space-y-3">
                      <div className="p-3 bg-accent/10 rounded-lg">
                        <p className="text-sm">This recommendation is based on your purchase history and browsing patterns.</p>
                      </div>
                      <Button className="w-full">View Recommendation</Button>
                    </div>
                  )}
                  
                  {content.type === 'story' && (
                    <div className="space-y-3">
                      <div className="p-3 bg-accent/10 rounded-lg">
                        <p className="text-sm">
                          "I started learning weaving from my grandmother when I was just 8 years old. 
                          The art of Banarasi weaving has been in our family for five generations. 
                          Each saree I create takes 7-10 days of meticulous work, with every thread 
                          carefully placed by hand..."
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">Read Full Story</Button>
                        <Button size="sm" variant="outline">Follow Artisan</Button>
                      </div>
                    </div>
                  )}
                  
                  {content.type === 'reel' && (
                    <div className="space-y-3">
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-primary/30 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Heart className="text-primary" size={24} />
                          </div>
                          <p className="text-sm font-medium">Your Personalized Reel</p>
                          <p className="text-xs text-foreground/60">15 seconds</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">Play Reel</Button>
                        <Button size="sm" variant="outline">Share</Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Recommended Products */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recommended for You</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.consumerProducts.slice(0, 3).map(product => (
            <div key={product.id} className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
              <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg mb-3 flex items-center justify-center">
                <ShoppingBag className="text-primary/60" size={32} />
              </div>
              <h4 className="font-medium text-sm">{product.name}</h4>
              <p className="text-xs text-foreground/60">by {product.artisanName}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="font-bold text-primary">₹{product.price.toLocaleString()}</span>
                <Button 
                  size="sm" 
                  Icon={ShoppingCart}
                  onClick={() => addToCart(product)}
                >
                  Add
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Your Impact Dashboard */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Your Impact</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">₹{state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0).toLocaleString()}</div>
            <div className="text-sm text-green-600">Total Spent</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{state.cart.length}</div>
            <div className="text-sm text-blue-600">Artisans Supported</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">5</div>
            <div className="text-sm text-purple-600">Craft Techniques Preserved</div>
          </div>
        </div>
      </Card>

      {/* Artisan Stories */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Featured Artisan Stories</h3>
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <User className="text-primary" size={24} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Meet Priya Sharma from Varanasi</h4>
                <p className="text-sm text-foreground/60 mt-1">
                  "I've been weaving silk sarees for over 20 years, following techniques passed down through generations. 
                  Each piece tells a story of our rich cultural heritage..."
                </p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm">Read Full Story</Button>
                  <Button size="sm" variant="outline">View Her Work</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Main Consumer Portal Component
export function ConsumerPortal() {
  const { state, setConsumerView } = useApp();
  const [cartOpen, setCartOpen] = useState(false);

  const tabs = [
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
    { id: 'request-portal', label: 'Request Portal', icon: MessageSquare },
    { id: 'marketing', label: 'Messages for You', icon: Heart }
  ] as const;

  const totalCartItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-bold text-foreground">Looma Consumer Portal</h1>
              <nav className="hidden md:flex gap-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setConsumerView(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      state.currentConsumerView === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground/60 hover:text-foreground hover:bg-accent/10'
                    }`}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-foreground/60 hover:text-foreground transition-colors"
              >
                <ShoppingCart size={20} />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalCartItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="md:hidden border-b border-border">
        <div className="flex">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setConsumerView(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium ${
                state.currentConsumerView === tab.id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-foreground/60'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={state.currentConsumerView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {state.currentConsumerView === 'marketplace' && <MarketplaceTab />}
          {state.currentConsumerView === 'request-portal' && <RequestPortalTab />}
          {state.currentConsumerView === 'marketing' && <MarketingPortalTab />}
        </motion.div>
      </div>

      {/* Cart Sidebar */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setCartOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-96 bg-background border-l border-border">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Shopping Cart</h2>
                <button
                  onClick={() => setCartOpen(false)}
                  className="text-foreground/60 hover:text-foreground"
                >
                  ×
                </button>
              </div>
              {state.cart.length === 0 ? (
                <p className="text-foreground/60 text-center py-8">Your cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {state.cart.map(item => (
                    <div key={item.productId} className="flex gap-4 p-4 border border-border rounded-lg">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
                        <ShoppingBag className="text-primary/60" size={24} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.product.name}</h4>
                        <p className="text-xs text-foreground/60">by {item.product.artisanName}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-bold text-primary">₹{item.product.price.toLocaleString()}</span>
                          <div className="flex items-center gap-2">
                            <button className="w-6 h-6 bg-accent/20 rounded flex items-center justify-center">-</button>
                            <span className="text-sm">{item.quantity}</span>
                            <button className="w-6 h-6 bg-accent/20 rounded flex items-center justify-center">+</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-primary">
                        ₹{state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0).toLocaleString()}
                      </span>
                    </div>
                    <Button className="w-full">Proceed to Checkout</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
