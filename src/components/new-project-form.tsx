"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./button";
import { Project, RawMaterial, ProjectStage } from "@/types";

interface NewProjectFormProps {
  onSubmit: (project: Omit<Project, 'id' | 'startDate' | 'lastWorkedOn' | 'totalTimeLogged' | 'isActive'>) => void;
  onCancel: () => void;
}

export function NewProjectForm({ onSubmit, onCancel }: NewProjectFormProps) {
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    remarks: "",
    deadline: "",
    currentStage: "Preparation" as ProjectStage,
    rawMaterials: [] as RawMaterial[]
  });

  const [newMaterial, setNewMaterial] = useState({
    name: "",
    quantity: "",
    unit: "g"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const project = {
      ...formData,
      deadline: new Date(formData.deadline),
      rawMaterials: formData.rawMaterials
    };
    
    onSubmit(project);
  };

  const addMaterial = () => {
    if (newMaterial.name && newMaterial.quantity) {
      setFormData(prev => ({
        ...prev,
        rawMaterials: [
          ...prev.rawMaterials,
          {
            id: Date.now().toString(),
            name: newMaterial.name,
            quantity: parseFloat(newMaterial.quantity),
            unit: newMaterial.unit
          }
        ]
      }));
      setNewMaterial({ name: "", quantity: "", unit: "g" });
    }
  };

  const removeMaterial = (id: string) => {
    setFormData(prev => ({
      ...prev,
      rawMaterials: prev.rawMaterials.filter(m => m.id !== id)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Project Type
        </label>
        <input
          type="text"
          value={formData.type}
          onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="e.g., Saree, Shawl, Scarf"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Project Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="e.g., Banarasi Wedding Saree"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Remarks
        </label>
        <textarea
          value={formData.remarks}
          onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          rows={3}
          placeholder="Additional notes about the project"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Deadline
        </label>
        <input
          type="date"
          value={formData.deadline}
          onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Current Stage
        </label>
        <select
          value={formData.currentStage}
          onChange={(e) => setFormData(prev => ({ ...prev, currentStage: e.target.value as ProjectStage }))}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="Preparation">Preparation</option>
          <option value="Preweaving">Preweaving</option>
          <option value="Weaving">Weaving</option>
          <option value="Finishings">Finishings</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Raw Materials
        </label>
        <div className="space-y-2">
          {formData.rawMaterials.map((material) => (
            <motion.div
              key={material.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 p-2 bg-background border border-border rounded-lg"
            >
              <span className="flex-1 text-sm">
                {material.name} - {material.quantity} {material.unit}
              </span>
              <button
                type="button"
                onClick={() => removeMaterial(material.id)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </motion.div>
          ))}
          
          <div className="flex gap-2">
            <input
              type="text"
              value={newMaterial.name}
              onChange={(e) => setNewMaterial(prev => ({ ...prev, name: e.target.value }))}
              className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Material name"
            />
            <input
              type="number"
              value={newMaterial.quantity}
              onChange={(e) => setNewMaterial(prev => ({ ...prev, quantity: e.target.value }))}
              className="w-20 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Qty"
            />
            <select
              value={newMaterial.unit}
              onChange={(e) => setNewMaterial(prev => ({ ...prev, unit: e.target.value }))}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="g">g</option>
              <option value="kg">kg</option>
              <option value="m">m</option>
              <option value="pcs">pcs</option>
            </select>
            <button
              type="button"
              onClick={addMaterial}
              className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1">
          Create Project
        </Button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-border rounded-full text-foreground hover:bg-background"
        >
          Cancel
        </button>
      </div>
    </form>
  );
} 