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
      <div className="flex flex-grow overflow-hidden"> {/* This is the main content area, takes remaining height */}
        <div className={cn(
          "grid h-full w-full", // Make this the grid container, ensure it takes full height/width of its flex-grow parent
          isInsightsPanelCollapsed ? "grid-cols-1" : "grid-cols-3"
        )}>
          <div className={cn(
            "h-full w-full", // Ensure this grid item takes full height/width of its cell
            isInsightsPanelCollapsed ? "col-span-1" : "col-span-2"
          )}>
            <MainChartPanel selectedStock={selectedStock} />
          </div>
          <div className={cn(
            "h-full w-full", // Ensure this grid item takes full height/width of its cell
            isInsightsPanelCollapsed && "hidden"
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