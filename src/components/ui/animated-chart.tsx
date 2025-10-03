"use client";

import React, { useEffect, useRef } from 'react';

interface AnimatedChartProps {
  symbol: string;
  change: string;
  className?: string;
}

export const AnimatedChart: React.FC<AnimatedChartProps> = ({ 
  symbol, 
  change, 
  className = '' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw chart line
    ctx.beginPath();
    ctx.moveTo(0, height * 0.7);
    
    // Create a simple upward trending line
    for (let i = 1; i <= 10; i++) {
      const x = (width / 10) * i;
      const y = height * (0.7 - (i * 0.03));
      ctx.lineTo(x, y);
    }

    ctx.strokeStyle = change.includes('+') ? '#10b981' : '#ef4444';
    ctx.lineWidth = 3;
    ctx.stroke();

  }, [change]);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={`w-6 h-6 rounded ${
            change.includes('+') ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span className="font-semibold">{symbol}</span>
        </div>
        <div className={`font-semibold ${
          change.includes('+') ? 'text-green-500' : 'text-red-500'
        }`}>
          {change}
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={300}
        height={160}
        className="w-full bg-gradient-to-r from-blue-100 to-green-100 dark:from-gray-700 dark:to-gray-600 rounded-lg"
      />
    </div>
  );
};

export default AnimatedChart;