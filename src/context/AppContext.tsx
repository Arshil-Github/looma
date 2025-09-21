"use client";

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Project, Item, RawMaterial, TimerState, ProjectStage, ConsumerProduct, ConsumerRequest, PersonalizedContent, ConsumerProfile, CartItem } from '@/types';

interface AppState {
  projects: Project[];
  items: Item[];
  rawMaterials: RawMaterial[];
  activeTimer: TimerState;
  currentProjectId?: string;
  userType: 'artisan' | 'student' | 'consumer';
  currentArtisanView: 'logging' | 'prediction' | 'student-modeling';
  currentConsumerView: 'marketplace' | 'request-portal' | 'marketing';
  // Consumer Portal State
  consumerProducts: ConsumerProduct[];
  consumerRequests: ConsumerRequest[];
  personalizedContent: PersonalizedContent[];
  consumerProfile: ConsumerProfile | null;
  cart: CartItem[];
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
  | { type: 'UPDATE_ELAPSED_TIME'; payload: number }
  | { type: 'SET_USER_TYPE'; payload: 'artisan' | 'student' | 'consumer' }
  | { type: 'SET_ARTISAN_VIEW'; payload: 'logging' | 'prediction' | 'student-modeling' }
  | { type: 'SET_CONSUMER_VIEW'; payload: 'marketplace' | 'request-portal' | 'marketing' }
  // Consumer Portal Actions
  | { type: 'ADD_CONSUMER_PRODUCT'; payload: ConsumerProduct }
  | { type: 'UPDATE_CONSUMER_PRODUCT'; payload: ConsumerProduct }
  | { type: 'ADD_CONSUMER_REQUEST'; payload: ConsumerRequest }
  | { type: 'UPDATE_CONSUMER_REQUEST'; payload: ConsumerRequest }
  | { type: 'ADD_PERSONALIZED_CONTENT'; payload: PersonalizedContent }
  | { type: 'UPDATE_PERSONALIZED_CONTENT'; payload: PersonalizedContent }
  | { type: 'SET_CONSUMER_PROFILE'; payload: ConsumerProfile }
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'UPDATE_CART_ITEM'; payload: { productId: string; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'CLEAR_CART' };

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
  },
  userType: 'artisan',
  currentArtisanView: 'logging',
  currentConsumerView: 'marketplace',
  // Consumer Portal Initial State
  consumerProducts: [
    {
      id: '1',
      name: 'Handwoven Silk Saree',
      artisanName: 'Priya Sharma',
      artisanId: 'artisan-1',
      price: 25000,
      images: ['/textures/paper.png'],
      description: 'Traditional Banarasi silk saree with intricate zari work',
      category: 'Textiles',
      materials: ['Silk', 'Zari'],
      techniques: ['Handloom', 'Zari Work'],
      colors: ['Gold', 'Red'],
      location: 'Varanasi, UP',
      rating: 4.8,
      reviewCount: 24,
      availability: 'in-stock',
      productionTime: 7,
      isCustomizable: true
    },
    {
      id: '2',
      name: 'Terracotta Pottery Set',
      artisanName: 'Rajesh Kumar',
      artisanId: 'artisan-2',
      price: 3500,
      images: ['/textures/paper.png'],
      description: 'Handcrafted terracotta pottery set with traditional designs',
      category: 'Pottery',
      materials: ['Clay'],
      techniques: ['Hand Molding', 'Traditional Firing'],
      colors: ['Terracotta', 'Brown'],
      location: 'Kolkata, WB',
      rating: 4.6,
      reviewCount: 18,
      availability: 'limited',
      productionTime: 3,
      isCustomizable: false
    },
    {
      id: '3',
      name: 'Handcrafted Wooden Jewelry Box',
      artisanName: 'Suresh Mehta',
      artisanId: 'artisan-3',
      price: 4500,
      images: ['/textures/paper.png'],
      description: 'Intricately carved wooden jewelry box with brass inlay work',
      category: 'Woodwork',
      materials: ['Teak Wood', 'Brass'],
      techniques: ['Hand Carving', 'Inlay Work'],
      colors: ['Brown', 'Gold'],
      location: 'Rajasthan, RJ',
      rating: 4.7,
      reviewCount: 15,
      availability: 'in-stock',
      productionTime: 5,
      isCustomizable: true
    },
    {
      id: '4',
      name: 'Handwoven Cotton Kurta',
      artisanName: 'Meera Patel',
      artisanId: 'artisan-4',
      price: 1800,
      images: ['/textures/paper.png'],
      description: 'Comfortable handwoven cotton kurta with traditional embroidery',
      category: 'Textiles',
      materials: ['Cotton', 'Thread'],
      techniques: ['Handloom', 'Hand Embroidery'],
      colors: ['White', 'Blue'],
      location: 'Gujarat, GJ',
      rating: 4.5,
      reviewCount: 32,
      availability: 'in-stock',
      productionTime: 4,
      isCustomizable: true
    },
    {
      id: '5',
      name: 'Handmade Ceramic Vase',
      artisanName: 'Anita Singh',
      artisanId: 'artisan-5',
      price: 2200,
      images: ['/textures/paper.png'],
      description: 'Beautiful hand-thrown ceramic vase with glazed finish',
      category: 'Pottery',
      materials: ['Ceramic Clay', 'Glaze'],
      techniques: ['Hand Throwing', 'Glazing'],
      colors: ['Blue', 'White'],
      location: 'Delhi, DL',
      rating: 4.4,
      reviewCount: 21,
      availability: 'in-stock',
      productionTime: 2,
      isCustomizable: false
    },
    {
      id: '6',
      name: 'Handwoven Woolen Shawl',
      artisanName: 'Tenzin Dorje',
      artisanId: 'artisan-6',
      price: 3200,
      images: ['/textures/paper.png'],
      description: 'Warm handwoven woolen shawl with traditional patterns',
      category: 'Textiles',
      materials: ['Wool', 'Natural Dyes'],
      techniques: ['Handloom', 'Natural Dyeing'],
      colors: ['Red', 'Orange', 'Yellow'],
      location: 'Ladakh, JK',
      rating: 4.9,
      reviewCount: 28,
      availability: 'limited',
      productionTime: 6,
      isCustomizable: true
    }
  ],
  consumerRequests: [],
  personalizedContent: [
    {
      id: '1',
      type: 'deal',
      title: 'Exclusive 20% Off on Silk Sarees',
      content: 'Get 20% off on all handwoven silk sarees from master artisans',
      imageUrl: '/textures/paper.png',
      priority: 'high',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      isRead: false,
      createdAt: new Date()
    },
    {
      id: '2',
      type: 'recommendation',
      title: 'Perfect Match for Your Style',
      content: 'Based on your recent purchases, we think you\'ll love this handwoven cotton kurta from Meera Patel',
      imageUrl: '/textures/paper.png',
      priority: 'medium',
      isRead: false,
      createdAt: new Date()
    },
    {
      id: '3',
      type: 'story',
      title: 'Meet Priya Sharma: Master of Banarasi Weaving',
      content: 'Discover the story behind the beautiful silk sarees you\'ve been admiring. Priya has been weaving for over 20 years...',
      imageUrl: '/textures/paper.png',
      priority: 'low',
      isRead: false,
      createdAt: new Date()
    },
    {
      id: '4',
      type: 'reel',
      title: 'Your Personalized 15-Second Reel',
      content: 'Watch how your handwoven scarf was made in Bhuj over 4 days by master artisan Tenzin Dorje',
      videoUrl: '/textures/paper.png',
      priority: 'high',
      isRead: false,
      createdAt: new Date()
    }
  ],
  consumerProfile: null,
  cart: []
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
    
    case 'SET_USER_TYPE':
      return {
        ...state,
        userType: action.payload
      };
    
    case 'SET_ARTISAN_VIEW':
      return {
        ...state,
        currentArtisanView: action.payload
      };
    
    case 'SET_CONSUMER_VIEW':
      return {
        ...state,
        currentConsumerView: action.payload
      };
    
    // Consumer Portal Reducer Cases
    case 'ADD_CONSUMER_PRODUCT':
      return {
        ...state,
        consumerProducts: [...state.consumerProducts, action.payload]
      };
    
    case 'UPDATE_CONSUMER_PRODUCT':
      return {
        ...state,
        consumerProducts: state.consumerProducts.map(product =>
          product.id === action.payload.id ? action.payload : product
        )
      };
    
    case 'ADD_CONSUMER_REQUEST':
      return {
        ...state,
        consumerRequests: [...state.consumerRequests, action.payload]
      };
    
    case 'UPDATE_CONSUMER_REQUEST':
      return {
        ...state,
        consumerRequests: state.consumerRequests.map(request =>
          request.id === action.payload.id ? action.payload : request
        )
      };
    
    case 'ADD_PERSONALIZED_CONTENT':
      return {
        ...state,
        personalizedContent: [...state.personalizedContent, action.payload]
      };
    
    case 'UPDATE_PERSONALIZED_CONTENT':
      return {
        ...state,
        personalizedContent: state.personalizedContent.map(content =>
          content.id === action.payload.id ? action.payload : content
        )
      };
    
    case 'SET_CONSUMER_PROFILE':
      return {
        ...state,
        consumerProfile: action.payload
      };
    
    case 'ADD_TO_CART':
      return {
        ...state,
        cart: [...state.cart, action.payload]
      };
    
    case 'UPDATE_CART_ITEM':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.productId === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.productId !== action.payload)
      };
    
    case 'CLEAR_CART':
      return {
        ...state,
        cart: []
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
  setUserType: (userType: 'artisan' | 'student' | 'consumer') => void;
  setArtisanView: (view: 'logging' | 'prediction' | 'student-modeling') => void;
  setConsumerView: (view: 'marketplace' | 'request-portal' | 'marketing') => void;
  // Consumer Portal Functions
  addToCart: (product: ConsumerProduct, quantity?: number) => void;
  updateCartItem: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  addConsumerRequest: (request: Omit<ConsumerRequest, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateConsumerRequest: (request: ConsumerRequest) => void;
  setConsumerProfile: (profile: ConsumerProfile) => void;
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

  const setUserType = (userType: 'artisan' | 'student' | 'consumer') => {
    dispatch({ type: 'SET_USER_TYPE', payload: userType });
  };

  const setArtisanView = (view: 'logging' | 'prediction' | 'student-modeling') => {
    dispatch({ type: 'SET_ARTISAN_VIEW', payload: view });
  };

  const setConsumerView = (view: 'marketplace' | 'request-portal' | 'marketing') => {
    dispatch({ type: 'SET_CONSUMER_VIEW', payload: view });
  };

  // Consumer Portal Functions
  const addToCart = (product: ConsumerProduct, quantity: number = 1) => {
    const existingItem = state.cart.find(item => item.productId === product.id);
    if (existingItem) {
      dispatch({ 
        type: 'UPDATE_CART_ITEM', 
        payload: { productId: product.id, quantity: existingItem.quantity + quantity } 
      });
    } else {
      dispatch({ 
        type: 'ADD_TO_CART', 
        payload: { productId: product.id, product, quantity } 
      });
    }
  };

  const updateCartItem = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_CART_ITEM', payload: { productId, quantity } });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const addConsumerRequest = (request: Omit<ConsumerRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRequest: ConsumerRequest = {
      ...request,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    dispatch({ type: 'ADD_CONSUMER_REQUEST', payload: newRequest });
  };

  const updateConsumerRequest = (request: ConsumerRequest) => {
    dispatch({ type: 'UPDATE_CONSUMER_REQUEST', payload: request });
  };

  const setConsumerProfile = (profile: ConsumerProfile) => {
    dispatch({ type: 'SET_CONSUMER_PROFILE', payload: profile });
  };

  return (
    <AppContext.Provider value={{
      state,
      dispatch,
      startTimer,
      pauseTimer,
      resumeTimer,
      stopTimer,
      updateProjectStage,
      setUserType,
      setArtisanView,
      setConsumerView,
      addToCart,
      updateCartItem,
      removeFromCart,
      clearCart,
      addConsumerRequest,
      updateConsumerRequest,
      setConsumerProfile
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