"use client";

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Bell, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useStockData } from '@/hooks/use-stock-data';
import WatchlistItem from './components/WatchlistItem';
import { toast } from 'sonner';

interface WatchlistPanelProps {
  isCollapsed: boolean;
  onSelectStock: (symbol: string) => void;
  selectedStock: string | null;
}

const mockWatchlist = ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMZN', 'NVDA', 'NFLX', 'SBUX'];

const WatchlistPanel: React.FC<WatchlistPanelProps> = ({ isCollapsed, onSelectStock, selectedStock }) => {
  const { stocksList, stockData } = useStockData();
  const [sectorFilter, setSectorFilter] = useState<string>('All');

  const allSectors = useMemo(() => {
    const sectors = new Set<string>();
    Object.values(stockData).forEach(data => sectors.add(data.sector));
    return ['All', ...Array.from(sectors).sort()];
  }, [stockData]);

  const filteredWatchlist = useMemo(() => {
    const watchlistData = mockWatchlist
      .map(symbol => stockData[symbol])
      .filter(Boolean); // Filter out any stocks not yet loaded

    if (sectorFilter === 'All') {
      return watchlistData;
    }
    return watchlistData.filter(stock => stock.sector === sectorFilter);
  }, [stockData, sectorFilter]);

  const handleAddSymbol = () => {
    toast.info("Add Symbol", { description: "Functionality to add new symbols to watchlist coming soon!" });
  };

  const handleManageAlerts = () => {
    toast.info("Manage Alerts", { description: "Alert management interface coming soon!" });
  };

  return (
    <div className={cn(
      "flex flex-col bg-charts-panel-bg backdrop-blur-lg border-r border-charts-border transition-all duration-300 ease-in-out",
      isCollapsed ? "w-0 p-0 overflow-hidden" : "w-64 p-4"
    )}>
      {!isCollapsed && (
        <>
          <h3 className="text-lg font-semibold text-charts-text-primary mb-4">Watchlist</h3>

          <div className="mb-4">
            <Select value={sectorFilter} onValueChange={setSectorFilter}>
              <SelectTrigger className="w-full bg-charts-bg border-charts-border text-charts-text-primary">
                <Filter className="h-4 w-4 mr-2 text-charts-text-secondary" />
                <SelectValue placeholder="Filter by sector" />
              </SelectTrigger>
              <SelectContent className="bg-charts-panel-bg border-charts-border text-charts-text-primary z-[9999]">
                {allSectors.map(sector => (
                  <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-grow overflow-y-auto custom-scrollbar space-y-2 mb-4">
            {filteredWatchlist.length === 0 ? (
              <p className="text-charts-text-secondary text-sm text-center py-4">No stocks in watchlist for this filter.</p>
            ) : (
              filteredWatchlist.map(stock => (
                <WatchlistItem
                  key={stock.symbol}
                  symbol={stock.symbol}
                  isSelected={selectedStock === stock.symbol}
                  onClick={onSelectStock}
                />
              ))
            )}
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleAddSymbol}
              className="w-full bg-charts-accent hover:bg-charts-accent/90 text-white flex items-center justify-center"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Symbol
            </Button>
            <Button
              onClick={handleManageAlerts}
              variant="outline"
              className="w-full border-charts-border text-charts-text-primary hover:bg-charts-panel-bg hover:text-charts-accent flex items-center justify-center"
            >
              <Bell className="h-4 w-4 mr-2" /> Manage Alerts
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default WatchlistPanel;