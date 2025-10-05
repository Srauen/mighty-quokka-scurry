"use client";

import React, { useEffect, useState } from 'react';
import { useStockData } from '@/hooks/use-stock-data';
import { TrendingUp, TrendingDown, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

const ChartsBottomBar: React.FC = () => {
  const { stockData, stocksList } = useStockData();
  const [tickerItems, setTickerItems] = useState<Array<{ symbol: string; price: number; change: number }>>([]);
  const [aiPulse, setAiPulse] = useState(false);

  useEffect(() => {
    const updateTicker = () => {
      const newItems = stocksList.map(symbol => {
        const data = stockData[symbol];
        if (data) {
          const price = data.lastPrice;
          const change = data.dailyChange;
          return { symbol, price, change };
        }
        return { symbol, price: 0, change: 0 };
      }).filter(item => item.price > 0);
      setTickerItems(newItems);
    };

    updateTicker();
    const interval = setInterval(updateTicker, 3000);

    return () => clearInterval(interval);
  }, [stockData, stocksList]);

  useEffect(() => {
    // Simulate AI pulse for new insights
    const pulseInterval = setInterval(() => {
      setAiPulse(true);
      setTimeout(() => setAiPulse(false), 1000); // Pulse for 1 second
    }, 10000); // Every 10 seconds

    return () => clearInterval(pulseInterval);
  }, []);

  if (tickerItems.length === 0) {
    return (
      <div className="w-full bg-charts-toolbar-bg backdrop-blur-lg border-t border-charts-border text-charts-text-secondary py-2 px-4 text-sm flex items-center justify-center">
        Loading market data...
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden bg-charts-toolbar-bg backdrop-blur-lg border-t border-charts-border py-2 flex items-center justify-between pr-4">
      <div className="flex animate-marquee-horizontal whitespace-nowrap flex-grow">
        {[...tickerItems, ...tickerItems].map((item, index) => (
          <div key={index} className="inline-flex items-center mx-4 text-sm font-medium flex-shrink-0">
            <span className="text-charts-text-secondary mr-2">{item.symbol}:</span>
            <span className={cn(
              "flex items-center",
              item.change >= 0 ? "text-teal" : "text-red-500"
            )}>
              ${item.price.toFixed(2)}
              <span className="inline-flex items-center w-[80px] justify-end font-mono text-xs">
                {item.change >= 0 ? (
                  <TrendingUp className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <TrendingDown className="h-4 w-4 flex-shrink-0" />
                )}
                <span className="ml-1">
                  {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
                </span>
              </span>
            </span>
          </div>
        ))}
      </div>
      <div className="flex-shrink-0 ml-4">
        <div className={cn(
          "relative w-5 h-5 rounded-full bg-charts-accent flex items-center justify-center",
          aiPulse && "animate-pulse-orb"
        )}>
          <Brain className="h-3 w-3 text-white" />
        </div>
      </div>
    </div>
  );
};

export default ChartsBottomBar;