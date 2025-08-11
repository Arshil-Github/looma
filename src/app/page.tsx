"use client";

import { useState } from "react";
import {
  BookOpen,
  Droplets,
  PlusCircle,
  Package,
  User,
  BarChart2,
} from "lucide-react";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Modal } from "@/components/modal";
import { NewProjectForm } from "@/components/new-project-form";
import { EditRawMaterialForm } from "@/components/edit-raw-material-form";
import { ProjectCard } from "@/components/project-card";
import { useApp } from "@/context/AppContext";
import { Project, RawMaterial } from "@/types";

// Import the TrendAnalyzer component
import { TrendAnalyzer } from "@/components/trend-analyzer";
import { ModelCandidates } from "@/components/model-candidates";
// --- Weaver Data & Component ---

const weaverData = {
  _id: { $oid: "688f847933172ecec065d2e7" },
  weaver_id: "W003",
  name: "Meera Devi",
  skills: ["cotton weaving", "block printing", "embroidery", "handloom"],
  raw_material: ["cotton", "linen"],
  location: "Rajasthan",
  experience_years: 12,
  price_range: [150, 600],
  specialties: ["dresses", "shirts", "home textiles"],
};

const TagList = ({ title, items }: { title: string; items: string[] }) => (
  <div>
    <h4 className="text-sm font-semibold text-foreground/80 mb-2">{title}</h4>
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full"
        >
          {item}
        </span>
      ))}
    </div>
  </div>
);

const WeaverDescription = () => (
  <div>
    <div className="flex items-center gap-2 mb-4">
      <User className="text-secondary" size={20} />
      <h3 className="text-lg font-bold text-secondary border-b-2 border-foreground pb-1">
        Weaver Description
      </h3>
    </div>
    <Card className="bg-blue-50/50 border-blue-200">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">
            {weaverData.name}
          </h3>
          <p className="text-sm text-foreground/70">
            {weaverData.location} • {weaverData.experience_years} years of
            experience
          </p>
        </div>
        <TagList title="Skills" items={weaverData.skills} />
        <TagList title="Specialties" items={weaverData.specialties} />
        <TagList title="Raw Materials" items={weaverData.raw_material} />
      </div>
    </Card>
  </div>
);

// --- Main Page Component ---

export default function Home() {
  const { state, dispatch } = useApp();
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<RawMaterial | null>(
    null
  );

  const handleCreateProject = (
    projectData: Omit<
      Project,
      "id" | "startDate" | "lastWorkedOn" | "totalTimeLogged" | "isActive"
    >
  ) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      startDate: new Date(),
      totalTimeLogged: 0,
      isActive: false,
    };
    dispatch({ type: "ADD_PROJECT", payload: newProject });
    setIsNewProjectModalOpen(false);
  };

  const handleEditMaterial = (material: RawMaterial) => {
    dispatch({ type: "UPDATE_RAW_MATERIAL", payload: material });
    setEditingMaterial(null);
  };

  return (
    <main className="min-h-screen p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-accent">Looma</h1>
          <p className="text-foreground/80">Your Artisan Workspace</p>
        </div>
        <Button
          Icon={PlusCircle}
          onClick={() => setIsNewProjectModalOpen(true)}
        >
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Project & Analyzer Display Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Current Project Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="text-secondary" size={24} />
              <h2 className="text-2xl font-bold text-secondary">
                Current Project
              </h2>
            </div>
            {state.projects.length === 0 ? (
              <Card>
                <div className="text-center py-8">
                  <p className="text-foreground/60 mb-4">
                    No projects yet. Create your first project to get started!
                  </p>
                  <Button onClick={() => setIsNewProjectModalOpen(true)}>
                    Create First Project
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {state.projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>

          {/* Trend Analyzer Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 className="text-secondary" size={24} />
              <h2 className="text-2xl font-bold text-secondary">
                Trend Engine
              </h2>
            </div>
            <TrendAnalyzer />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Yarn Manager Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Droplets className="text-secondary" size={20} />
              <h3 className="text-lg font-bold text-secondary border-b-2 border-foreground pb-1">
                Yarn Manager
              </h3>
            </div>
            <Card className="bg-green-50/50 border-green-200">
              <div className="space-y-3">
                {state.rawMaterials.slice(0, 3).map((material) => (
                  <div
                    key={material.id}
                    className="flex justify-between items-center p-2 bg-green-100/50 rounded-lg cursor-pointer hover:bg-green-200/50 transition-colors"
                    onClick={() => setEditingMaterial(material)}
                  >
                    <span className="font-medium text-foreground">
                      {material.name}
                    </span>
                    <span className="text-sm text-foreground/70">
                      {material.quantity}
                      {material.unit}
                    </span>
                  </div>
                ))}
                {state.rawMaterials.length > 3 && (
                  <div className="text-center pt-2">
                    <span className="text-sm text-foreground/60 cursor-pointer hover:text-foreground">
                      More...
                    </span>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Items Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Package className="text-secondary" size={20} />
              <h3 className="text-lg font-bold text-secondary border-b-2 border-foreground pb-1">
                Items
              </h3>
            </div>
            <Card className="bg-orange-50/50 border-orange-200">
              <div className="grid grid-cols-1 gap-3">
                {state.items.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-foreground/60">
                      No completed items yet
                    </p>
                  </div>
                ) : (
                  state.items.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="bg-orange-100/50 rounded-lg p-3"
                    >
                      <div className="text-sm font-medium text-foreground">
                        {item.name}
                      </div>
                      <div className="text-xs text-foreground/70">
                        Quantity: {item.quantity}
                      </div>
                    </div>
                  ))
                )}
                {state.items.length > 3 && (
                  <div className="text-center pt-2">
                    <span className="text-sm text-foreground/60 cursor-pointer hover:text-foreground">
                      More...
                    </span>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Weaver Description Section */}
          <WeaverDescription />

          <ModelCandidates />
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        title="Create New Project"
      >
        <NewProjectForm
          onSubmit={handleCreateProject}
          onCancel={() => setIsNewProjectModalOpen(false)}
        />
      </Modal>
      <Modal
        isOpen={!!editingMaterial}
        onClose={() => setEditingMaterial(null)}
        title="Edit Yarn"
      >
        {editingMaterial && (
          <EditRawMaterialForm
            material={editingMaterial}
            onSubmit={handleEditMaterial}
            onCancel={() => setEditingMaterial(null)}
          />
        )}
      </Modal>
    </main>
  );
}
