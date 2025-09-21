export interface Weaver {
  id: string;
  name: string;
  skills: string[];
  region: string;
}

export type ProjectStage = 'Preparation' | 'Preweaving' | 'Weaving' | 'Finishings' | 'Completed';

export interface Project {
  id: string;
  type: string;
  name: string;
  remarks: string;
  deadline: Date;
  currentStage: ProjectStage;
  rawMaterials: RawMaterial[];
  outputItem?: Item;
  startDate: Date;
  lastWorkedOn?: Date;
  totalTimeLogged: number; // in seconds
  isActive: boolean;
  timerStartTime?: Date;
}

export interface RawMaterial {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface Item {
  id: string;
  photo?: string;
  name: string;
  material: string;
  color: string;
  quantity: number;
  totalCost: number;
}

export interface TimerState {
  isRunning: boolean;
  startTime?: Date;
  elapsedTime: number; // in seconds
}

// Consumer Portal Types
export interface ConsumerProduct {
  id: string;
  name: string;
  artisanName: string;
  artisanId: string;
  price: number;
  images: string[];
  description: string;
  category: string;
  materials: string[];
  techniques: string[];
  colors: string[];
  location: string;
  rating: number;
  reviewCount: number;
  availability: 'in-stock' | 'limited' | 'out-of-stock';
  productionTime: number; // in days
  isCustomizable: boolean;
}

export interface CartItem {
  productId: string;
  product: ConsumerProduct;
  quantity: number;
  selectedOptions?: Record<string, string>;
}

export interface ConsumerRequest {
  id: string;
  userId: string;
  type: 'image' | 'voice' | 'text';
  content: string;
  images?: string[];
  voiceNotes?: string[];
  extractedAttributes: {
    color: string[];
    style: string[];
    fabric: string[];
    purpose: string[];
    emotion: string[];
    size: string[];
  };
  mockups?: string[];
  status: 'processing' | 'matched' | 'in-production' | 'completed';
  assignedArtisanId?: string;
  estimatedPrice?: { min: number; max: number };
  estimatedTimeline?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PersonalizedContent {
  id: string;
  type: 'deal' | 'recommendation' | 'story' | 'reel';
  title: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  priority: 'high' | 'medium' | 'low';
  expiresAt?: Date;
  isRead: boolean;
  createdAt: Date;
}

export interface ConsumerProfile {
  id: string;
  name: string;
  email: string;
  preferences: {
    categories: string[];
    priceRange: { min: number; max: number };
    artisans: string[];
    colors: string[];
    styles: string[];
  };
  purchaseHistory: string[];
  requestHistory: string[];
  wishlist: string[];
  cart: CartItem[];
} 