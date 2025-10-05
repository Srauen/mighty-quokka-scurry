"use client";

import React, { useEffect, useState, useRef } from 'react';
import { LineChart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BootScreenProps {
  onBootComplete: () => void;
}

const BootScreen: React.FC<BootScreenProps> = ({ onBootComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isBootComplete, setIsBootComplete] = useState(false); // New state to control final message
  const bootAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Preload audio
    bootAudioRef.current = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-up-1854.mp3");
    bootAudioRef.current.load();

    const playAudioTimeout = setTimeout(() => {
      bootAudioRef.current?.play().catch(e => console.error("Audio playback failed:", e));
    }, 500);

    const bootInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(bootInterval);
          clearTimeout(playAudioTimeout);
          setIsBootComplete(true); // Set boot complete to show final message
          setTimeout(() => {
            onBootComplete();
          }, 1500); // Allow "ready" message to display before transitioning
          return 100;
        }
        return newProgress;
      });
    }, 200); // Fill progress every 0.2 seconds

    return () => {
      clearInterval(bootInterval);
      clearTimeout(playAudioTimeout);
      if (bootAudioRef.current) {
        bootAudioRef.current.pause();
        bootAudioRef.current.currentTime = 0;
      }
    };
  }, [onBootComplete]);

  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center z-50 boot-screen-bg font-jetbrains-mono text-soft-white">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center justify-center"
      >
        <motion.div
          className="w-16 h-16 text-electric-blue animate-boot-logo-pulse"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity }}
        >
          <LineChart className="w-full h-full" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-electric-blue text-4xl font-bold mt-4"
        >
          Stock OS
        </motion.p>
      </motion.div>

      <div className="mt-8 text-center">
        <AnimatePresence mode="wait">
          {isBootComplete ? (
            <motion.p
              key="ready-message"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-electric-blue text-lg font-bold h-5 mb-2" // Styling for "Stock OS ready."
            >
              Stock OS ready.
            </motion.p>
          ) : (
            <motion.p
              key="loading-message"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-gray-400 text-sm h-5 mb-2" // Styling for "Loading..."
            >
              Loading...
            </motion.p>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }} // Adjusted delay to appear after initial logo animation
          className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden mx-auto" // Centered progress bar
        >
          <motion.div
            className="h-full bg-electric-blue"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2, ease: "linear" }}
          ></motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="text-gray-500 text-xs mt-2"
        >
          Booting Stock-OS Terminal...
        </motion.p>
      </div>
    </div>
  );
};

export default BootScreen;