import { connectToDatabase } from "../../../lib/mongodb";
import { Weaver } from "../../../models";

export default async function handler(req, res) {
  await connectToDatabase();

  switch (req.method) {
    case "GET":
      return getWeavers(req, res);
    case "POST":
      return createWeaver(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

async function getWeavers(req, res) {
  try {
    const { page = 1, limit = 10, region, skills } = req.query;

    let query = {};

    if (region) {
      query["region.state"] = region;
    }

    if (skills) {
      const skillsArray = skills.split(",");
      query["skills.name"] = { $in: skillsArray };
    }

    const weavers = await Weaver.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Weaver.countDocuments(query);

    res.status(200).json({
      weavers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching weavers", error: error.message });
  }
}

async function createWeaver(req, res) {
  try {
    const weaver = new Weaver(req.body);
    await weaver.save();
    res.status(201).json(weaver);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating weaver", error: error.message });
  }
}
