// src/pages/api/test/populate-dummy-data.js
import { connectToDatabase } from "../../../lib/mongodb";
import {
  Weaver,
  Project,
  Item,
  RawMaterial,
  ScrapedData,
} from "../../../models";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed. Use POST." });
  }

  try {
    await connectToDatabase();

    // Clear existing data (optional - remove if you want to keep existing data)
    const clearExisting = req.query.clear === "true";
    if (clearExisting) {
      await Promise.all([
        Weaver.deleteMany({}),
        Project.deleteMany({}),
        Item.deleteMany({}),
        RawMaterial.deleteMany({}),
        ScrapedData.deleteMany({}),
      ]);
    }

    // 1. Create Dummy Weavers
    const weavers = await Weaver.insertMany([
      {
        userId: "weaver001",
        name: "Rajesh Kumar",
        email: "rajesh.kumar@example.com",
        phone: "+91-9876543210",
        skills: [
          { name: "Silk Weaving", level: "Expert", yearsOfExperience: 15 },
          { name: "Cotton Handloom", level: "Advanced", yearsOfExperience: 12 },
        ],
        region: {
          state: "Uttar Pradesh",
          district: "Varanasi",
          village: "Sarai Mohana",
          coordinates: { latitude: 25.3176, longitude: 82.9739 },
        },
        businessProfile: {
          businessName: "Kumar Handloom",
          establishedYear: 2008,
          avgMonthlyProduction: 25,
          specializations: ["Banarasi Silk", "Wedding Sarees"],
        },
      },
      {
        userId: "weaver002",
        name: "Priya Sharma",
        email: "priya.sharma@example.com",
        phone: "+91-9876543211",
        skills: [
          { name: "Cotton Weaving", level: "Advanced", yearsOfExperience: 8 },
          {
            name: "Natural Dyeing",
            level: "Intermediate",
            yearsOfExperience: 5,
          },
        ],
        region: {
          state: "Gujarat",
          district: "Patan",
          village: "Salvi",
          coordinates: { latitude: 23.8512, longitude: 72.1194 },
        },
        businessProfile: {
          businessName: "Sharma Textiles",
          establishedYear: 2015,
          avgMonthlyProduction: 40,
          specializations: ["Patola Sarees", "Traditional Designs"],
        },
      },
      {
        userId: "weaver003",
        name: "Mohammed Ali",
        email: "mohammed.ali@example.com",
        phone: "+91-9876543212",
        skills: [
          { name: "Wool Weaving", level: "Expert", yearsOfExperience: 20 },
          { name: "Carpet Making", level: "Expert", yearsOfExperience: 18 },
        ],
        region: {
          state: "Kashmir",
          district: "Srinagar",
          village: "Zadibal",
          coordinates: { latitude: 34.0837, longitude: 74.7973 },
        },
        businessProfile: {
          businessName: "Kashmir Crafts",
          establishedYear: 2003,
          avgMonthlyProduction: 15,
          specializations: ["Kashmiri Shawls", "Carpets"],
        },
      },
    ]);

    console.log(`Created ${weavers.length} weavers`);

    // 2. Create Dummy Raw Materials for each weaver
    const rawMaterials = [];
    for (const weaver of weavers) {
      const materials = [
        {
          weaverId: weaver._id,
          name: "Silk Yarn",
          type: "Yarn",
          subtype: "Mulberry Silk",
          material: "Silk",
          color: "Golden",
          currentStock: 50,
          unit: "kg",
          minimumStock: 10,
          purchaseHistory: [
            {
              date: new Date("2024-01-15"),
              quantity: 100,
              pricePerUnit: 2500,
              totalCost: 250000,
              supplier: "Kashmir Silk House",
            },
          ],
          lastPurchasePrice: 2500,
        },
        {
          weaverId: weaver._id,
          name: "Cotton Thread",
          type: "Thread",
          subtype: "Organic Cotton",
          material: "Cotton",
          color: "White",
          currentStock: 200,
          unit: "kg",
          minimumStock: 50,
          purchaseHistory: [
            {
              date: new Date("2024-01-20"),
              quantity: 300,
              pricePerUnit: 800,
              totalCost: 240000,
              supplier: "Gujarat Cotton Mills",
            },
          ],
          lastPurchasePrice: 800,
        },
        {
          weaverId: weaver._id,
          name: "Natural Dye",
          type: "Dye",
          subtype: "Turmeric Dye",
          material: "Natural",
          color: "Yellow",
          currentStock: 25,
          unit: "kg",
          minimumStock: 5,
          purchaseHistory: [
            {
              date: new Date("2024-02-01"),
              quantity: 50,
              pricePerUnit: 300,
              totalCost: 15000,
              supplier: "Organic Dyes Ltd",
            },
          ],
          lastPurchasePrice: 300,
        },
      ];
      rawMaterials.push(...materials);
    }

    const createdMaterials = await RawMaterial.insertMany(rawMaterials);
    console.log(`Created ${createdMaterials.length} raw materials`);

    // 3. Create Dummy Projects
    const projects = [];
    for (let i = 0; i < weavers.length; i++) {
      const weaver = weavers[i];
      const weaverMaterials = createdMaterials.filter(
        (m) => m.weaverId.toString() === weaver._id.toString()
      );

      const projectData = [
        {
          weaverId: weaver._id,
          type: "Saree",
          name: `Silk Saree Project ${i + 1}`,
          description:
            "Beautiful handwoven silk saree with traditional patterns",
          deadline: new Date("2024-03-15"),
          currentStage: "Weaving",
          status: "Active",
          inputRawMaterials: [
            {
              materialId: weaverMaterials[0]._id,
              quantityUsed: 5,
              unit: "kg",
              costPerUnit: 2500,
              totalCost: 12500,
            },
          ],
          expectedOutputQuantity: 1,
          projectStages: [
            {
              stageName: "Planning",
              status: "Completed",
              estimatedHours: 2,
              actualHours: 2,
            },
            {
              stageName: "Material Prep",
              status: "Completed",
              estimatedHours: 4,
              actualHours: 3.5,
            },
            {
              stageName: "Weaving",
              status: "In Progress",
              estimatedHours: 40,
              actualHours: 25,
            },
          ],
          timeTracking: {
            totalHoursWorked: 30.5,
            sessions: [
              {
                startTime: new Date("2024-02-01T09:00:00"),
                endTime: new Date("2024-02-01T17:00:00"),
                duration: 480, // 8 hours in minutes
                stage: "Planning",
                isActive: false,
              },
              {
                startTime: new Date("2024-02-02T09:00:00"),
                endTime: new Date("2024-02-02T15:30:00"),
                duration: 390, // 6.5 hours in minutes
                stage: "Weaving",
                isActive: false,
              },
            ],
            currentSession: { isActive: false },
          },
          estimatedCost: 15000,
          actualCost: 12500,
        },
        {
          weaverId: weaver._id,
          type: "Dupatta",
          name: `Cotton Dupatta Project ${i + 1}`,
          description: "Lightweight cotton dupatta with block prints",
          deadline: new Date("2024-02-28"),
          currentStage: "Finishing",
          status: "Active",
          inputRawMaterials: [
            {
              materialId: weaverMaterials[1]._id,
              quantityUsed: 2,
              unit: "kg",
              costPerUnit: 800,
              totalCost: 1600,
            },
          ],
          expectedOutputQuantity: 3,
          timeTracking: {
            totalHoursWorked: 15,
            sessions: [],
            currentSession: { isActive: false },
          },
          estimatedCost: 3000,
          actualCost: 1600,
        },
      ];
      projects.push(...projectData);
    }

    const createdProjects = await Project.insertMany(projects);
    console.log(`Created ${createdProjects.length} projects`);

    // 4. Create Dummy Items (Finished Products)
    const items = [];
    for (let i = 0; i < createdProjects.length; i++) {
      const project = createdProjects[i];
      if (i % 3 === 0) {
        // Create items for every 3rd project (simulate completed projects)
        const itemData = {
          weaverId: project.weaverId,
          projectId: project._id,
          name: `Handwoven ${project.type} #${i + 1}`,
          description: `Beautiful handcrafted ${project.type.toLowerCase()} made with traditional techniques`,
          category: project.type,
          photos: [
            { url: "https://example.com/photo1.jpg", isPrimary: true },
            { url: "https://example.com/photo2.jpg", isPrimary: false },
          ],
          dimensions: {
            length: project.type === "Saree" ? 550 : 200,
            width: project.type === "Saree" ? 110 : 100,
            weight: project.type === "Saree" ? 800 : 300,
          },
          materials: [
            {
              type: "Silk",
              percentage: 100,
              quality: "Premium",
            },
          ],
          colors: [
            { name: "Golden", isPrimary: true },
            { name: "Red", isPrimary: false },
          ],
          patternType: "Traditional",
          patternDescription: "Intricate paisley and floral motifs",
          quantity: 1,
          unit: "piece",
          totalCost: project.actualCost || 12500,
          costPerUnit: project.actualCost || 12500,
          sellingPrice: (project.actualCost || 12500) * 2.5, // 2.5x markup
          status: "In Stock",
          qualityGrade: "A",
          trendScore: Math.floor(Math.random() * 50) + 50, // Random score 50-100
          demandLevel: "High",
        };
        items.push(itemData);
      }
    }

    const createdItems = await Item.insertMany(items);
    console.log(`Created ${createdItems.length} items`);

    // 5. Create Dummy Scraped Data (Market Intelligence)
    const scrapedData = [
      {
        source: "Amazon",
        sourceUrl: "https://amazon.in/handloom-saree-1",
        productName: "Banarasi Silk Saree - Golden Border",
        productDescription:
          "Pure silk handloom saree with traditional zari work",
        price: {
          current: 25000,
          original: 30000,
          currency: "INR",
          discount: 17,
        },
        images: [{ url: "https://example.com/scraped1.jpg", isPrimary: true }],
        category: "Saree",
        subcategory: "Silk Saree",
        tags: ["handloom", "silk", "traditional", "wedding"],
        keywords: ["banarasi", "silk", "saree", "handwoven"],
        rating: 4.5,
        reviewCount: 234,
        availability: "In Stock",
        seller: "Traditional Crafts Store",
        trendScore: 85,
        extractedFeatures: {
          materials: ["Silk"],
          colors: ["Golden", "Red"],
          patterns: ["Paisley", "Floral"],
          style: ["Traditional", "Wedding"],
          targetAudience: ["Women", "Bride"],
        },
      },
      {
        source: "Flipkart",
        sourceUrl: "https://flipkart.com/cotton-dupatta-1",
        productName: "Handloom Cotton Dupatta - Block Print",
        productDescription:
          "Pure cotton dupatta with hand block printed designs",
        price: { current: 1500, currency: "INR" },
        images: [{ url: "https://example.com/scraped2.jpg", isPrimary: true }],
        category: "Dupatta",
        subcategory: "Cotton Dupatta",
        tags: ["handloom", "cotton", "block print", "casual"],
        keywords: ["cotton", "dupatta", "handloom", "printed"],
        rating: 4.2,
        reviewCount: 89,
        availability: "In Stock",
        seller: "Artisan Store",
        trendScore: 70,
        extractedFeatures: {
          materials: ["Cotton"],
          colors: ["Blue", "White"],
          patterns: ["Block Print", "Geometric"],
          style: ["Casual", "Traditional"],
          targetAudience: ["Women", "Youth"],
        },
      },
      {
        source: "Etsy",
        sourceUrl: "https://etsy.com/kashmiri-shawl-1",
        productName: "Kashmiri Pashmina Shawl - Hand Embroidered",
        productDescription:
          "Authentic Kashmiri pashmina with intricate hand embroidery",
        price: { current: 15000, currency: "INR" },
        images: [{ url: "https://example.com/scraped3.jpg", isPrimary: true }],
        category: "Shawl",
        subcategory: "Pashmina Shawl",
        tags: ["kashmiri", "pashmina", "embroidered", "luxury"],
        keywords: ["kashmiri", "pashmina", "shawl", "handmade"],
        rating: 4.8,
        reviewCount: 156,
        availability: "Limited Stock",
        seller: "Kashmir Artisans",
        trendScore: 92,
        extractedFeatures: {
          materials: ["Pashmina"],
          colors: ["Cream", "Gold"],
          patterns: ["Embroidered", "Paisley"],
          style: ["Luxury", "Traditional"],
          targetAudience: ["Women", "Premium"],
        },
      },
    ];

    const createdScrapedData = await ScrapedData.insertMany(scrapedData);
    console.log(`Created ${createdScrapedData.length} scraped data entries`);

    // Return summary
    const summary = {
      success: true,
      message: "Dummy data populated successfully!",
      data: {
        weavers: weavers.length,
        rawMaterials: createdMaterials.length,
        projects: createdProjects.length,
        items: createdItems.length,
        scrapedData: createdScrapedData.length,
      },
      sampleIds: {
        weaverId: weavers[0]._id,
        projectId: createdProjects[0]._id,
        itemId: createdItems.length > 0 ? createdItems[0]._id : null,
        materialId: createdMaterials[0]._id,
        scrapedDataId: createdScrapedData[0]._id,
      },
    };

    res.status(200).json(summary);
  } catch (error) {
    console.error("Error populating dummy data:", error);
    res.status(500).json({
      success: false,
      message: "Error populating dummy data",
      error: error.message,
    });
  }
}

// Helper function to generate random data (you can expand this)
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}
