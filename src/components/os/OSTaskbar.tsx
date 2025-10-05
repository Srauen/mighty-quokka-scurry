"use client";

import React from 'react';
import { LineChart, Calculator, TrendingUp, Briefcase, Newspaper, CandlestickChart } from 'lucide-react'; // Added CandlestickChart

interface OSTaskbarProps {
  openApp: (appId: string) => void;
  activeApps: string[];
}

const OSTaskbar: React.FC<OSTaskbarProps> = ({ openApp, activeApps }) => {
  const apps = [
    { id: 'charts-app', icon: <CandlestickChart className="w-7 h-7 text-green-400" /> }, // New Charts app
    { id: 'trading-terminal', icon: <TrendingUp className="w-7 h-7 text-yellow-400" /> },
    { id: 'portfolio-manager', icon: <Briefcase className="w-7 h-7 text-blue-400" /> },
    { id: 'news-feed', icon: <Newspaper className="w-7 h-7 text-purple-400" /> },
    { id: 'calculator', icon: <Calculator className="w-7 h-7 text-pink-400" /> },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-fit h-16 bg-gray-900 bg-opacity-75 backdrop-blur-lg flex items-center px-2 py-1 rounded-2xl shadow-lg z-40">
      <div className="flex items-center justify-center space-x-2">
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() => openApp(app.id)}
            className={`inline-flex justify-center items-center w-11 h-11 rounded-xl transition-all duration-200 relative
              ${activeApps.includes(app.id) ? 'bg-white/20 shadow-md transform -translate-y-0.5' : 'hover:bg-white/10 hover:transform -translate-y-0.5'}`}
            aria-label={`Open ${app.id}`}
          >
            {app.icon}
            {activeApps.includes(app.id) && (
              <span className="absolute bottom-0.5 w-1 h-1 bg-indigo-500 rounded-full shadow-sm"></span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OSTaskbar;