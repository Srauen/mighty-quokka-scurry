"use client";

import React, { useState, useCallback, useEffect } from 'react';
import ChartsNavbar from './ChartsNavbar';
import WatchlistPanel from './WatchlistPanel';
import MainChartPanel from './MainChartPanel';
import AIInsightsAndNewsPanel from './AIInsightsAndNewsPanel';
import ChartsBottomBar from './ChartsBottomBar';
import { useStockData } from '@/hooks/use-stock-data';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ChartsAppProps {
  initialStockSymbol?: string;
  userName: string;
  userAvatarUrl?: string;
}

const ChartsApp: React.FC<ChartsAppProps> = ({ initialStockSymbol, userName, userAvatarUrl }) => {
  const { stocksList } = useStockData();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedStock, setSelectedStock] = useState<string>(initialStockSymbol || stocksList[0] || 'AAPL');

  useEffect(() => {
    if (initialStockSymbol && initialStockSymbol !== selectedStock) {
      setSelectedStock(initialStockSymbol);
    }
    if (stocksList.length > 0 && !stocksList.includes(selectedStock)) {
      setSelectedStock(stocksList[0]);
    }
  }, [initialStockSymbol, stocksList, selectedStock]);

  const handleSearch = useCallback((symbol: string) => {
    if (stocksList.includes(symbol)) {
      setSelectedStock(symbol);
      toast.success("Stock Found", { description: `Displaying chart for ${symbol}.` });
    } else {
      toast.error("Stock Not Found", { description: `Could not find data for ${symbol}.` });
    }
  }, [stocksList]);

  return (
    <div className="flex flex-col h-full w-full bg-charts-bg text-charts-text-primary font-sans rounded-mac-window overflow-hidden">
      <ChartsNavbar
        onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isSidebarCollapsed={isSidebarCollapsed}
        onSearch={handleSearch}
        userName={userName}
        userAvatarUrl={userAvatarUrl}
      />
      <div className="flex flex-grow overflow-hidden">
        <WatchlistPanel
          isCollapsed={isSidebarCollapsed}
          onSelectStock={setSelectedStock}
          selectedStock={selectedStock}
        />
        <div className="flex flex-grow overflow-hidden p-2 gap-2">
          <MainChartPanel selectedStock={selectedStock} />
          <AIInsightsAndNewsPanel />
        </div>
      </div>
      <ChartsBottomBar />
    </div>
  );
};

export default ChartsApp;