"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { StockDataItem } from '@/hooks/use-stock-data'; // Corrected import
import { Search } from 'lucide-react'; // Import Search icon

interface TradingTerminalAppProps {
  stocksList: string[];
  stockData: { [key: string]: StockDataItem }; // Corrected type
  cashBalance: number;
  portfolio: { [key: string]: number };
  setCashBalance: React.Dispatch<React.SetStateAction<number>>;
  setPortfolio: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
  tradingLog: string[];
  setTradingLog: React.Dispatch<React.SetStateAction<string[]>>;
  initialSearchSymbol?: string; // New prop for pre-filling search
}

const TradingTerminalApp: React.FC<TradingTerminalAppProps> = ({
  stocksList,
  stockData,
  cashBalance,
  portfolio,
  setCashBalance,
  setPortfolio,
  tradingLog,
  setTradingLog,
  initialSearchSymbol,
}) => {
  const [selectedStock, setSelectedStock] = useState<string>(initialSearchSymbol || stocksList[0] || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchSymbol || ''); // State for the search input

  useEffect(() => {
    if (stocksList.length > 0 && !selectedStock) {
      setSelectedStock(stocksList[0]);
    }
  }, [stocksList, selectedStock]);

  // Update selected stock when initialSearchSymbol changes
  useEffect(() => {
    if (initialSearchSymbol && stocksList.includes(initialSearchSymbol.toUpperCase())) {
      setSelectedStock(initialSearchSymbol.toUpperCase());
      setSearchTerm(initialSearchSymbol.toUpperCase());
    }
  }, [initialSearchSymbol, stocksList]);

  const currentPrice = stockData[selectedStock]?.lastPrice || 0;

  const addTradeLog = useCallback((message: string, isError: boolean = false) => {
    const time = new Date().toLocaleTimeString();
    setTradingLog(prevLog => {
      const newLog = [`[${time}] ${message}`, ...prevLog];
      return newLog.slice(0, 20); // Keep last 20 entries
    });
    if (isError) {
      toast.error("Trade Failed", { description: message });
    } else {
      toast.success("Trade Successful", { description: message });
    }
  }, [setTradingLog]);

  const executeTrade = useCallback((type: 'buy' | 'sell') => {
    if (!selectedStock) {
      addTradeLog("Please select a stock.", true);
      return;
    }
    if (isNaN(quantity) || quantity <= 0) {
      addTradeLog("Please enter a valid positive quantity.", true);
      return;
    }
    if (currentPrice <= 0) {
      addTradeLog(`Cannot trade ${selectedStock}: current price is not available or zero.`, true);
      return;
    }

    const totalValue = quantity * currentPrice;

    if (type === 'buy') {
      if (cashBalance >= totalValue) {
        setCashBalance(prev => prev - totalValue);
        setPortfolio(prev => ({
          ...prev,
          [selectedStock]: (prev[selectedStock] || 0) + quantity,
        }));
        addTradeLog(`Bought ${quantity} shares of ${selectedStock} at $${currentPrice.toFixed(2)}. Total cost: $${totalValue.toFixed(2)}.`);
      } else {
        const needed = (totalValue - cashBalance).toFixed(2);
        addTradeLog(`Insufficient cash to buy ${quantity} shares of ${selectedStock}. You need an additional $${needed}.`, true);
      }
    } else if (type === 'sell') {
      const ownedQuantity = portfolio[selectedStock] || 0;
      if (ownedQuantity >= quantity) {
        setCashBalance(prev => prev + totalValue);
        const newOwnedQuantity = ownedQuantity - quantity;
        setPortfolio(prev => {
          const newPortfolio = { ...prev };
          if (newOwnedQuantity <= 0) {
            delete newPortfolio[selectedStock];
          } else {
            newPortfolio[selectedStock] = newOwnedQuantity;
          }
          return newPortfolio;
        });
        addTradeLog(`Sold ${quantity} shares of ${selectedStock} at $${currentPrice.toFixed(2)}. Total revenue: $${totalValue.toFixed(2)}.`);
      } else {
        addTradeLog(`You do not have enough shares of ${selectedStock} to sell. You own ${ownedQuantity}, trying to sell ${quantity}.`, true);
      }
    }
  }, [selectedStock, quantity, currentPrice, cashBalance, portfolio, setCashBalance, setPortfolio, addTradeLog]);

  const handleSearchStock = () => {
    const symbol = searchTerm.toUpperCase().trim();
    if (symbol && stocksList.includes(symbol)) {
      setSelectedStock(symbol);
      toast.info("Stock Selected", { description: `Trading for ${symbol}.` });
    } else if (symbol) {
      toast.error("Invalid Symbol", { description: `"${symbol}" is not a recognized stock symbol.` });
    }
  };

  return (
    <div className="flex flex-col h-full p-4 bg-[#1a2033] text-soft-white">
      <div className="mb-4">
        <label htmlFor="stock-search-input" className="block text-sm font-medium mb-1 text-body-label">Search Stock</label>
        <div className="flex space-x-2">
          <Input
            id="stock-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchStock()}
            placeholder="Enter stock symbol (e.g., AAPL)"
            className="flex-grow bg-gray-800 border-gray-700 text-soft-white placeholder-gray-500"
          />
          <Button onClick={handleSearchStock} className="bg-electric-blue hover:bg-electric-blue/90 text-white">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-grow">
          <label htmlFor="terminal-stock-select" className="block text-sm font-medium mb-1 text-body-label">Selected Stock</label>
          <Select value={selectedStock} onValueChange={setSelectedStock}>
            <SelectTrigger id="terminal-stock-select" className="w-full bg-gray-800 border-gray-700 text-soft-white">
              <SelectValue placeholder="Select a stock" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-soft-white">
              {stocksList.map((stock) => (
                <SelectItem key={stock} value={stock}>{stock}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-grow">
          <label htmlFor="terminal-quantity" className="block text-sm font-medium mb-1 text-body-label">Quantity</label>
          <Input
            id="terminal-quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
            min="1"
            className="w-full bg-gray-800 border-gray-700 text-soft-white"
          />
        </div>
      </div>
      <div className="flex gap-4 mb-4">
        <Button onClick={() => executeTrade('buy')} className="flex-grow py-3 bg-green-600 hover:bg-green-700 font-bold text-white">Buy</Button>
        <Button onClick={() => executeTrade('sell')} className="flex-grow py-3 bg-red-600 hover:bg-red-700 font-bold text-white">Sell</Button>
      </div>
      <div className="flex-grow p-4 bg-gray-800 rounded-lg overflow-y-auto custom-scrollbar">
        <h3 className="text-lg font-semibold mb-2 text-electric-blue">Trading Log</h3>
        <div className="space-y-2">
          {tradingLog.length === 0 ? (
            <p className="text-gray-400 text-sm">No trades yet...</p>
          ) : (
            tradingLog.map((log, index) => (
              <p key={index} className={`text-sm ${log.includes('FAILED') ? 'text-red-400' : 'text-gray-400'}`}>
                {log}
              </p>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TradingTerminalApp;