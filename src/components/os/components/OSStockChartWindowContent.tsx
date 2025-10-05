"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ChartTile from './ChartTile'; // Now imported from OS components
import FullChartModal from './FullChartModal'; // Now imported from OS components
import { useStockData } from '@/hooks/use-stock-data';

interface OSStockChartWindowContentProps {
  stocksList: string[];
  openFullChart: (symbol: string) => void;
  fullSymbol: string | null;
  closeFullChart: () => void;
}

const OSStockChartWindowContent: React.FC<OSStockChartWindowContentProps> = ({
  stocksList,
  openFullChart,
  fullSymbol,
  closeFullChart,
}) => {
  const [selectedStock, setSelectedStock] = useState<string>(stocksList[0] || 'AAPL');

  useEffect(() => {
    if (stocksList.length > 0 && !stocksList.includes(selectedStock)) {
      setSelectedStock(stocksList[0]);
    }
  }, [stocksList, selectedStock]);

  // Helper to prefix symbol for TradingView
  const getTradingViewSymbol = useCallback((stock: string) => {
    // Simple heuristic: assume NASDAQ for most tech, NYSE for others
    if (['AAPL', 'TSLA', 'MSFT', 'AMZN', 'NVDA', 'GOOGL', 'INTC', 'SQ'].includes(stock)) {
      return `NASDAQ:${stock}`;
    }
    return `NYSE:${stock}`;
  }, []);

  return (
    <div className="flex flex-col h-full p-4 bg-[#1a2033] text-soft-white">
      <div className="mb-4">
        <label htmlFor="stock-select-os" className="block text-sm font-medium mb-1 text-body-label">Select Stock</label>
        <Select value={selectedStock} onValueChange={setSelectedStock}>
          <SelectTrigger id="stock-select-os" className="w-full bg-gray-800 border-gray-700 text-soft-white">
            <SelectValue placeholder="Select a stock" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700 text-soft-white">
            {stocksList.map((stock) => (
              <SelectItem key={stock} value={stock}>{stock}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-grow min-h-0"> {/* min-h-0 to allow flex-grow to shrink */}
        <ChartTile
          symbol={getTradingViewSymbol(selectedStock)}
          index={0} // Only one chart tile in this window
          openFull={openFullChart}
        />
      </div>

      {fullSymbol && (
        <FullChartModal symbol={fullSymbol} onClose={closeFullChart} />
      )}
    </div>
  );
};

export default OSStockChartWindowContent;