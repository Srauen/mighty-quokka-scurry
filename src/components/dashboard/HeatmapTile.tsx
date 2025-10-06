"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Bell } from 'lucide-react';
import { toast } from 'sonner';

interface HeatmapTileProps {
  symbol: string;
  companyName: string;
  price: number;
  change: number; // Percentage change
  volume: number;
  marketCap: number;
  sector: string;
  aiScore: number;
  colorScheme: 'default' | 'colorblind';
  isTopMover: boolean;
  onClick: (symbol: string) => void;
  style?: React.CSSProperties; // Added style prop
}

const HeatmapTile: React.FC<HeatmapTileProps> = ({
  symbol,
  companyName,
  price,
  change,
  volume,
  marketCap,
  sector,
  aiScore,
  colorScheme,
  isTopMover,
  onClick,
  style, // Destructure style
}) => {
  const [bgColor, setBgColor] = useState('bg-heatmap-neutral');

  useEffect(() => {
    let newColor = '';
    if (colorScheme === 'default') {
      if (change <= -5) newColor = 'bg-heatmap-extreme-down';
      else if (change <= -2) newColor = 'bg-heatmap-strong-down';
      else if (change < -0.5) newColor = 'bg-heatmap-moderate-down';
      else if (change > 5) newColor = 'bg-heatmap-strong-up';
      else if (change > 2) newColor = 'bg-heatmap-moderate-up';
      else if (change > 0.5) newColor = 'bg-teal'; // Using teal for slight positive
      else newColor = 'bg-heatmap-neutral';
    } else { // Colorblind-friendly
      if (change < -0.5) newColor = 'bg-heatmap-cb-down';
      else if (change > 0.5) newColor = 'bg-heatmap-cb-up';
      else newColor = 'bg-heatmap-cb-neutral';
    }
    setBgColor(newColor);
  }, [change, colorScheme]);

  const formatMarketCap = (value: number) => {
    if (value >= 1_000_000_000_000) return `${(value / 1_000_000_000_000).toFixed(1)}T`;
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    return value.toLocaleString();
  };

  const formatVolume = (value: number) => {
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
    return value.toLocaleString();
  };

  const handleOpenChart = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info("Open Chart", { description: `Opening detailed chart for ${symbol}... (Feature coming soon)` });
    // In a full implementation, this would open a TradingView-style chart panel
  };

  const handleSetAlert = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info("Set Alert", { description: `Setting alert for ${symbol}... (Feature coming soon)` });
    // In a full implementation, this would open an alert modal pre-filled with symbol
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "relative flex flex-col items-center justify-center p-2 rounded-md text-soft-white cursor-pointer overflow-hidden transition-all duration-300 ease-out border border-transparent hover:border-electric-blue",
              bgColor,
              isTopMover && "animate-tile-pulse"
            )}
            onClick={() => onClick(symbol)}
            style={{ minWidth: '60px', minHeight: '60px', ...style }} // Apply style prop here
          >
            <span className="text-sm font-bold leading-none">{symbol}</span>
            <span className="text-xs leading-none mt-1">
              {change >= 0 ? (
                <TrendingUp className="inline-block h-3 w-3 mr-1 text-white" />
              ) : (
                <TrendingDown className="inline-block h-3 w-3 mr-1 text-white" />
              )}
              {change.toFixed(2)}%
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-gray-800 border border-gray-700 text-soft-white p-3 rounded-md shadow-lg max-w-xs">
          <p className="text-sm font-bold">{symbol} — {companyName}</p>
          <p className="text-xs text-body-label mt-1">Price: ${price.toFixed(2)}</p>
          <p className="text-xs text-body-label">Change: {change >= 0 ? '+' : ''}{change.toFixed(2)}%</p>
          <p className="text-xs text-body-label">Volume: {formatVolume(volume)}</p>
          <p className="text-xs text-body-label">Market Cap: {formatMarketCap(marketCap)}</p>
          <p className="text-xs text-body-label">Sector: {sector}</p>
          <p className="text-xs text-body-label">AI Score: {aiScore}%</p>
          {/* Sparkline placeholder */}
          <div className="w-full h-10 bg-gray-700 rounded-sm mt-2 flex items-center justify-center text-xs text-gray-400">
            Mini-chart (Coming Soon)
          </div>
          <div className="flex space-x-2 mt-3">
            <Button variant="outline" size="sm" onClick={handleOpenChart} className="flex-grow text-xs h-7 bg-gray-700 hover:bg-gray-600 border-gray-600 text-soft-white">
              Open Chart
            </Button>
            <Button variant="outline" size="sm" onClick={handleSetAlert} className="flex-grow text-xs h-7 bg-gray-700 hover:bg-gray-600 border-gray-600 text-soft-white">
              <Bell className="h-3 w-3 mr-1" /> Set Alert
            </Button>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default HeatmapTile;