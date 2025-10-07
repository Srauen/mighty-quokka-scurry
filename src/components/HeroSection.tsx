"use client";

import React from 'react';
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  startOnboarding: () => void;
  onWatchDemo: () => void; // New prop
  sectionRef: React.MutableRefObject<HTMLElement | null>;
}

const HeroSection: React.FC<HeroSectionProps> = ({ startOnboarding, onWatchDemo, sectionRef }) => {
  return (
    <section 
      id="hero" 
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center relative overflow-hidden py-20"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--primary)_0%,_transparent_70%)] opacity-20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-green-500 to-blue-600 bg-clip-text text-transparent">
            Trade Smarter. Trade Safer.
            <span className="block text-3xl md:text-5xl text-gray-600 dark:text-gray-300 mt-2">
              Stock OS — The First OS Built for Traders.
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Traders often juggle multiple apps, facing distractions, slow execution, and security risks. Students and beginners lack a safe, structured environment to practice. Stock OS solves this by booting directly into a distraction-free desktop, offering real-time charts, AI-guided trading insights, and simulation/live trading modes all in one secure platform. Whether you're an individual trader seeking advanced tools, a student aiming to learn in a risk-free environment, or a fintech startup/institution looking for customizable solutions, Stock OS is designed to meet your specific needs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={startOnboarding}
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white px-8 py-4 text-lg"
            >
              Get Started Today
            </Button>
            <Button 
              onClick={onWatchDemo} // Trigger the demo here
              variant="outline" 
              size="lg"
              className="px-8 py-4 text-lg border-2"
            >
              Watch Demo
            </Button>
          </div>

          {/* The OS Simulator will no longer be directly embedded here */}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;