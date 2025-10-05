"use client";

import React, { useEffect, useState, useRef } from 'react';
import { LineChart } from 'lucide-react';
import { motion } from 'framer-motion'; // Keep motion for internal animations

interface BootScreenProps {
  onBootComplete: () => void;
}

const bootMessages = [
  "Initializing market data feeds...",
  "Establishing secure trading protocols...",
  "Calibrating AI prediction models...",
  "Synchronizing portfolio data...",
  "Loading real-time analytics engine...",
  "Verifying system integrity...",
  "Optimizing trading environment...",
  "Welcome to Stock OS."
];

const BootScreen: React.FC<BootScreenProps> = ({ onBootComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
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
        if (newProgress <= 100) {
          setCurrentMessageIndex(Math.min(Math.floor(newProgress / 12.5), bootMessages.length - 1));
        }

        if (newProgress >= 100) {
          clearInterval(bootInterval);
          clearTimeout(playAudioTimeout);
          setTimeout(() => {
            onBootComplete(); // Call onBootComplete when progress is 100%
          }, 1000); // Allow a moment before calling complete to ensure exit animation starts
          return 100;
        }
        return newProgress;
      });
    }, 200);

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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="w-64 h-2 bg-gray-700 mt-8 rounded-full overflow-hidden"
      >
        <motion.div
          className="h-full bg-electric-blue"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.2, ease: "linear" }}
        ></motion.div>
      </motion.div>

      <motion.p
        key={currentMessageIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }} // Exit animation for message
        transition={{ duration: 0.3 }}
        className="text-gray-400 text-sm mt-4 h-5"
      >
        {bootMessages[currentMessageIndex]}
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="text-gray-500 text-xs mt-2"
      >
        Booting Stock-OS Terminal...
      </motion.p>
    </div>
  );
};

export default BootScreen;