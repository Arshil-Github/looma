import { connectToDatabase } from "../../../../lib/mongodb";
import { Weaver } from "../../../../models";

export default async function handler(req, res) {
  await connectToDatabase();

  const { id } = req.query;

  switch (req.method) {
    case "POST":
      return addSkill(req, res, id);
    case "PUT":
      return updateSkill(req, res, id);
    case "DELETE":
      return removeSkill(req, res, id);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

async function addSkill(req, res, id) {
  try {
    const weaver = await Weaver.findById(id);
    if (!weaver) {
      return res.status(404).json({ message: "Weaver not found" });
    }

    weaver.skills.push(req.body);
    await weaver.save();

    res.status(200).json(weaver);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error adding skill", error: error.message });
  }
}

async function updateSkill(req, res, id) {
  try {
    const { skillId, ...updateData } = req.body;

    const weaver = await Weaver.findById(id);
    if (!weaver) {
      return res.status(404).json({ message: "Weaver not found" });
    }

    const skill = weaver.skills.id(skillId);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    Object.assign(skill, updateData);
    await weaver.save();

    res.status(200).json(weaver);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating skill", error: error.message });
  }
}

async function removeSkill(req, res, id) {
  try {
    const { skillId } = req.body;

    const weaver = await Weaver.findById(id);
    if (!weaver) {
      return res.status(404).json({ message: "Weaver not found" });
    }

    weaver.skills.id(skillId).remove();
    await weaver.save();

    res.status(200).json(weaver);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error removing skill", error: error.message });
  }
}
