"use client";

import { useApp } from "@/context/AppContext";
import { UserTypeSelector } from "@/components/user-type-selector";
import { ArtisanDashboard } from "@/components/artisan-dashboard";
import { ConsumerPortal } from "@/components/consumer-portal";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function Home() {
  const { state } = useApp();
  const router = useRouter();

  // Redirect to student dashboard if user type is student
  useEffect(() => {
    if (state.userType === 'student') {
      router.push('/student-dashboard');
    }
  }, [state.userType, router]);

  return (
    <div className="min-h-screen bg-background">
      {/* User Type Selector - Fixed at top */}
      <div className="fixed top-4 right-4 z-50">
        <UserTypeSelector />
      </div>

      {/* Main Content */}
      {state.userType === 'artisan' ? (
        <ArtisanDashboard />
      ) : state.userType === 'consumer' ? (
        <ConsumerPortal />
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Redirecting to Student Dashboard...</h1>
            <p className="text-foreground/60">Please wait while we redirect you.</p>
          </div>
        </div>
      )}
    </div>
  );
}
