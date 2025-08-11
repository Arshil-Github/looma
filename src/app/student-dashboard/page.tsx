"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/card";
import { Button } from "@/components/button";
import { Modal } from "@/components/modal"; // Your existing modal wrapper
import { SetPriceModal } from "@/components/set-price-component"; // The new component
import {
  User,
  Image as ImageIcon,
  Link as LinkIcon,
  Calendar,
  MessageSquare,
  LogOut,
  DollarSign,
} from "lucide-react";

// --- Sample Data for Demonstration ---
const studentData = {
  name: "Ananya Rao",
  height: "5' 8\"",
  place: "Mumbai",
  pay: 1500,
  age: 20,
  bio: "Ananya is a performing arts student with a passion for traditional textiles. Her expressive features and graceful posture make her ideal for showcasing elegant sarees and lehengas.",
  imageUrl:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
};

const connectedWeaver = {
  name: "Meera Devi",
  location: "Rajasthan",
  status: "Connected",
};

const upcomingShoots = [
  { id: 1, projectName: "Spring '25 Saree Collection", date: "2025-09-15" },
  { id: 2, projectName: "Diwali Festive Wear", date: "2025-10-05" },
];

const FinancialsCard = ({
  currentPrice,
  onSetPriceClick,
}: {
  currentPrice: number;
  onSetPriceClick: () => void;
}) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      <DollarSign className="text-secondary" size={20} />
      <h3 className="text-lg font-bold text-secondary">Financials</h3>
    </div>
    <Card className="bg-teal-50/50 border-teal-200">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <p className="font-medium text-foreground/80">Minimum Asking Price</p>
          <p className="font-bold text-2xl text-foreground">${currentPrice}</p>
        </div>
        <Button
          //   variant="secondary"
          className="w-full"
          onClick={onSetPriceClick}
        >
          Update Your Rate
        </Button>
      </div>
    </Card>
  </div>
);

// --- Sub-components for the Dashboard ---

const Header = () => (
  <div className="flex justify-between items-center mb-8">
    <div>
      <h1 className="text-4xl font-bold text-accent">Model Dashboard</h1>
      <p className="text-foreground/80">Welcome back, {studentData.name}!</p>
    </div>
    <Button
      //   variant="outline"
      Icon={LogOut}
      onClick={() => console.log("Log Out clicked")}
    >
      Log Out
    </Button>
  </div>
);

const ProfileEditor = () => (
  <Card>
    <div className="border-b border-border pb-4 mb-6">
      <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
        <User size={22} />
        Your Public Profile
      </h3>
      <p className="text-sm text-foreground/70 mt-1">
        This information will be visible to connected artisans.
      </p>
    </div>

    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      {/* Profile Picture Section */}
      <div className="flex items-center gap-6">
        <img
          src={studentData.imageUrl}
          alt={studentData.name}
          className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg"
        />
        <div>
          <label
            htmlFor="photo-upload"
            className="font-semibold text-foreground"
          >
            Profile Photo
          </label>
          <div className="flex items-center gap-3 mt-2">
            <Button
              //   variant="secondary"
              Icon={ImageIcon}
              onClick={() => console.log("Change Photo clicked")}
            >
              Change Photo
            </Button>
          </div>
        </div>
      </div>

      {/* Form Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            className="block text-sm font-medium text-foreground/80 mb-1"
            htmlFor="name"
          >
            Full Name
          </label>
          <input
            type="text"
            id="name"
            defaultValue={studentData.name}
            className="w-full p-2 border border-border rounded-lg bg-background"
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium text-foreground/80 mb-1"
            htmlFor="place"
          >
            Location / City
          </label>
          <input
            type="text"
            id="place"
            defaultValue={studentData.place}
            className="w-full p-2 border border-border rounded-lg bg-background"
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium text-foreground/80 mb-1"
            htmlFor="height"
          >
            Height
          </label>
          <input
            type="text"
            id="height"
            defaultValue={studentData.height}
            className="w-full p-2 border border-border rounded-lg bg-background"
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium text-foreground/80 mb-1"
            htmlFor="age"
          >
            Age
          </label>
          <input
            type="number"
            id="age"
            defaultValue={studentData.age}
            className="w-full p-2 border border-border rounded-lg bg-background"
          />
        </div>
      </div>

      {/* Bio Section */}
      <div>
        <label
          className="block text-sm font-medium text-foreground/80 mb-1"
          htmlFor="bio"
        >
          Biography
        </label>
        <textarea
          id="bio"
          rows={4}
          defaultValue={studentData.bio}
          className="w-full p-2 border border-border rounded-lg bg-background resize-y"
        ></textarea>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-border">
        <motion.button
          onClick={() => console.log("Save Changes clicked with form data")}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-2 rounded-lg transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Save Changes
        </motion.button>
      </div>
    </form>
  </Card>
);

const ConnectedWeaver = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      <LinkIcon className="text-secondary" size={20} />
      <h3 className="text-lg font-bold text-secondary">Your Connection</h3>
    </div>
    <Card className="bg-green-50/50 border-green-200">
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="font-bold text-lg text-foreground">
            {connectedWeaver.name}
          </p>
          <p className="text-sm text-foreground/70">
            {connectedWeaver.location}
          </p>
        </div>
        <span className="bg-green-200 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
          {connectedWeaver.status}
        </span>
      </div>
      <div className="flex gap-3">
        <Button
          //   variant="outline"
          className="w-full"
          Icon={MessageSquare}
          onClick={() => console.log("Send Message to Weaver clicked")}
        >
          Message
        </Button>
      </div>
    </Card>
  </div>
);

const UpcomingShoots = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      <Calendar className="text-secondary" size={20} />
      <h3 className="text-lg font-bold text-secondary">Upcoming Shoots</h3>
    </div>
    <Card className="bg-orange-50/50 border-orange-200">
      {upcomingShoots.length > 0 ? (
        <ul className="space-y-3">
          {upcomingShoots.map((shoot) => (
            <li key={shoot.id} className="p-3 bg-orange-100/50 rounded-lg">
              <p className="font-semibold text-foreground">
                {shoot.projectName}
              </p>
              <p className="text-sm text-foreground/70">
                {new Date(shoot.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-sm text-foreground/60 py-4">
          No upcoming shoots scheduled.
        </p>
      )}
    </Card>
  </div>
);

// --- The Main Page Component ---
export default function StudentDashboardPage() {
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  // State to hold the student's current minimum price
  const [minimumPrice, setMinimumPrice] = useState(120); // Default value

  const handleSavePrice = (newPrice: number) => {
    setMinimumPrice(newPrice);
    setIsPriceModalOpen(false); // Close modal on save
    console.log("New minimum price has been set to:", newPrice);
  };
  return (
    <main className="min-h-screen bg-background text-foreground p-6 max-w-7xl mx-auto">
      <Header />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          <ProfileEditor />
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <ConnectedWeaver />
          <UpcomingShoots />

          {/* --- NEW Financials Card with Trigger Button --- */}
          <FinancialsCard
            currentPrice={minimumPrice}
            onSetPriceClick={() => setIsPriceModalOpen(true)}
          />
        </div>
      </div>

      {/* --- The Modal Itself --- */}
      <Modal
        isOpen={isPriceModalOpen}
        onClose={() => setIsPriceModalOpen(false)}
        title="Set Your Minimum Asking Price"
      >
        <SetPriceModal
          currentPrice={minimumPrice}
          onSave={handleSavePrice}
          onCancel={() => setIsPriceModalOpen(false)}
        />
      </Modal>
    </main>
  );
}
