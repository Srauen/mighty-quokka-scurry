"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Bell, Maximize } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useStockData } from '@/hooks/use-stock-data';
import Chart from 'chart.js/auto'; // Import Chart.js

interface ChartTileProps {
  symbol: string;
  index: number;
  openFull: (symbol: string) => void;
}

const ChartTile: React.FC<ChartTileProps> = ({ symbol, index, openFull }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const baseStockSymbol = symbol.includes(':') ? symbol.split(':')[1] : symbol;

  const { stockData } = useStockData();
  const stockInfo = stockData[baseStockSymbol] || {
    companyName: 'Loading...',
    lastPrice: 0,
    dailyChange: 0,
    sentiments: [0],
    prices: [],
    labels: [],
  };

  const currentPrice = stockInfo.lastPrice;
  const dailyChange = stockInfo.dailyChange;
  const isPositiveChange = dailyChange >= 0;
  const profitProbability = stockInfo.sentiments[stockInfo.sentiments.length - 1] || 0;

  useEffect(() => {
    if (chartRef.current && stockInfo.prices.length > 0) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      if (!ctx) return;

      const gradient = ctx.createLinearGradient(0, 0, 0, 200);
      gradient.addColorStop(0, 'rgba(0, 174, 239, 0.5)'); // Electric Blue
      gradient.addColorStop(1, 'rgba(0, 174, 239, 0)');

      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: stockInfo.labels.slice(-30), // Last 30 days for mini-chart
          datasets: [{
            label: `${baseStockSymbol} Price`,
            data: stockInfo.prices.slice(-30),
            borderColor: '#00AEFF', // Electric Blue
            backgroundColor: gradient,
            pointBackgroundColor: '#00AEFF',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#00AEFF',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointRadius: 0,
            pointHoverRadius: 4,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              display: false,
              beginAtZero: false,
            },
            x: {
              display: false,
            }
          },
          plugins: {
            legend: { display: false },
            tooltip: { enabled: false }, // Disable tooltips for mini-chart
          },
          layout: {
            padding: {
              top: 5,
              bottom: 5,
            }
          },
          animation: { duration: 500, easing: 'easeOutQuart' }
        }
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [stockInfo.prices, stockInfo.labels, baseStockSymbol]);


  const handleSetAlert = () => {
    toast.info("Set Alert", { description: `Setting alert for ${baseStockSymbol}... (Feature coming soon)` });
  };

  return (
    <div className="glassmorphic-card chart-tile p-4 rounded-xl shadow-lg border border-gray-700 hover:border-electric-blue transition-all duration-200 flex flex-col" role="article" aria-label={`Chart tile ${symbol}`}>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-electric-blue to-teal flex items-center justify-center text-xs font-bold text-white" aria-hidden>
            {baseStockSymbol.substring(0, 2)}
          </div>
          <div>
            <div className="text-lg font-bold text-soft-white">{baseStockSymbol}</div>
            <div className="text-xs text-body-label">{stockInfo.companyName}</div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-xl font-bold text-soft-white">${currentPrice.toFixed(2)}</div>
          <div className={cn("flex items-center text-sm font-medium", isPositiveChange ? "text-teal" : "text-red-500")}>
            {isPositiveChange ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            {dailyChange.toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="relative flex-grow min-h-[150px] bg-[#0B0B0B] rounded-md overflow-hidden">
        <canvas ref={chartRef}></canvas>
      </div>

      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-800">
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" className="h-7 px-3 text-xs text-gray-400 hover:text-electric-blue" onClick={() => toast.info("Timeframe", { description: "Timeframe toggle coming soon!" })}>1D</Button>
          <Button variant="ghost" size="sm" className="h-7 px-3 text-xs text-gray-400 hover:text-electric-blue" onClick={() => toast.info("Timeframe", { description: "Timeframe toggle coming soon!" })}>1W</Button>
          <Button variant="ghost" size="sm" className="h-7 px-3 text-xs text-gray-400 hover:text-electric-blue" onClick={() => toast.info("Timeframe", { description: "Timeframe toggle coming soon!" })}>1M</Button>
          <Button variant="ghost" size="sm" className="h-7 px-3 text-xs text-gray-400 hover:text-electric-blue" onClick={() => toast.info("Timeframe", { description: "Timeframe toggle coming soon!" })}>1Y</Button>
        </div>
        <div className="flex space-x-2">
          <div className="flex items-center text-sm text-body-label">
            <span className="mr-1">📈</span> <strong>Prob:</strong> <span className="font-bold text-electric-blue">{profitProbability.toFixed(0)}%</span>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-electric-blue" onClick={handleSetAlert} aria-label="Set Alert">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-electric-blue" onClick={() => openFull(symbol)} aria-label="Open Full Chart">
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChartTile;