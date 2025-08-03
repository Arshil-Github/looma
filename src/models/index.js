import mongoose from "mongoose";

// Weaver Schema
const weaverSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    profileImage: { type: String },
    skills: [
      {
        name: { type: String, required: true }, // e.g., "Silk Weaving", "Cotton Handloom"
        level: {
          type: String,
          enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
          default: "Beginner",
        },
        yearsOfExperience: { type: Number, default: 0 },
        certifications: [String],
      },
    ],
    region: {
      state: { type: String, required: true },
      district: { type: String, required: true },
      village: { type: String },
      coordinates: {
        latitude: { type: Number },
        longitude: { type: Number },
      },
    },
    businessProfile: {
      businessName: { type: String },
      establishedYear: { type: Number },
      avgMonthlyProduction: { type: Number },
      specializations: [String],
    },
    preferences: {
      preferredMaterials: [String],
      workingHours: {
        start: { type: String }, // "09:00"
        end: { type: String }, // "17:00"
      },
      notifications: {
        marketTrends: { type: Boolean, default: true },
        lowStock: { type: Boolean, default: true },
        community: { type: Boolean, default: true },
      },
    },
    reputation: {
      rating: { type: Number, default: 0, min: 0, max: 5 },
      totalReviews: { type: Number, default: 0 },
      badges: [String], // ["Master Weaver", "Community Helper", "Trend Setter"]
    },
  },
  {
    timestamps: true,
  }
);

// Project Schema
const projectSchema = new mongoose.Schema(
  {
    weaverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Weaver",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "Saree",
        "Dupatta",
        "Shawl",
        "Fabric",
        "Cushion Cover",
        "Table Runner",
        "Other",
      ],
    },
    name: { type: String, required: true },
    description: { type: String },
    remarks: { type: String },
    deadline: { type: Date },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },

    // Project Status
    currentStage: {
      type: String,
      enum: [
        "Planning",
        "Material Prep",
        "Warping",
        "Weaving",
        "Finishing",
        "Quality Check",
        "Completed",
      ],
      default: "Planning",
    },
    status: {
      type: String,
      enum: ["Active", "Paused", "Completed", "Cancelled"],
      default: "Active",
    },

    // Materials
    inputRawMaterials: [
      {
        materialId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "RawMaterial",
          required: true,
        },
        quantityUsed: { type: Number, required: true },
        unit: { type: String, required: true }, // "kg", "meters", "pieces"
        costPerUnit: { type: Number, required: true },
        totalCost: { type: Number, required: true },
      },
    ],

    // Output
    outputItemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
    expectedOutputQuantity: { type: Number, default: 1 },

    // Project Stages Tracking
    projectStages: [
      {
        stageName: { type: String, required: true },
        status: {
          type: String,
          enum: ["Pending", "In Progress", "Completed"],
          default: "Pending",
        },
        startDate: { type: Date },
        endDate: { type: Date },
        estimatedHours: { type: Number },
        actualHours: { type: Number, default: 0 },
        notes: { type: String },
      },
    ],

    // Time Tracking
    timeTracking: {
      totalHoursWorked: { type: Number, default: 0 },
      sessions: [
        {
          startTime: { type: Date, required: true },
          endTime: { type: Date },
          duration: { type: Number }, // in minutes
          stage: { type: String },
          notes: { type: String },
          isActive: { type: Boolean, default: false },
        },
      ],
      currentSession: {
        isActive: { type: Boolean, default: false },
        startTime: { type: Date },
        currentStage: { type: String },
      },
    },

    // Dates
    startDate: { type: Date, default: Date.now },
    lastWorkedOn: { type: Date, default: Date.now },
    completionDate: { type: Date },

    // Financial
    estimatedCost: { type: Number },
    actualCost: { type: Number, default: 0 },
    sellingPrice: { type: Number },
    profit: { type: Number },
    profitMargin: { type: Number }, // percentage

    // AI Suggestions
    trendInsights: {
      suggestedBy: { type: String }, // AI suggestion source
      trendScore: { type: Number }, // 0-100
      marketDemand: { type: String, enum: ["Low", "Medium", "High"] },
      suggestedPriceRange: {
        min: { type: Number },
        max: { type: Number },
      },
    },
  },
  {
    timestamps: true,
  }
);

// Items Schema (Finished Products)
const itemSchema = new mongoose.Schema(
  {
    weaverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Weaver",
      required: true,
    },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },

    // Basic Info
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    subcategory: { type: String },

    // Visual
    photos: [
      {
        url: { type: String, required: true },
        caption: { type: String },
        isPrimary: { type: Boolean, default: false },
        uploadDate: { type: Date, default: Date.now },
      },
    ],

    // Physical Properties
    dimensions: {
      length: { type: Number }, // in cm
      width: { type: Number }, // in cm
      weight: { type: Number }, // in grams
    },

    // Materials
    materials: [
      {
        type: { type: String, required: true }, // "Cotton", "Silk", "Wool"
        percentage: { type: Number }, // percentage in the final product
        quality: { type: String },
        source: { type: String },
      },
    ],

    // Colors and Patterns
    colors: [
      {
        name: { type: String, required: true },
        hexCode: { type: String },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    patternType: { type: String }, // "Geometric", "Floral", "Abstract", "Traditional"
    patternDescription: { type: String },

    // Quantity and Pricing
    quantity: { type: Number, required: true, default: 1 },
    unit: { type: String, required: true, default: "piece" },
    totalCost: { type: Number, required: true },
    costPerUnit: { type: Number },

    // Selling Information
    sellingPrice: { type: Number },
    marketPrice: { type: Number },
    status: {
      type: String,
      enum: ["In Stock", "Sold", "Reserved", "Damaged"],
      default: "In Stock",
    },

    // Quality and Certification
    qualityGrade: { type: String, enum: ["A", "B", "C"], default: "A" },
    certifications: [String], // ["Handloom Mark", "Organic", "Fair Trade"]

    // AI Generated Content
    aiGeneratedDescription: { type: String },
    seoKeywords: [String],
    marketingTags: [String],

    // Market Data
    trendScore: { type: Number, min: 0, max: 100 },
    demandLevel: { type: String, enum: ["Low", "Medium", "High"] },
    seasonality: [String], // ["Summer", "Winter", "Festive"]
  },
  {
    timestamps: true,
  }
);

// Raw Material Schema
const rawMaterialSchema = new mongoose.Schema(
  {
    weaverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Weaver",
      required: true,
    },

    // Basic Info
    name: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["Yarn", "Thread", "Dye", "Accessories", "Tools", "Other"],
    },
    subtype: { type: String }, // "Cotton Yarn", "Silk Thread", "Natural Dye"
    brand: { type: String },

    // Physical Properties
    material: { type: String, required: true }, // "Cotton", "Silk", "Wool", "Synthetic"
    color: { type: String, required: true },
    colorCode: { type: String }, // Hex code or color reference
    thickness: { type: String }, // "Fine", "Medium", "Thick"
    quality: {
      type: String,
      enum: ["Premium", "Standard", "Economy"],
      default: "Standard",
    },

    // Inventory
    currentStock: { type: Number, required: true, default: 0 },
    unit: { type: String, required: true }, // "kg", "meters", "pieces", "liters"
    minimumStock: { type: Number, default: 0 },
    maximumStock: { type: Number },

    // Purchase History
    purchaseHistory: [
      {
        date: { type: Date, required: true },
        quantity: { type: Number, required: true },
        pricePerUnit: { type: Number, required: true },
        totalCost: { type: Number, required: true },
        supplier: { type: String },
        batchNumber: { type: String },
        expiryDate: { type: Date },
        notes: { type: String },
      },
    ],

    // Current Pricing
    lastPurchasePrice: { type: Number },
    averagePrice: { type: Number },

    // Storage
    location: { type: String }, // Where it's stored
    condition: {
      type: String,
      enum: ["Excellent", "Good", "Fair", "Poor"],
      default: "Good",
    },

    // Alerts
    lowStockAlert: { type: Boolean, default: true },
    expiryAlert: { type: Boolean, default: false },

    // Market Data
    marketPriceData: [
      {
        date: { type: Date, default: Date.now },
        averageMarketPrice: { type: Number },
        region: { type: String },
        source: { type: String },
      },
    ],

    // Usage Tracking
    totalUsed: { type: Number, default: 0 },
    totalPurchased: { type: Number, default: 0 },
    wastePercentage: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Scraped Data Schema (Market Intelligence)
const scrapedDataSchema = new mongoose.Schema(
  {
    // Source Information
    source: { type: String, required: true }, // "Amazon", "Flipkart", "Etsy"
    sourceUrl: { type: String, required: true },
    scrapedAt: { type: Date, default: Date.now },

    // Product Information
    productName: { type: String, required: true },
    productDescription: { type: String },
    price: {
      current: { type: Number, required: true },
      original: { type: Number },
      currency: { type: String, default: "INR" },
      discount: { type: Number },
    },

    // Images
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String },
        isPrimary: { type: Boolean, default: false },
      },
    ],

    // Category and Tags
    category: { type: String, required: true },
    subcategory: { type: String },
    tags: [String],
    keywords: [String],

    // Product Details
    specifications: [
      {
        key: { type: String },
        value: { type: String },
      },
    ],

    // Market Metrics
    rating: { type: Number },
    reviewCount: { type: Number },
    availability: {
      type: String,
      enum: ["In Stock", "Out of Stock", "Limited Stock"],
    },
    seller: { type: String },

    // Trend Analysis
    trendScore: { type: Number, min: 0, max: 100 },
    popularityRank: { type: Number },
    seasonalTrend: { type: String },

    // AI Analysis
    extractedFeatures: {
      materials: [String],
      colors: [String],
      patterns: [String],
      style: [String],
      targetAudience: [String],
    },

    // Vector Embeddings (for similarity search)
    embedding: {
      description: [Number], // Vector embedding of description
      visual: [Number], // Vector embedding of images
    },

    // Processing Status
    processed: { type: Boolean, default: false },
    analysisComplete: { type: Boolean, default: false },

    // Historical Data
    priceHistory: [
      {
        date: { type: Date },
        price: { type: Number },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Additional Schemas for Community Features
const knowledgeHubSchema = new mongoose.Schema(
  {
    weaverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Weaver",
      required: true,
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: {
      type: String,
      enum: ["Question", "Answer", "Tutorial", "Tip"],
      required: true,
    },
    category: { type: String, required: true },
    tags: [String],

    // For Q&A
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "KnowledgeHub" }, // For answers
    bestAnswer: { type: mongoose.Schema.Types.ObjectId, ref: "KnowledgeHub" },

    // Media
    images: [String],
    videos: [String],

    // Engagement
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },

    // Status
    status: {
      type: String,
      enum: ["Active", "Closed", "Archived"],
      default: "Active",
    },
    verified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Create indexes
weaverSchema.index({ userId: 1 });
weaverSchema.index({ "region.state": 1, "region.district": 1 });
weaverSchema.index({ "skills.name": 1 });

projectSchema.index({ weaverId: 1, status: 1 });
projectSchema.index({ deadline: 1 });
projectSchema.index({ currentStage: 1 });

itemSchema.index({ weaverId: 1 });
itemSchema.index({ category: 1, subcategory: 1 });
itemSchema.index({ "colors.name": 1 });

rawMaterialSchema.index({ weaverId: 1 });
rawMaterialSchema.index({ type: 1, subtype: 1 });
rawMaterialSchema.index({ currentStock: 1 });

scrapedDataSchema.index({ source: 1, scrapedAt: -1 });
scrapedDataSchema.index({ category: 1, subcategory: 1 });
scrapedDataSchema.index({ trendScore: -1 });
scrapedDataSchema.index({ "price.current": 1 });

knowledgeHubSchema.index({ weaverId: 1 });
knowledgeHubSchema.index({ category: 1, type: 1 });
knowledgeHubSchema.index({ tags: 1 });

// Export models
export const Weaver =
  mongoose.models.Weaver || mongoose.model("Weaver", weaverSchema);
export const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);
export const Item = mongoose.models.Item || mongoose.model("Item", itemSchema);
export const RawMaterial =
  mongoose.models.RawMaterial ||
  mongoose.model("RawMaterial", rawMaterialSchema);
export const ScrapedData =
  mongoose.models.ScrapedData ||
  mongoose.model("ScrapedData", scrapedDataSchema);
export const KnowledgeHub =
  mongoose.models.KnowledgeHub ||
  mongoose.model("KnowledgeHub", knowledgeHubSchema);

export default {
  Weaver,
  Project,
  Item,
  RawMaterial,
  ScrapedData,
  KnowledgeHub,
};
