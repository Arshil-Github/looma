"use client";

import { useState } from "react";
import { RawMaterial } from "@/types";
import { Button } from "./button";

interface EditRawMaterialFormProps {
  material: RawMaterial;
  onSubmit: (material: RawMaterial) => void;
  onCancel: () => void;
}

export function EditRawMaterialForm({ material, onSubmit, onCancel }: EditRawMaterialFormProps) {
  const [formData, setFormData] = useState({ ...material });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-sm font-medium text-foreground mb-2">Quantity</label>
          <input
            type="number"
            value={formData.quantity}
            onChange={e => setFormData(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Unit</label>
          <select
            value={formData.unit}
            onChange={e => setFormData(prev => ({ ...prev, unit: e.target.value }))}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="g">g</option>
            <option value="kg">kg</option>
            <option value="m">m</option>
            <option value="pcs">pcs</option>
          </select>
        </div>
      </div>
      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1">Save</Button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-border rounded-full text-foreground hover:bg-background"
        >Cancel</button>
      </div>
    </form>
  );
}