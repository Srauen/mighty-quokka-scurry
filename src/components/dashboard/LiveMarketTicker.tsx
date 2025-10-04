"use client";

import React, { useEffect, useState } from 'react';
import { useStockData } from '@/hooks/use-stock-data';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const LiveMarketTicker: React.FC = () => {
  const { stockData, stocksList } = useStockData();
  const [tickerItems, setTickerItems] = useState<Array<{ symbol: string; price: number; change: number }>>([]);

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
      }).filter(item => item.price > 0); // Only show stocks with a valid price
      setTickerItems(newItems);
    };

    // Update immediately and then every 3 seconds (matching stock data update)
    updateTicker();
    const interval = setInterval(updateTicker, 3000);

    return () => clearInterval(interval);
  }, [stockData, stocksList]);

  if (tickerItems.length === 0) {
    return (
      <div className="w-full bg-gray-900 text-gray-400 py-2 px-4 text-sm flex items-center justify-center border-b border-gray-700">
        Loading market data...
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden bg-gray-900 border-b border-gray-700 py-2">
      <div className="flex animate-marquee whitespace-nowrap">
        {/* Duplicate items to create a seamless loop */}
        {[...tickerItems, ...tickerItems].map((item, index) => (
          <div key={index} className="inline-flex items-center mx-4 text-sm font-medium">
            <span className="text-gray-300 mr-2">{item.symbol}:</span>
            <span className={cn(
              "flex items-center",
              item.change >= 0 ? "text-green-500" : "text-red-500"
            )}>
              ${item.price.toFixed(2)}
              {item.change >= 0 ? (
                <TrendingUp className="h-4 w-4 ml-1" />
              ) : (
                <TrendingDown className="h-4 w-4 ml-1" />
              )}
              ({item.change.toFixed(2)}%)
            </span>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LiveMarketTicker;