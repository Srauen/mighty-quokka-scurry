"use client";

import React, { useState, useCallback, useEffect } from 'react';
import ChartsNavbar from './ChartsNavbar';
// import WatchlistPanel from './WatchlistPanel'; // Removed
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // Sidebar starts collapsed
  const [isInsightsPanelCollapsed, setIsInsightsPanelCollapsed] = useState(false); // New state for insights panel
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

  const toggleInsightsPanel = useCallback(() => {
    setIsInsightsPanelCollapsed(prev => !prev);
  }, []);

  return (
    <div className="flex flex-col h-full w-full bg-charts-bg text-charts-text-primary font-sans rounded-mac-window overflow-hidden">
      <ChartsNavbar
        onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isSidebarCollapsed={isSidebarCollapsed}
        onSearch={handleSearch}
        userName={userName}
        userAvatarUrl={userAvatarUrl}
        onToggleInsights={toggleInsightsPanel} // Pass toggle function
        isInsightsPanelCollapsed={isInsightsPanelCollapsed} // Pass state
      />
      <div className="flex flex-grow overflow-hidden">
        <div className={cn(
          "flex flex-grow overflow-hidden", // Removed p-2 gap-2
          isInsightsPanelCollapsed ? "grid grid-cols-1" : "grid grid-cols-3" // Adjust grid columns
        )}>
          <div className={cn(
            isInsightsPanelCollapsed ? "col-span-1" : "col-span-2" // Main chart takes 2/3 or full width
          )}>
            <MainChartPanel selectedStock={selectedStock} />
          </div>
          <div className={cn(
            "col-span-1",
            isInsightsPanelCollapsed && "hidden" // Hide insights panel when collapsed
          )}>
            <AIInsightsAndNewsPanel />
          </div>
        </div>
      </div>
      <ChartsBottomBar />
    </div>
  );
};

export default ChartsApp;