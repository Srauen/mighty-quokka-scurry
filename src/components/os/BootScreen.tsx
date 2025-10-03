"use client";

import React, { useEffect, useState } from 'react';
import { LineChart } from 'lucide-react';

interface BootScreenProps {
  onBootComplete: () => void;
}

const bootMessages = [
  "Initializing core systems...",
  "Loading kernel modules...",
  "Detecting hardware components...",
  "Establishing network connection...",
  "Verifying data integrity...",
  "Starting user interface...",
  "Optimizing performance...",
  "Welcome to Stock OS."
];

const BootScreen: React.FC<BootScreenProps> = ({ onBootComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showBootScreen, setShowBootScreen] = useState(true);

  useEffect(() => {
    const bootAudio = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-up-1854.mp3");
    
    const bootInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 10;
        if (newProgress <= 100) {
          setCurrentMessageIndex(Math.min(Math.floor(newProgress / 12.5), bootMessages.length - 1));
        }

        if (newProgress >= 100) {
          clearInterval(bootInterval);
          setTimeout(() => {
            setShowBootScreen(false);
            bootAudio.play().catch(e => console.error("Audio playback failed:", e));
            onBootComplete();
          }, 1000); // Give a moment for the last message to display
          return 100;
        }
        return newProgress;
      });
    }, 200); // Faster updates for messages

    return () => clearInterval(bootInterval);
  }, [onBootComplete]);

  if (!showBootScreen) return null;

  return (
    <div className="fixed inset-0 bg-[#0d0f17] bg-[radial-gradient(circle_at_center,_#1a2033_0%,_#0d0f17_100%)] flex flex-col justify-center items-center z-50 transition-opacity duration-500">
      <div className="flex flex-col items-center justify-center animate-bounceIn">
        <LineChart className="w-16 h-16 text-indigo-400" />
        <p className="text-indigo-400 text-3xl font-bold mt-4">Stock OS</p>
      </div>
      <div className="w-52 h-1 bg-gray-700 mt-6 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 transition-all duration-200 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-gray-400 text-sm mt-4 h-5 opacity-0 animate-fadeIn" style={{ animationDelay: '0.5s' }}>
        {bootMessages[currentMessageIndex]}
      </p>
    </div>
  );
};

export default BootScreen;