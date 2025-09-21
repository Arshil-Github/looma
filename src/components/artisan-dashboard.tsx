"use client";

import { ArtisanSidebar } from "@/components/artisan-sidebar";
import { LoggingView } from "@/components/artisan-views/logging-view";
import { PredictionView } from "@/components/artisan-views/prediction-view";
import { StudentModelingView } from "@/components/artisan-views/student-modeling-view";
import { useApp } from "@/context/AppContext";

export function ArtisanDashboard() {
  const { state } = useApp();

  const renderCurrentView = () => {
    switch (state.currentArtisanView) {
      case 'logging':
        return <LoggingView />;
      case 'prediction':
        return <PredictionView />;
      case 'student-modeling':
        return <StudentModelingView />;
      default:
        return <LoggingView />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <ArtisanSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {renderCurrentView()}
      </div>
    </div>
  );
}

