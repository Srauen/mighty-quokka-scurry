"use client";

import React from 'react';
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  startOnboarding: () => void;
  sectionRef: React.MutableRefObject<HTMLElement | null>;
}

const HeroSection: React.FC<HeroSectionProps> = ({ startOnboarding, sectionRef }) => {
  return (
    <section 
      id="hero" 
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--primary)_0%,_transparent_70%)] opacity-20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-green-500 to-blue-600 bg-clip-text text-transparent">
            AI-Powered Stock Trading
            <span className="block text-3xl md:text-5xl text-gray-600 dark:text-gray-300 mt-2">
              Smarter Investing Starts Here
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Experience the future of stock trading with real-time AI insights, professional-grade analytics, 
            and seamless portfolio management across all your devices.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={startOnboarding}
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white px-8 py-4 text-lg"
            >
              Start Free Trial
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-4 text-lg border-2"
            >
              Watch Demo
            </Button>
          </div>

          {/* Animated Chart Preview */}
          <div className="mt-16 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-600 rounded"></div>
                <span className="font-semibold">AAPL</span>
              </div>
              <div className="text-green-500 font-semibold">+2.3%</div>
            </div>
            <div className="h-40 bg-gradient-to-r from-blue-100 to-green-100 dark:from-gray-700 dark:to-gray-600 rounded-lg relative">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0wLDIwIEM1MCw0MCAxMDAsMTAgMTUwLDMwIiBzdHJva2U9IiMwMGI0NjYiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIgLz48L3N2Zz4=')] bg-center bg-no-repeat bg-contain opacity-60"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;