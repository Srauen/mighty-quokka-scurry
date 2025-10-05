"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Settings } from 'lucide-react';
import { toast } from 'sonner';

const FloatingActionButtons: React.FC = () => {
  const handleAICopilotClick = () => {
    toast.info("AI Copilot", {
      description: "AI Copilot chat functionality coming soon! You could ask things like 'Which stocks have the highest momentum today?'",
      duration: 5000,
    });
  };

  const handleSettingsClick = () => {
    toast.info("Settings", {
      description: "Theme and layout controls coming soon! For now, use the main dashboard settings.",
      duration: 5000,
    });
  };

  return (
    <div className="fixed bottom-16 right-6 flex flex-col space-y-4 z-50">
      <Button
        onClick={handleAICopilotClick}
        className="relative w-14 h-14 rounded-full bg-electric-blue hover:bg-electric-blue/90 text-white shadow-lg animate-glow"
        aria-label="AI Copilot"
      >
        <MessageCircle className="h-7 w-7" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-teal"></span>
        </span>
      </Button>
      <Button
        onClick={handleSettingsClick}
        className="w-14 h-14 rounded-full bg-gray-700 hover:bg-gray-600 text-white shadow-lg"
        aria-label="Quick Settings"
      >
        <Settings className="h-7 w-7" />
      </Button>
    </div>
  );
};

export default FloatingActionButtons;