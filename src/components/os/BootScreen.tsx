"use client";

import React, { useEffect, useState } from 'react';
import { LineChart } from 'lucide-react';

interface BootScreenProps {
  onBootComplete: () => void;
}

const BootScreen: React.FC<BootScreenProps> = ({ onBootComplete }) => {
  const [progress, setProgress] = useState(0);
  const [showBootScreen, setShowBootScreen] = useState(true);

  useEffect(() => {
    const bootAudio = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-up-1854.mp3");
    
    const bootInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(bootInterval);
          setTimeout(() => {
            setShowBootScreen(false);
            bootAudio.play().catch(e => console.error("Audio playback failed:", e));
            onBootComplete();
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

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
          className="h-full bg-indigo-600 transition-all duration-100 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default BootScreen;