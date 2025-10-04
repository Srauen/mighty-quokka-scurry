"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useStockData } from '@/hooks/use-stock-data';
import { supabase } from '@/integrations/supabase/client';

interface DashboardTradingTerminalProps {
  cashBalance: number;
  portfolio: { [key: string]: number };
  setCashBalance: React.Dispatch<React.SetStateAction<number>>;
  setPortfolio: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
}

const DashboardTradingTerminal: React.FC<DashboardTradingTerminalProps> = ({
  cashBalance,
  portfolio,
  setCashBalance,
  setPortfolio,
}) => {
  const { stocksList, stockData } = useStockData();
  const [selectedStock, setSelectedStock] = useState<string>(stocksList[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [tradingLog, setTradingLog] = useState<string[]>([]);
  const tradingLogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tradingLogRef.current) {
      tradingLogRef.current.scrollTop = tradingLogRef.current.scrollHeight;
    }
  }, [tradingLog]);

  const executeTrade = async (type: 'buy' | 'sell') => {
    const price = stockData[selectedStock]?.lastPrice;
    const user = (await supabase.auth.getUser()).data.user;

    if (!user) {
      toast.error("Authentication Error", { description: "You must be logged in to trade." });
      return;
    }

    if (!selectedStock || quantity <= 0 || !price) {
      toast.error("Invalid Trade", { description: "Please select a stock and enter a valid quantity." });
      return;
    }

    const logTrade = (message: string, success: boolean = true) => {
      const time = new Date().toLocaleTimeString();
      setTradingLog(prevLog => [`[${time}] ${message}`, ...prevLog].slice(0, 10));
      if (success) {
        toast.success("Trade Executed", { description: message });
      } else {
        toast.error("Trade Failed", { description: message });
      }
    };

    let newCashBalance = cashBalance;
    let newPortfolio = { ...portfolio };
    let tradeMessage = "";
    let tradeSuccess = true;

    if (type === 'buy') {
      const totalCost = quantity * price;
      if (cashBalance >= totalCost) {
        newPortfolio[selectedStock] = (newPortfolio[selectedStock] || 0) + quantity;
        newCashBalance -= totalCost;
        tradeMessage = `BUY ${quantity} shares of ${selectedStock} at $${price.toFixed(2)}. Total: $${totalCost.toFixed(2)}`;
      } else {
        tradeMessage = `FAILED BUY: Insufficient cash to buy ${quantity} shares of ${selectedStock}. Needed: $${totalCost.toFixed(2)}, Have: $${cashBalance.toFixed(2)}.`;
        tradeSuccess = false;
      }
    } else if (type === 'sell') {
      if (!portfolio[selectedStock] || portfolio[selectedStock] < quantity) {
        tradeMessage = `FAILED SELL: You do not have enough shares of ${selectedStock} to sell. Have: ${portfolio[selectedStock] || 0}, Trying to sell: ${quantity}.`;
        tradeSuccess = false;
      } else {
        newPortfolio[selectedStock] -= quantity;
        if (newPortfolio[selectedStock] === 0) {
          delete newPortfolio[selectedStock];
        }
        const totalRevenue = quantity * price;
        newCashBalance += totalRevenue;
        tradeMessage = `SELL ${quantity} shares of ${selectedStock} at $${price.toFixed(2)}. Total: $${totalRevenue.toFixed(2)}`;
      }
    }

    logTrade(tradeMessage, tradeSuccess);

    if (tradeSuccess) {
      setCashBalance(newCashBalance);
      setPortfolio(newPortfolio);

      // The useEffect in Dashboard.tsx will handle saving to Supabase
      // when setCashBalance and setPortfolio are called.
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-grow">
          <label htmlFor="terminal-stock-select" className="block text-sm font-medium mb-1 text-gray-300">Stock</label>
          <Select value={selectedStock} onValueChange={setSelectedStock}>
            <SelectTrigger className="w-full p-2 bg-[#2d3748] rounded-md border border-[#4a5568] text-white">
              <SelectValue placeholder="Select a stock" />
            </SelectTrigger>
            <SelectContent className="bg-[#2d3748] border-[#4a5568] text-white z-[9999] max-h-[200px]">
                {stocksList.map((stock) => (
                <SelectItem key={stock} value={stock}>
                    {stock}
                </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-grow">
          <label htmlFor="terminal-quantity" className="block text-sm font-medium mb-1 text-gray-300">Quantity</label>
          <Input
            id="terminal-quantity"
            type="number"
            value={quantity}
            min="1"
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="w-full p-2 bg-[#2d3748] rounded-md border border-[#4a5568] text-white"
          />
        </div>
      </div>
      <div className="flex gap-4 mb-4">
        <Button onClick={() => executeTrade('buy')} className="flex-grow py-3 bg-green-600 hover:bg-green-700 font-bold text-white">Buy</Button>
        <Button onClick={() => executeTrade('sell')} className="flex-grow py-3 bg-red-600 hover:bg-red-700 font-bold text-white">Sell</Button>
      </div>
      <div id="trading-log" ref={tradingLogRef} className="flex-grow p-4 bg-[#2d3748] rounded-lg overflow-y-auto text-gray-400 text-sm custom-scrollbar">
        {tradingLog.length === 0 ? (
          <p>Trading Log...</p>
        ) : (
          tradingLog.map((log, index) => (
            <p key={index} className="mt-1">{log}</p>
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardTradingTerminal;