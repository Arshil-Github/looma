"use client";

import { useState } from "react";
import { ChevronDown, User, GraduationCap, ShoppingBag } from "lucide-react";
import { useApp } from "@/context/AppContext";

export function UserTypeSelector() {
  const { state, setUserType } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const handleUserTypeChange = (userType: 'artisan' | 'student' | 'consumer') => {
    setUserType(userType);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg hover:bg-accent/10 transition-colors"
      >
        {state.userType === 'artisan' ? (
          <User className="text-secondary" size={18} />
        ) : state.userType === 'student' ? (
          <GraduationCap className="text-secondary" size={18} />
        ) : (
          <ShoppingBag className="text-secondary" size={18} />
        )}
        <span className="font-medium text-foreground">
          {state.userType === 'artisan' ? 'Artisan' : state.userType === 'student' ? 'Student' : 'Consumer'}
        </span>
        <ChevronDown className="text-foreground/60" size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-lg shadow-lg z-50">
          <div className="py-2">
            <button
              onClick={() => handleUserTypeChange('artisan')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-accent/10 transition-colors ${
                state.userType === 'artisan' ? 'bg-accent/20' : ''
              }`}
            >
              <User className="text-secondary" size={18} />
              <div>
                <div className="font-medium text-foreground">Artisan</div>
                <div className="text-sm text-foreground/60">Dashboard & Tools</div>
              </div>
            </button>
            <button
              onClick={() => handleUserTypeChange('student')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-accent/10 transition-colors ${
                state.userType === 'student' ? 'bg-accent/20' : ''
              }`}
            >
              <GraduationCap className="text-secondary" size={18} />
              <div>
                <div className="font-medium text-foreground">Student</div>
                <div className="text-sm text-foreground/60">Model Dashboard</div>
              </div>
            </button>
            <button
              onClick={() => handleUserTypeChange('consumer')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-accent/10 transition-colors ${
                state.userType === 'consumer' ? 'bg-accent/20' : ''
              }`}
            >
              <ShoppingBag className="text-secondary" size={18} />
              <div>
                <div className="font-medium text-foreground">Consumer</div>
                <div className="text-sm text-foreground/60">Marketplace & Shopping</div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
