export interface Weaver {
  id: string;
  name: string;
  skills: string[];
  region: string;
}

export type ProjectStage = 'Preparation' | 'Preweaving' | 'Weaving' | 'Finishings' | 'Completed';

export interface Project {
  id: string;
  type: string;
  name: string;
  remarks: string;
  deadline: Date;
  currentStage: ProjectStage;
  rawMaterials: RawMaterial[];
  outputItem?: Item;
  startDate: Date;
  lastWorkedOn?: Date;
  totalTimeLogged: number; // in seconds
  isActive: boolean;
  timerStartTime?: Date;
}

export interface RawMaterial {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface Item {
  id: string;
  photo?: string;
  name: string;
  material: string;
  color: string;
  quantity: number;
  totalCost: number;
}

export interface TimerState {
  isRunning: boolean;
  startTime?: Date;
  elapsedTime: number; // in seconds
} 