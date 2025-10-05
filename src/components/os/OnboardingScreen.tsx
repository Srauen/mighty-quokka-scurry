"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion'; // Keep motion for internal animations
import { Keyboard, Space } from 'lucide-react'; // Using Keyboard icon for Alt, Space for Spacebar
import { cn } from '@/lib/utils';

interface OnboardingScreenProps {
  onOnboardingComplete: () => void;
}

const tickerItems = [
  "AAPL +1.2%", "MSFT -0.5%", "GOOGL +0.8%", "TSLA +2.1%", "AMZN -0.3%",
  "NVDA +3.5%", "FB +0.7%", "NFLX -1.1%", "BABA +0.9%", "SBUX +0.2%",
  "KO +0.1%", "PEP -0.1%", "MCD +0.4%", "DIS +1.5%", "NKE -0.6%"
];

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onOnboardingComplete }) => {
  const [showScreen, setShowScreen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowScreen(false);
      onOnboardingComplete(); // Call onOnboardingComplete when screen should transition
    }, 8000); // Show for 8 seconds before transitioning

    return () => clearTimeout(timer);
  }, [onOnboardingComplete]);

  if (!showScreen) return null; // Render null if not showing, AnimatePresence will handle exit

  return (
    <motion.div
      className="fixed inset-0 flex flex-col justify-center items-center z-50 onboarding-animated-bg font-jetbrains-mono text-soft-white"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
        className="text-center"
      >
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold text-electric-blue animate-onboarding-float"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
        >
          Welcome to Stock-OS
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl text-gray-300 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          where trading meets simplicity.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 1, ease: "easeOut" }}
          className="mt-12 flex flex-col items-center"
        >
          <p className="text-lg md:text-xl text-gray-400 mb-4">
            Press <span className="font-bold text-electric-blue">Alt + Space</span> to open Spotlight Search.
          </p>
          <div className="flex items-center space-x-2">
            <motion.div
              className="flex items-center justify-center w-16 h-10 bg-gray-800 border border-gray-600 rounded-md text-lg font-bold animate-onboarding-alt-space-pulse"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 3.5, duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
            >
              Alt
            </motion.div>
            <span className="text-gray-500">+</span>
            <motion.div
              className="flex items-center justify-center w-24 h-10 bg-gray-800 border border-gray-600 rounded-md text-lg font-bold animate-onboarding-alt-space-pulse"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 3.8, duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
            >
              Space
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Minimal Ticker Line at the bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-0 left-0 right-0 h-10 bg-black/30 backdrop-blur-sm flex items-center overflow-hidden"
      >
        <div className="flex animate-ticker-scroll whitespace-nowrap">
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <span key={index} className="inline-flex items-center mx-4 text-sm font-medium text-gray-400">
              {item}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OnboardingScreen;