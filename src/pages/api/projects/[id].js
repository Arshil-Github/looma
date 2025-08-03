import { connectToDatabase } from "../../../lib/mongodb";
import { Project } from "../../../models";

export default async function handler(req, res) {
  await connectToDatabase();

  const { id } = req.query;

  switch (req.method) {
    case "GET":
      return getProject(req, res, id);
    case "PUT":
      return updateProject(req, res, id);
    case "DELETE":
      return deleteProject(req, res, id);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
