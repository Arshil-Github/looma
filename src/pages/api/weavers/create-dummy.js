import { connectToDatabase } from "../../lib/mongodb";
import { Weaver } from "../../models";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await connectToDatabase();

  try {
    // Check if weaver already exists
    const existingWeaver = await Weaver.findOne();
    if (existingWeaver) {
      return res.status(200).json({ 
        message: 'Dummy weaver already exists', 
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

    res.status(201).json({
      message: 'Dummy weaver created successfully',
      weaver: dummyWeaver
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating dummy weaver',
      error: error.message
    });
  }
}
