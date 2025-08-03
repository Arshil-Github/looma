"use client";

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Project, Item, RawMaterial, TimerState, ProjectStage } from '@/types';

interface AppState {
  projects: Project[];
  items: Item[];
  rawMaterials: RawMaterial[];
  activeTimer: TimerState;
  currentProjectId?: string;
}

type AppAction =
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'ADD_ITEM'; payload: Item }
  | { type: 'UPDATE_ITEM'; payload: Item }
  | { type: 'DELETE_ITEM'; payload: string }
  | { type: 'ADD_RAW_MATERIAL'; payload: RawMaterial }
  | { type: 'UPDATE_RAW_MATERIAL'; payload: RawMaterial }
  | { type: 'DELETE_RAW_MATERIAL'; payload: string }
  | { type: 'START_TIMER'; payload: { projectId: string; startTime: Date } }
  | { type: 'PAUSE_TIMER' }
  | { type: 'RESUME_TIMER'; payload: Date }
  | { type: 'STOP_TIMER' }
  | { type: 'UPDATE_ELAPSED_TIME'; payload: number };

const initialState: AppState = {
  projects: [
    {
      id: '1',
      type: 'Saree',
      name: 'Banarasi Wedding Saree',
      remarks: 'Traditional handwoven silk with zari work',
      deadline: new Date('2024-12-31'),
      currentStage: 'Weaving',
      rawMaterials: [
        { id: '1', name: 'Silk Yarn', quantity: 500, unit: 'g' },
        { id: '2', name: 'Zari Thread', quantity: 200, unit: 'g' }
      ],
      startDate: new Date('2024-01-15'),
      lastWorkedOn: new Date('2024-01-20'),
      totalTimeLogged: 50400, // 14 hours in seconds
      isActive: false
    }
  ],
  items: [],
  rawMaterials: [
    { id: '1', name: 'Royal Purple Silk', quantity: 500, unit: 'g' },
    { id: '2', name: 'Zari Gold Thread', quantity: 200, unit: 'g' },
    { id: '3', name: 'Emerald Silk', quantity: 300, unit: 'g' },
    { id: '4', name: 'Crimson Cotton', quantity: 400, unit: 'g' },
    { id: '5', name: 'Sapphire Wool', quantity: 250, unit: 'g' },
    { id: '6', name: 'Amber Linen', quantity: 350, unit: 'g' }
  ],
  activeTimer: {
    isRunning: false,
    elapsedTime: 0
  }
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [...state.projects, action.payload]
      };
    
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.id ? action.payload : project
        )
      };
    
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(project => project.id !== action.payload)
      };
    
    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, action.payload]
      };
    
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? action.payload : item
        )
      };
    
    case 'DELETE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    
    case 'ADD_RAW_MATERIAL':
      return {
        ...state,
        rawMaterials: [...state.rawMaterials, action.payload]
      };
    
    case 'UPDATE_RAW_MATERIAL':
      return {
        ...state,
        rawMaterials: state.rawMaterials.map(material =>
          material.id === action.payload.id ? action.payload : material
        )
      };
    
    case 'DELETE_RAW_MATERIAL':
      return {
        ...state,
        rawMaterials: state.rawMaterials.filter(material => material.id !== action.payload)
      };
    
    case 'START_TIMER':
      return {
        ...state,
        activeTimer: {
          isRunning: true,
          startTime: action.payload.startTime,
          elapsedTime: 0
        },
        currentProjectId: action.payload.projectId,
        projects: state.projects.map(project =>
          project.id === action.payload.projectId
            ? { ...project, isActive: true, timerStartTime: action.payload.startTime }
            : { ...project, isActive: false, timerStartTime: undefined }
        )
      };
    
    case 'PAUSE_TIMER':
      return {
        ...state,
        activeTimer: {
          ...state.activeTimer,
          isRunning: false
        },
        projects: state.projects.map(project =>
          project.id === state.currentProjectId
            ? {
                ...project,
                totalTimeLogged: project.totalTimeLogged + state.activeTimer.elapsedTime,
                lastWorkedOn: new Date()
              }
            : project
        )
      };
    
    case 'RESUME_TIMER':
      return {
        ...state,
        activeTimer: {
          ...state.activeTimer,
          isRunning: true,
          startTime: action.payload
        }
      };
    
    case 'STOP_TIMER':
      return {
        ...state,
        activeTimer: {
          isRunning: false,
          elapsedTime: 0
        },
        currentProjectId: undefined,
        projects: state.projects.map(project =>
          project.id === state.currentProjectId
            ? {
                ...project,
                isActive: false,
                timerStartTime: undefined,
                totalTimeLogged: project.totalTimeLogged + state.activeTimer.elapsedTime,
                lastWorkedOn: new Date()
              }
            : project
        )
      };
    
    case 'UPDATE_ELAPSED_TIME':
      return {
        ...state,
        activeTimer: {
          ...state.activeTimer,
          elapsedTime: action.payload
        }
      };
    
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  startTimer: (projectId: string) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  updateProjectStage: (projectId: string, stage: ProjectStage) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (state.activeTimer.isRunning && state.activeTimer.startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - state.activeTimer.startTime!.getTime()) / 1000);
        dispatch({ type: 'UPDATE_ELAPSED_TIME', payload: elapsed });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.activeTimer.isRunning, state.activeTimer.startTime]);

  const startTimer = (projectId: string) => {
    dispatch({ type: 'START_TIMER', payload: { projectId, startTime: new Date() } });
  };

  const pauseTimer = () => {
    dispatch({ type: 'PAUSE_TIMER' });
  };

  const resumeTimer = () => {
    dispatch({ type: 'RESUME_TIMER', payload: new Date() });
  };

  const stopTimer = () => {
    dispatch({ type: 'STOP_TIMER' });
  };

  const updateProjectStage = (projectId: string, stage: ProjectStage) => {
    const project = state.projects.find(p => p.id === projectId);
    if (project) {
      dispatch({
        type: 'UPDATE_PROJECT',
        payload: { ...project, currentStage: stage }
      });
    }
  };

  return (
    <AppContext.Provider value={{
      state,
      dispatch,
      startTimer,
      pauseTimer,
      resumeTimer,
      stopTimer,
      updateProjectStage
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 