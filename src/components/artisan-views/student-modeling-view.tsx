"use client";

import { Users, UserPlus, MessageSquare, Calendar, Star } from "lucide-react";
import { Card } from "@/components/card";
import { Button } from "@/components/button";
import { ModelCandidates } from "@/components/model-candidates";

// Sample student data
const connectedStudents = [
  {
    id: 1,
    name: "Ananya Rao",
    location: "Mumbai",
    age: 20,
    height: "5' 8\"",
    specialties: ["Sarees", "Lehengas", "Traditional Wear"],
    rating: 4.8,
    lastActive: "2 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Priya Sharma",
    location: "Delhi",
    age: 22,
    height: "5' 6\"",
    specialties: ["Western Wear", "Fusion", "Casual"],
    rating: 4.6,
    lastActive: "1 day ago",
    imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=400&auto=format&fit=crop"
  }
];

const upcomingShoots = [
  { id: 1, studentName: "Ananya Rao", projectName: "Spring '25 Saree Collection", date: "2025-09-15", status: "Confirmed" },
  { id: 2, studentName: "Priya Sharma", projectName: "Diwali Festive Wear", date: "2025-10-05", status: "Pending" },
];

export function StudentModelingView() {
  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-accent">Student Modeling</h1>
          <p className="text-foreground/80">Manage student models and collaborations</p>
        </div>
        <Button Icon={UserPlus}>
          Connect New Student
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Connected Students */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Users className="text-secondary" size={24} />
              <h2 className="text-2xl font-bold text-secondary">Connected Students</h2>
            </div>
            <div className="space-y-4">
              {connectedStudents.map((student) => (
                <Card key={student.id} className="bg-blue-50/50 border-blue-200">
                  <div className="flex items-center gap-4 p-4">
                    <img
                      src={student.imageUrl}
                      alt={student.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-foreground">{student.name}</h3>
                        <div className="flex items-center gap-1">
                          <Star className="text-yellow-500" size={16} />
                          <span className="text-sm font-medium text-foreground">{student.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-foreground/70 mb-2">
                        {student.location} • {student.age} years • {student.height}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {student.specialties.map((specialty) => (
                          <span
                            key={specialty}
                            className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-foreground/60">Last active: {student.lastActive}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        Icon={MessageSquare}
                        onClick={() => console.log(`Message ${student.name}`)}
                      >
                        Message
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Model Candidates Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <UserPlus className="text-secondary" size={24} />
              <h2 className="text-2xl font-bold text-secondary">Available Models</h2>
            </div>
            <ModelCandidates />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Shoots */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="text-secondary" size={20} />
              <h3 className="text-lg font-bold text-secondary">Upcoming Shoots</h3>
            </div>
            <Card className="bg-orange-50/50 border-orange-200">
              {upcomingShoots.length > 0 ? (
                <div className="space-y-3">
                  {upcomingShoots.map((shoot) => (
                    <div key={shoot.id} className="p-3 bg-orange-100/50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-foreground text-sm">
                            {shoot.projectName}
                          </p>
                          <p className="text-xs text-foreground/70">
                            with {shoot.studentName}
                          </p>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          shoot.status === 'Confirmed' 
                            ? 'bg-green-200 text-green-800' 
                            : 'bg-yellow-200 text-yellow-800'
                        }`}>
                          {shoot.status}
                        </span>
                      </div>
                      <p className="text-xs text-foreground/70">
                        {new Date(shoot.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-foreground/60 py-4">
                  No upcoming shoots scheduled.
                </p>
              )}
            </Card>
          </div>

          {/* Quick Stats */}
          <div>
            <h3 className="text-lg font-bold text-secondary mb-4">Quick Stats</h3>
            <Card className="bg-green-50/50 border-green-200">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{connectedStudents.length}</div>
                  <div className="text-sm text-foreground/70">Connected Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{upcomingShoots.length}</div>
                  <div className="text-sm text-foreground/70">Upcoming Shoots</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">4.7</div>
                  <div className="text-sm text-foreground/70">Average Rating</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

