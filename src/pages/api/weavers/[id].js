import { connectToDatabase } from "../../../lib/mongodb";
import { Weaver } from "../../../models";

export default async function handler(req, res) {
  await connectToDatabase();

  const { id } = req.query;

  switch (req.method) {
    case "GET":
      return getWeaver(req, res, id);
    case "PUT":
      return updateWeaver(req, res, id);
    case "DELETE":
      return deleteWeaver(req, res, id);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

async function getWeaver(req, res, id) {
  try {
    const weaver = await Weaver.findById(id);
    if (!weaver) {
      return res.status(404).json({ message: "Weaver not found" });
    }
    res.status(200).json(weaver);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching weaver", error: error.message });
  }
}

async function updateWeaver(req, res, id) {
  try {
    const weaver = await Weaver.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!weaver) {
      return res.status(404).json({ message: "Weaver not found" });
    }
    res.status(200).json(weaver);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating weaver", error: error.message });
  }
}

async function deleteWeaver(req, res, id) {
  try {
    const weaver = await Weaver.findByIdAndDelete(id);
    if (!weaver) {
      return res.status(404).json({ message: "Weaver not found" });
    }
    res.status(200).json({ message: "Weaver deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting weaver", error: error.message });
  }
}
