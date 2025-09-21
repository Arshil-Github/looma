import { connectToDatabase } from "../../lib/mongodb";
import { Weaver, RawMaterial } from "../../models";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await connectToDatabase();

  try {
    // Check if data already exists
    const existingWeaver = await Weaver.findOne();
    if (existingWeaver) {
      return res.status(200).json({ 
        message: 'Dummy data already exists', 
        weaver: existingWeaver 
      });
    }

    // Create dummy weaver
    const dummyWeaver = new Weaver({
      userId: 'dummy_weaver_001',
      name: 'Meera Devi',
      email: 'meera.devi@example.com',
      phone: '+91-9876543210',
      skills: [
        {
          name: 'Silk Weaving',
          level: 'Expert',
          yearsOfExperience: 15,
          certifications: ['Master Weaver Certificate']
        },
        {
          name: 'Cotton Handloom',
          level: 'Advanced',
          yearsOfExperience: 12,
          certifications: ['Handloom Excellence Award']
        }
      ],
      region: {
        state: 'Rajasthan',
        district: 'Jaipur',
        village: 'Sanganer',
        coordinates: {
          latitude: 26.9124,
          longitude: 75.7873
        }
      },
      businessProfile: {
        businessName: 'Meera Devi Handlooms',
        establishedYear: 2010,
        avgMonthlyProduction: 25,
        specializations: ['Sarees', 'Dupattas', 'Home Textiles']
      },
      preferences: {
        preferredMaterials: ['Silk', 'Cotton', 'Linen'],
        workingHours: {
          start: '09:00',
          end: '17:00'
        },
        notifications: {
          marketTrends: true,
          lowStock: true,
          community: true
        }
      },
      reputation: {
        rating: 4.8,
        totalReviews: 127,
        badges: ['Master Weaver', 'Community Helper', 'Trend Setter']
      }
    });

    await dummyWeaver.save();

    // Create dummy raw materials
    const rawMaterials = [
      {
        weaverId: dummyWeaver._id,
        name: 'Royal Purple Silk',
        type: 'Yarn',
        material: 'Silk',
        color: 'Purple',
        currentStock: 500,
        unit: 'g',
        quality: 'Premium',
        minimumStock: 100,
        condition: 'Excellent'
      },
      {
        weaverId: dummyWeaver._id,
        name: 'Zari Gold Thread',
        type: 'Thread',
        material: 'Gold',
        color: 'Gold',
        currentStock: 200,
        unit: 'g',
        quality: 'Premium',
        minimumStock: 50,
        condition: 'Excellent'
      },
      {
        weaverId: dummyWeaver._id,
        name: 'Emerald Silk',
        type: 'Yarn',
        material: 'Silk',
        color: 'Green',
        currentStock: 300,
        unit: 'g',
        quality: 'Standard',
        minimumStock: 100,
        condition: 'Good'
      },
      {
        weaverId: dummyWeaver._id,
        name: 'Crimson Cotton',
        type: 'Yarn',
        material: 'Cotton',
        color: 'Red',
        currentStock: 400,
        unit: 'g',
        quality: 'Standard',
        minimumStock: 100,
        condition: 'Good'
      },
      {
        weaverId: dummyWeaver._id,
        name: 'Sapphire Wool',
        type: 'Yarn',
        material: 'Wool',
        color: 'Blue',
        currentStock: 250,
        unit: 'g',
        quality: 'Standard',
        minimumStock: 50,
        condition: 'Good'
      },
      {
        weaverId: dummyWeaver._id,
        name: 'Amber Linen',
        type: 'Yarn',
        material: 'Linen',
        color: 'Yellow',
        currentStock: 350,
        unit: 'g',
        quality: 'Standard',
        minimumStock: 100,
        condition: 'Good'
      }
    ];

    await RawMaterial.insertMany(rawMaterials);

    res.status(201).json({
      message: 'Dummy data created successfully',
      weaver: dummyWeaver,
      rawMaterialsCount: rawMaterials.length
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating dummy data',
      error: error.message
    });
  }
}
