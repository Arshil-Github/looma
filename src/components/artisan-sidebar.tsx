"use client";

import { BookOpen, BarChart2, Users } from "lucide-react";
import { useApp } from "@/context/AppContext";

const navigationItems = [
  {
    id: 'logging' as const,
    label: 'Logging',
    icon: BookOpen,
    description: 'Project management and time tracking'
  },
  {
    id: 'prediction' as const,
    label: 'Prediction',
    icon: BarChart2,
    description: 'Trend analysis and forecasting'
  },
  {
    id: 'student-modeling' as const,
    label: 'Student Modeling',
    icon: Users,
    description: 'Student model management'
  }
];

export function ArtisanSidebar() {
  const { state, setArtisanView } = useApp();

  return (
    <div className="w-64 bg-background border-r border-border h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold text-accent">Artisan Dashboard</h2>
        <p className="text-sm text-foreground/60 mt-1">Choose your workspace</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = state.currentArtisanView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setArtisanView(item.id)}
              className={`w-full flex items-start gap-3 p-4 rounded-lg text-left transition-colors ${
                isActive
                  ? 'bg-accent/20 border border-accent/30'
                  : 'hover:bg-accent/10 border border-transparent'
              }`}
            >
              <Icon 
                className={`mt-0.5 ${
                  isActive ? 'text-accent' : 'text-secondary'
                }`} 
                size={20} 
              />
              <div className="flex-1">
                <div className={`font-medium ${
                  isActive ? 'text-accent' : 'text-foreground'
                }`}>
                  {item.label}
                </div>
                <div className="text-sm text-foreground/60 mt-1">
                  {item.description}
                </div>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

