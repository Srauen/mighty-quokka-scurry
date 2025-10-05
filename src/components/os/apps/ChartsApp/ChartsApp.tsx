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
import { Button } from '@/components/ui/button'; // Import Button
import { RotateCcw } from 'lucide-react'; // Import RotateCcw icon

interface ChartsAppProps {
  initialStockSymbol?: string;
  userName: string;
  userAvatarUrl?: string;
  isTradingViewMode: boolean; // New prop
  setIsTradingViewMode: React.Dispatch<React.SetStateAction<boolean>>; // New prop
}

const ChartsApp: React.FC<ChartsAppProps> = ({ initialStockSymbol, userName, userAvatarUrl, isTradingViewMode, setIsTradingViewMode }) => {
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

  const handleResetCharts = useCallback(() => {
    setIsTradingViewMode(false);
    toast.info("Charts Reset", { description: "Switched back to default charts.", duration: 3000 });
  }, [setIsTradingViewMode]);

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
            <MainChartPanel selectedStock={selectedStock} isTradingViewMode={isTradingViewMode} />
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
      {isTradingViewMode && (
        <div className="absolute bottom-16 right-4 z-20">
          <Button
            onClick={handleResetCharts}
            className="bg-gray-700 hover:bg-gray-600 text-white flex items-center space-x-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset Charts</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChartsApp;