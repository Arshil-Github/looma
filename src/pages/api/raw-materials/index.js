import { connectToDatabase } from "../../lib/mongodb";
import { RawMaterial, Weaver } from "../../models";

export default async function handler(req, res) {
  await connectToDatabase();

  switch (req.method) {
    case "GET":
      return getRawMaterials(req, res);
    case "POST":
      return createRawMaterial(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

async function getRawMaterials(req, res) {
  try {
    const { weaverId } = req.query;

    let query = {};
    if (weaverId) {
      query.weaverId = weaverId;
    } else {
      // If no weaverId provided, get the first weaver as dummy data
      const dummyWeaver = await Weaver.findOne();
      if (dummyWeaver) {
        query.weaverId = dummyWeaver._id;
      }
    }

    const rawMaterials = await RawMaterial.find(query).sort({ createdAt: -1 });
    res.status(200).json(rawMaterials);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching raw materials", error: error.message });
  }
}

async function createRawMaterial(req, res) {
  try {
    const { 
      name, 
      type = "Yarn",
      material, 
      color, 
      currentStock, 
      unit,
      weaverId 
    } = req.body;

    // If no weaverId provided, get the first weaver as dummy data
    let assignedWeaverId = weaverId;
    if (!assignedWeaverId) {
      const dummyWeaver = await Weaver.findOne();
      if (!dummyWeaver) {
        return res.status(400).json({ 
          message: "No weaver found. Please create a weaver first or provide weaverId" 
        });
      }
      assignedWeaverId = dummyWeaver._id;
    }

    // Create the raw material
    const rawMaterial = new RawMaterial({
      weaverId: assignedWeaverId,
      name,
      type,
      material,
      color,
      currentStock: currentStock || 0,
      unit: unit || "g",
      quality: "Standard",
      minimumStock: 0,
      condition: "Good",
      lowStockAlert: true,
      expiryAlert: false
    });

    await rawMaterial.save();
    res.status(201).json(rawMaterial);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating raw material", error: error.message });
  }
}
