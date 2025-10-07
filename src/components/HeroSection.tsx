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
            Unleash Your Trading Edge. Dominate the Markets.
            <span className="block text-3xl md:text-5xl text-gray-600 dark:text-gray-300 mt-2">
              Introducing Stock OS: The World's First Operating System Engineered for Unrivaled Performance, AI-Driven Insights, and Ironclad Security in Trading.
            </span>
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            **The Problem:** Traders are drowning in app-switching, distractions, and security vulnerabilities. Students lack safe learning, while institutions grapple with customization and compliance. **The Solution:** Stock OS. A dedicated, distraction-free desktop with real-time charts, AI-guided insights, and seamless simulation-to-live trading. It's not just software; it's your competitive advantage.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={startOnboarding}
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white px-8 py-4 text-lg"
            >
              Download Stock OS ISO / USB Boot — Get Started Today!
            </Button>
            <Button 
              onClick={onWatchDemo} // Trigger the demo here
              variant="outline" 
              size="lg"
              className="px-8 py-4 text-lg border-2"
            >
              Watch Demo Video — See Stock OS in Action.
            </Button>
          </div>

          {/* Target Audience Teaser */}
          <div className="mt-16 text-left max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">Who Benefits from Stock OS?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-blue-600 dark:text-green-400 mb-2">Retail Traders:</h3>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 text-left">
                  <li>**Fast, Secure, AI-Guided Tools:** Maximize personal gains with unparalleled speed and data integrity.</li>
                  <li>**Distraction-Free Environment:** Eliminate browser tabs, social media, and other digital noise.</li>
                  <li>**Real-time Execution:** Minimize latency for critical market moves.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-600 dark:text-green-400 mb-2">Students & Universities:</h3>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 text-left">
                  <li>**Safe Simulation & Gamified Learning:** Practice risk-free with virtual capital, badges, and leaderboards.</li>
                  <li>**Adaptive Learning Paths:** AI-driven tutorials explain why trades succeed or fail.</li>
                  <li>**Real-World Market Exposure:** Bridge theory with practice in a controlled environment.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-600 dark:text-green-400 mb-2">Small Fintech Startups:</h3>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 text-left">
                  <li>**Customizable OS for App Development:** Rapidly integrate and deploy proprietary trading applications.</li>
                  <li>**Seamless Broker API Integration:** Connect effortlessly with major exchanges and data providers.</li>
                  <li>**White-Label Solutions:** Offer a branded, high-performance trading platform to your clients.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-600 dark:text-green-400 mb-2">Small/Medium Institutions:</h3>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 text-left">
                  <li>**Multi-User Systems & Compliance Dashboards:** Manage teams with role-based access and robust audit trails.</li>
                  <li>**Immutable Audit-Ready Portfolios:** Ensure regulatory adherence with comprehensive, tamper-proof records.</li>
                  <li>**Advanced Risk Management:** Implement sophisticated strategies with integrated analytics.</li>
                </ul>
              </div>
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-300 mt-8 text-center font-semibold">
              **Shared Traits:** All Stock OS users value **security, speed, accuracy, continuous learning, efficiency, risk management, and innovation** in financial technology.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;