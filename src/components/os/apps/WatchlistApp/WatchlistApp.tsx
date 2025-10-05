"use client";

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Bell, Filter, Star, TrendingUp, TrendingDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useStockData } from '@/hooks/use-stock-data';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

interface WatchlistAppProps {
  initialWatchlist?: string[];
  onUpdateWatchlist: (newWatchlist: string[]) => void;
}

const WatchlistApp: React.FC<WatchlistAppProps> = ({ initialWatchlist = [], onUpdateWatchlist }) => {
  const { stocksList, stockData } = useStockData();
  const [watchlist, setWatchlist] = useState<string[]>(initialWatchlist);
  const [sectorFilter, setSectorFilter] = useState<string>('All');
  const [newSymbol, setNewSymbol] = useState<string>('');

  useEffect(() => {
    // Sync initial watchlist from props
    setWatchlist(initialWatchlist);
  }, [initialWatchlist]);

  const allSectors = useMemo(() => {
    const sectors = new Set<string>();
    Object.values(stockData).forEach(data => sectors.add(data.sector));
    return ['All', ...Array.from(sectors).sort()];
  }, [stockData]);

  const filteredWatchlistData = useMemo(() => {
    const watchlistData = watchlist
      .map(symbol => stockData[symbol])
      .filter(Boolean); // Filter out any stocks not yet loaded

    if (sectorFilter === 'All') {
      return watchlistData;
    }
    return watchlistData.filter(stock => stock.sector === sectorFilter);
  }, [watchlist, stockData, sectorFilter]);

  const handleAddSymbol = () => {
    const symbolToAdd = newSymbol.toUpperCase().trim();
    if (!symbolToAdd) {
      toast.error("Input Required", { description: "Please enter a stock symbol." });
      return;
    }
    if (!stocksList.includes(symbolToAdd)) {
      toast.error("Invalid Symbol", { description: `"${symbolToAdd}" is not a recognized stock symbol.` });
      return;
    }
    if (watchlist.includes(symbolToAdd)) {
      toast.info("Already in Watchlist", { description: `"${symbolToAdd}" is already in your watchlist.` });
      return;
    }

    const updatedWatchlist = [...watchlist, symbolToAdd];
    setWatchlist(updatedWatchlist);
    onUpdateWatchlist(updatedWatchlist);
    setNewSymbol('');
    toast.success("Stock Added", { description: `${symbolToAdd} added to your watchlist.` });
  };

  const handleRemoveSymbol = (symbolToRemove: string) => {
    const updatedWatchlist = watchlist.filter(symbol => symbol !== symbolToRemove);
    setWatchlist(updatedWatchlist);
    onUpdateWatchlist(updatedWatchlist);
    toast.info("Stock Removed", { description: `${symbolToRemove} removed from your watchlist.` });
  };

  const handleManageAlerts = () => {
    toast.info("Manage Alerts", { description: "Alert management interface coming soon!" });
  };

  return (
    <div className="flex flex-col h-full w-full bg-charts-bg text-charts-text-primary font-sans p-4">
      <h3 className="text-xl font-bold text-charts-accent mb-4 flex items-center space-x-2">
        <Star className="h-6 w-6" /> <span>My Watchlist</span>
      </h3>

      <div className="mb-4 flex space-x-2">
        <Input
          type="text"
          placeholder="Add new symbol (e.g., AAPL)"
          value={newSymbol}
          onChange={(e) => setNewSymbol(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddSymbol()}
          className="flex-grow bg-charts-panel-bg border-charts-border text-charts-text-primary placeholder-charts-text-secondary"
        />
        <Button
          onClick={handleAddSymbol}
          className="bg-charts-accent hover:bg-charts-accent/90 text-white"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="mb-4">
        <Select value={sectorFilter} onValueChange={setSectorFilter}>
          <SelectTrigger className="w-full bg-charts-panel-bg border-charts-border text-charts-text-primary">
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
        {filteredWatchlistData.length === 0 ? (
          <p className="text-charts-text-secondary text-sm text-center py-4">No stocks in watchlist for this filter.</p>
        ) : (
          filteredWatchlistData.map(stock => {
            const currentPrice = stock.lastPrice;
            const dailyChange = stock.dailyChange;
            const isPositiveChange = dailyChange >= 0;

            return (
              <div
                key={stock.symbol}
                className="flex items-center justify-between p-3 rounded-md transition-all duration-200 bg-charts-panel-bg hover:bg-charts-toolbar-bg border border-charts-border"
              >
                <div className="flex flex-col">
                  <span className="text-charts-text-primary font-semibold">{stock.symbol}</span>
                  <span className="text-charts-text-secondary text-xs">{stock.companyName}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-charts-text-primary font-medium">${currentPrice.toFixed(2)}</span>
                  <span className={cn(
                    "flex items-center text-xs",
                    isPositiveChange ? "text-teal" : "text-red-500"
                  )}>
                    {isPositiveChange ? <TrendingUp className="h-3 w-3 mr-0.5" /> : <TrendingDown className="h-3 w-3 mr-0.5" />}
                    {dailyChange.toFixed(2)}%
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveSymbol(stock.symbol)}
                  className="text-red-400 hover:bg-red-900/20"
                >
                  Remove
                </Button>
              </div>
            );
          })
        )}
      </div>

      <Button
        onClick={handleManageAlerts}
        variant="outline"
        className="w-full border-charts-border text-charts-text-primary hover:bg-charts-panel-bg hover:text-charts-accent flex items-center justify-center"
      >
        <Bell className="h-4 w-4 mr-2" /> Manage Alerts
      </Button>
    </div>
  );
};

export default WatchlistApp;