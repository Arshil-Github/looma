"use client";


import { Card } from "./card";
import { WovenProgressBar } from "./woven-progress-bar";
import { Timer } from "./timer";
import { Project, ProjectStage } from "@/types";
import { useApp } from "@/context/AppContext";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { state, startTimer, pauseTimer, resumeTimer, stopTimer, updateProjectStage } = useApp();
  
  const isActive = state.currentProjectId === project.id;
  const activeTimer = state.activeTimer;
  
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getProgressPercentage = (stage: ProjectStage) => {
    const stages: ProjectStage[] = ['Preparation', 'Preweaving', 'Weaving', 'Finishings', 'Completed'];
    const currentIndex = stages.indexOf(stage);
    return ((currentIndex + 1) / stages.length) * 100;
  };

  const handleTimerStart = () => {
    startTimer(project.id);
  };

  const handleTimerPause = () => {
    pauseTimer();
  };

  const handleTimerResume = () => {
    resumeTimer();
  };

  const handleTimerStop = () => {
    stopTimer();
  };

  const handleStageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateProjectStage(project.id, e.target.value as ProjectStage);
  };

  return (
    <Card className={`${isActive ? 'ring-2 ring-primary' : ''} bg-blue-50/50 border-blue-200`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Project Details */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {project.type} - {project.name}
            </h3>
            <p className="text-foreground/70 text-sm mt-1">{project.remarks}</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Project Description
              </label>
              <p className="text-sm text-foreground/70">{project.remarks || 'No description provided'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Deadline
              </label>
              <p className="text-sm text-foreground/70">{project.deadline.toLocaleDateString()}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Project Stage Selector
              </label>
              <select
                value={project.currentStage}
                onChange={handleStageChange}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              >
                <option value="Preparation">Preparation</option>
                <option value="Preweaving">Preweaving</option>
                <option value="Weaving">Weaving</option>
                <option value="Finishings">Finishings</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Side - Timer and Progress */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-primary font-semibold text-sm">
                {formatTime(project.totalTimeLogged + (isActive ? activeTimer.elapsedTime : 0))} Logged
              </span>
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-xs text-foreground/60">Icon</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Current hours Timer
            </label>
            <Timer
              elapsedTime={isActive ? activeTimer.elapsedTime : 0}
              isRunning={isActive && activeTimer.isRunning}
              onStart={handleTimerStart}
              onPause={handleTimerPause}
              onResume={handleTimerResume}
              onStop={handleTimerStop}
            />
          </div>

          {/* Progress Bar */}
          <div>
            <WovenProgressBar progress={getProgressPercentage(project.currentStage)} />
          </div>
        </div>
      </div>

      {/* Bottom Section - Click for more */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="text-center">
          <span className="text-sm text-foreground/60 cursor-pointer hover:text-foreground">
            Click here for more
          </span>
        </div>
      </div>
    </Card>
  );
} 