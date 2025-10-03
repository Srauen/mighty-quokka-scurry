"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { LineChart } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  activeSection: string;
  startOnboarding: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, setDarkMode, activeSection, startOnboarding }) => {
  const navLinks = ['features', 'pricing', 'team', 'contact'];

  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
              <LineChart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              Stock-OS
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((section) => (
              <a
                key={section}
                href={`#${section}`}
                className={`font-medium transition-all duration-300 ${
                  activeSection === section
                    ? 'text-blue-600 dark:text-blue-400 scale-105'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </a>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
              className="text-gray-600 dark:text-gray-300"
            >
              {darkMode ? '☀️' : '🌙'}
            </Button>
            <Button onClick={startOnboarding} className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;