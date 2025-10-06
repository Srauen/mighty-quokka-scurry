"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStockData } from '@/hooks/use-stock-data';
import { cn } from '@/lib/utils';

interface Trade {
  id: string;
  type: 'BUY' | 'SELL'; // Explicitly define type as 'BUY' or 'SELL'
  symbol: string;
  quantity: number;
  price: number;
  timestamp: string;
}

const RecentTradesFeed: React.FC = () => {
  const { stockData, stocksList } = useStockData();
  const [trades, setTrades] = useState<Trade[]>([]);
  const tradeIdCounter = React.useRef(0);

  useEffect(() => {
    const generateRandomTrade = () => {
      const type: 'BUY' | 'SELL' = Math.random() > 0.5 ? 'BUY' : 'SELL'; // Explicitly cast type
      const symbol = stocksList[Math.floor(Math.random() * stocksList.length)];
      const quantity = Math.floor(Math.random() * 10) + 1; // 1-10 shares
      const price = stockData[symbol]?.lastPrice || 0;

      if (price === 0) return null; // Skip if stock data not loaded

      tradeIdCounter.current += 1;
      return {
        id: `trade-${tradeIdCounter.current}`,
        type,
        symbol,
        quantity,
        price: parseFloat(price.toFixed(2)),
        timestamp: new Date().toLocaleTimeString(),
      };
    };

    const tradeInterval = setInterval(() => {
      const newTrade = generateRandomTrade();
      if (newTrade) {
        setTrades(prevTrades => {
          const updatedTrades = [newTrade, ...prevTrades];
          return updatedTrades.slice(0, 10); // Keep last 10 trades
        });
      }
    }, 4000); // Generate a new trade every 4 seconds

    return () => clearInterval(tradeInterval);
  }, [stockData, stocksList]);

  return (
    <Card className="bg-gray-800 border border-gray-700 text-white shadow-lg">
      <CardHeader className="p-4 border-b border-gray-700">
        <CardTitle className="text-lg font-semibold text-green-400">Recent Trades</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3 max-h-40 overflow-y-auto custom-scrollbar">
          {trades.length === 0 ? (
            <p className="text-gray-400 text-sm">No recent trades.</p>
          ) : (
            trades.map((trade) => (
              <div key={trade.id} className="flex items-center justify-between text-sm">
                <span className={cn(
                  "font-medium",
                  trade.type === 'BUY' ? "text-green-500" : "text-red-500"
                )}>
                  {trade.type} {trade.quantity} {trade.symbol} @ ${trade.price.toFixed(2)}
                </span>
                <span className="text-gray-500 text-xs">{trade.timestamp}</span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTradesFeed;