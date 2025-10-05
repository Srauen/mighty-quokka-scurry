"use client";

import React, { useEffect, useState, useRef } from "react";
import { LineChart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BootScreenProps {
  onBootComplete: () => void;
}

const BootScreen = ({ onBootComplete }: BootScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [isBootComplete, setIsBootComplete] = useState(false);
  const bootAudioRef = useRef<HTMLAudioElement | null>(null);

  // Example stock ticker symbols
  const [ticker, setTicker] = useState(["AAPL 174.5 ▲", "GOOGL 128.3 ▼", "TSLA 910.2 ▲"]);

  useEffect(() => {
    // Boot audio
    bootAudioRef.current = new Audio(
      "https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-up-1854.mp3"
    );
    const playAudioTimeout = setTimeout(() => {
      bootAudioRef.current?.play().catch((e) => console.error("Audio playback failed:", e));
    }, 500);

    // Progress bar animation
    const bootInterval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 10;
        if (next >= 100) {
          clearInterval(bootInterval);
          clearTimeout(playAudioTimeout);
          setIsBootComplete(true);
          setTimeout(() => {
            onBootComplete();
          }, 2000); // Show onboarding message for 2s
          return 100;
        }
        return next;
      });
    }, 200);

    // Stock ticker animation
    const tickerInterval = setInterval(() => {
      setTicker((prev) => [...prev.slice(1), prev[0]]);
    }, 1000);

    return () => {
      clearInterval(bootInterval);
      clearTimeout(playAudioTimeout);
      clearInterval(tickerInterval);
      if (bootAudioRef.current) {
        bootAudioRef.current.pause();
        bootAudioRef.current.currentTime = 0;
      }
    };
  }, [onBootComplete]);

  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center z-50 boot-screen-bg font-jetbrains-mono text-soft-white bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
      {/* Faint grid/candlestick background */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center justify-center space-y-6 z-10"
      >
        {/* Logo animation in center */}
        <motion.div
          className="w-24 h-24 text-electric-blue animate-boot-logo-pulse"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <LineChart className="w-full h-full" />
        </motion.div>

        {/* App Name */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-4xl text-electric-blue font-bold"
        >
          Stock OS
        </motion.h1>

        {/* Boot messages */}
        <div className="text-center mt-4 space-y-2">
          <AnimatePresence mode="wait">
            {isBootComplete ? (
              <motion.p
                key="onboarding-message"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-lg text-soft-white font-semibold"
              >
                Welcome to Stock-OS — where trading meets simplicity.
              </motion.p>
            ) : (
              <motion.p
                key="loading-message"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-gray-400 text-sm"
              >
                Booting Stock-OS Terminal...
              </motion.p>
            )}
          </AnimatePresence>

          {/* Progress Bar */}
          {!isBootComplete && (
            <motion.div
              className="w-72 h-2 bg-gray-700 rounded-full overflow-hidden mx-auto mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <motion.div
                className="h-full bg-electric-blue"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2, ease: "linear" }}
              />
            </motion.div>
          )}

          {/* Prompt for Spotlight Search */}
          {isBootComplete && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-400 text-sm mt-2"
            >
              Press <kbd className="px-1 py-0.5 bg-gray-700 rounded">Alt</kbd> +{" "}
              <kbd className="px-1 py-0.5 bg-gray-700 rounded">Space</kbd> to open
              Spotlight Search.
            </motion.p>
          )}
        </div>
      </motion.div>

      {/* Scrolling Stock Ticker */}
      <div className="absolute bottom-2 w-full overflow-hidden">
        <motion.div
          className="flex gap-8 whitespace-nowrap text-gray-400 text-sm px-4"
          animate={{ x: ["100%", "-100%"] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        >
          {ticker.map((item, idx) => (
            <span key={idx} className="mx-4">
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default BootScreen;
