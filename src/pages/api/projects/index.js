import { connectToDatabase } from "../../lib/mongodb";
import { Project, Weaver } from "../../models";

export default async function handler(req, res) {
  await connectToDatabase();

  switch (req.method) {
    case "GET":
      return getProjects(req, res);
    case "POST":
      return createProject(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

async function getProjects(req, res) {
  try {
    const { page = 1, limit = 10, status, currentStage } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (currentStage) {
      query.currentStage = currentStage;
    }

    const projects = await Project.find(query)
      .populate('weaverId', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Project.countDocuments(query);

    res.status(200).json({
      projects,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching projects", error: error.message });
  }
}

async function createProject(req, res) {
  try {
    const { 
      type, 
      name, 
      remarks, 
      deadline, 
      currentStage = "Planning",
      rawMaterials = [],
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

    // Create the project
    const project = new Project({
      weaverId: assignedWeaverId,
      type,
      name,
      description: remarks,
      remarks,
      deadline: new Date(deadline),
      currentStage,
      status: "Active",
      startDate: new Date(),
      lastWorkedOn: new Date(),
      inputRawMaterials: [],
      timeTracking: {
        totalHoursWorked: 0,
        sessions: [],
        currentSession: {
          isActive: false,
          startTime: null,
          currentStage: currentStage
        }
      },
      projectStages: [
        { stageName: "Planning", status: "Completed", startDate: new Date(), endDate: new Date() },
        { stageName: "Material Prep", status: currentStage === "Material Prep" ? "In Progress" : "Pending" },
        { stageName: "Warping", status: currentStage === "Warping" ? "In Progress" : "Pending" },
        { stageName: "Weaving", status: currentStage === "Weaving" ? "In Progress" : "Pending" },
        { stageName: "Finishing", status: currentStage === "Finishing" ? "In Progress" : "Pending" },
        { stageName: "Quality Check", status: currentStage === "Quality Check" ? "In Progress" : "Pending" },
        { stageName: "Completed", status: currentStage === "Completed" ? "In Progress" : "Pending" }
      ]
    });

    await project.save();
    
    // Populate the weaver information
    await project.populate('weaverId', 'name email');

    res.status(201).json(project);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating project", error: error.message });
  }
}
