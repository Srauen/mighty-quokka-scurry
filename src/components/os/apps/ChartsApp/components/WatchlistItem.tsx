"use client";

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStockData } from '@/hooks/use-stock-data';

interface WatchlistItemProps {
  symbol: string;
  isSelected: boolean;
  onClick: (symbol: string) => void;
}

const WatchlistItem: React.FC<WatchlistItemProps> = ({ symbol, isSelected, onClick }) => {
  const { stockData } = useStockData();
  const stockInfo = stockData[symbol];

  if (!stockInfo) {
    return (
      <div className="flex items-center justify-between p-2 text-charts-text-secondary">
        <span>{symbol}</span>
        <span>Loading...</span>
      </div>
    );
  }

  const currentPrice = stockInfo.lastPrice;
  const dailyChange = stockInfo.dailyChange;
  const isPositiveChange = dailyChange >= 0;

  return (
    <div
      className={cn(
        "flex items-center justify-between p-2 rounded-md cursor-pointer transition-all duration-200",
        "hover:bg-charts-panel-bg",
        isSelected ? "bg-charts-panel-bg ring-1 ring-charts-accent" : ""
      )}
      onClick={() => onClick(symbol)}
    >
      <div className="flex flex-col">
        <span className="text-charts-text-primary font-semibold">{symbol}</span>
        <span className="text-charts-text-secondary text-xs">{stockInfo.companyName}</span>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-charts-text-primary font-medium">${currentPrice.toFixed(2)}</span>
        <span className={cn(
          "flex items-center text-xs",
          isPositiveChange ? "text-teal" : "text-red-500"
        )}>
          {isPositiveChange ? <TrendingUp className="h-3 w-3 mr-0.5" /> : <TrendingDown className="h-3 w-3 mr-0.5" />}
          {dailyChange.toFixed(2)}%
        </span>
      </div>
      {/* Placeholder for mini sparkline */}
      {/* <div className="w-16 h-8 bg-gray-700 rounded-sm flex items-center justify-center text-xs text-gray-500">
        Sparkline
      </div> */}
    </div>
  );
};

export default WatchlistItem;