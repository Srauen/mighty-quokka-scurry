"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useStockData } from '@/hooks/use-stock-data';
import HeatmapTile from './HeatmapTile';
import { toast } from 'sonner';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface StockHeatmapData {
  symbol: string;
  companyName: string;
  price: number;
  change: number;
  volume: number;
  marketCap: number;
  sector: string;
  aiScore: number;
}

const MarketHeatmap: React.FC = () => {
  const { stockData, stocksList } = useStockData();
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1D');
  const [sizeMode, setSizeMode] = useState<'marketCap' | 'equal'>('marketCap');
  const [sortBy, setSortBy] = useState<'change' | 'marketCap' | 'volume' | 'aiScore'>('change');
  const [sectorFilter, setSectorFilter] = useState<string>('All');
  const [colorScheme, setColorScheme] = useState<'default' | 'colorblind'>('default');
  const [collapsedSectors, setCollapsedSectors] = useState<Set<string>>(new Set());

  const allSectors = useMemo(() => {
    const sectors = new Set<string>();
    Object.values(stockData).forEach(data => sectors.add(data.sector));
    return ['All', ...Array.from(sectors).sort()];
  }, [stockData]);

  const processedHeatmapData = useMemo(() => {
    const data: StockHeatmapData[] = stocksList
      .map(symbol => {
        const stock = stockData[symbol];
        if (!stock) return null;

        // For simplicity, timeframe will currently just affect the 'change' calculation
        // In a real app, this would involve fetching historical data for the selected timeframe
        let effectiveChange = stock.dailyChange; // Default to 1D change

        // Simulate different changes for other timeframes (for demo purposes)
        if (timeframe === '1W') effectiveChange = stock.dailyChange * (Math.random() * 1.5 + 0.5);
        if (timeframe === '1M') effectiveChange = stock.dailyChange * (Math.random() * 2 + 0.8);
        if (timeframe === '1Y') effectiveChange = stock.dailyChange * (Math.random() * 3 + 1);

        return {
          symbol: symbol,
          companyName: stock.companyName,
          price: stock.lastPrice,
          change: effectiveChange,
          volume: stock.volumes[stock.volumes.length - 1],
          marketCap: stock.marketCap,
          sector: stock.sector,
          aiScore: stock.sentiments[stock.sentiments.length - 1], // Using sentiment as AI score for now
        };
      })
      .filter(Boolean) as StockHeatmapData[];

    // Apply sector filter
    const filteredData = sectorFilter === 'All'
      ? data
      : data.filter(item => item.sector === sectorFilter);

    // Apply sorting
    filteredData.sort((a, b) => {
      if (sortBy === 'change') return Math.abs(b.change) - Math.abs(a.change);
      if (sortBy === 'marketCap') return b.marketCap - a.marketCap;
      if (sortBy === 'volume') return b.volume - a.volume;
      if (sortBy === 'aiScore') return b.aiScore - a.aiScore;
      return 0;
    });

    return filteredData;
  }, [stockData, stocksList, timeframe, sectorFilter, sortBy]);

  const groupedBySector = useMemo(() => {
    const groups: { [key: string]: StockHeatmapData[] } = {};
    processedHeatmapData.forEach(item => {
      if (!groups[item.sector]) {
        groups[item.sector] = [];
      }
      groups[item.sector].push(item);
    });
    return groups;
  }, [processedHeatmapData]);

  const getTileSize = useCallback((marketCap: number) => {
    if (sizeMode === 'equal') return '100px'; // Fixed size
    // Scale based on market cap (logarithmic scale for better visual distribution)
    const minSize = 80; // Minimum tile size in px
    const maxSize = 200; // Maximum tile size in px
    const minCap = Math.min(...processedHeatmapData.map(d => d.marketCap));
    const maxCap = Math.max(...processedHeatmapData.map(d => d.marketCap));

    if (maxCap === minCap) return `${minSize}px`; // Avoid division by zero

    const logMinCap = Math.log(minCap);
    const logMaxCap = Math.log(maxCap);
    const logMarketCap = Math.log(marketCap);

    const scale = (logMarketCap - logMinCap) / (logMaxCap - logMinCap);
    const size = minSize + scale * (maxSize - minSize);
    return `${size}px`;
  }, [sizeMode, processedHeatmapData]);

  const toggleSectorCollapse = (sector: string) => {
    setCollapsedSectors(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sector)) {
        newSet.delete(sector);
      } else {
        newSet.add(sector);
      }
      return newSet;
    });
  };

  // Identify top movers for pulse animation
  const topMovers = useMemo(() => {
    return processedHeatmapData
      .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
      .slice(0, 3)
      .map(d => d.symbol);
  }, [processedHeatmapData]);

  const handleTileClick = (symbol: string) => {
    toast.info("Stock Selected", { description: `You clicked on ${symbol}. This would open a detailed chart.` });
    // In a full application, this would trigger opening a detailed chart panel/drawer
  };

  const legendItems = useMemo(() => {
    const colors = colorScheme === 'default' ? {
      strongUp: 'bg-heatmap-strong-up', moderateUp: 'bg-heatmap-moderate-up', slightUp: 'bg-teal',
      neutral: 'bg-heatmap-neutral', slightDown: 'bg-heatmap-moderate-down', strongDown: 'bg-heatmap-strong-down', extremeDown: 'bg-heatmap-extreme-down'
    } : {
      strongUp: 'bg-heatmap-cb-up', moderateUp: 'bg-heatmap-cb-up', slightUp: 'bg-heatmap-cb-up',
      neutral: 'bg-heatmap-cb-neutral', slightDown: 'bg-heatmap-cb-down', strongDown: 'bg-heatmap-cb-down', extremeDown: 'bg-heatmap-cb-down'
    };

    return [
      { label: 'Strong Gain (≥ +5%)', color: colors.strongUp },
      { label: 'Moderate Gain (+2% to +5%)', color: colors.moderateUp },
      { label: 'Slight Gain (+0.5% to +2%)', color: colors.slightUp },
      { label: 'Neutral (±0.5%)', color: colors.neutral },
      { label: 'Slight Loss (-0.5% to -2%)', color: colors.slightDown },
      { label: 'Moderate Loss (-2% to -5%)', color: colors.strongDown },
      { label: 'Strong Loss (≤ -5%)', color: colors.extremeDown },
    ];
  }, [colorScheme]);

  return (
    <div className="flex flex-col h-full">
      {/* Controls Panel */}
      <Card className="glassmorphic-card mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <Label htmlFor="timeframe-select" className="text-body-label text-sm">Timeframe</Label>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger id="timeframe-select" className="w-full bg-gray-800 border-gray-700 text-soft-white">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-soft-white z-[9999]">
                <SelectItem value="1D">1 Day</SelectItem>
                <SelectItem value="1W">1 Week</SelectItem>
                <SelectItem value="1M">1 Month</SelectItem>
                <SelectItem value="1Y">1 Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="size-mode-select" className="text-body-label text-sm">Size By</Label>
            <Select value={sizeMode} onValueChange={setSizeMode}>
              <SelectTrigger id="size-mode-select" className="w-full bg-gray-800 border-gray-700 text-soft-white">
                <SelectValue placeholder="Size mode" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-soft-white z-[9999]">
                <SelectItem value="marketCap">Market Cap</SelectItem>
                <SelectItem value="equal">Equal Tiles</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="sort-by-select" className="text-body-label text-sm">Sort By</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger id="sort-by-select" className="w-full bg-gray-800 border-gray-700 text-soft-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-soft-white z-[9999]">
                <SelectItem value="change">% Change</SelectItem>
                <SelectItem value="marketCap">Market Cap</SelectItem>
                <SelectItem value="volume">Volume</SelectItem>
                <SelectItem value="aiScore">AI Score</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="sector-filter-select" className="text-body-label text-sm">Sector Filter</Label>
            <Select value={sectorFilter} onValueChange={setSectorFilter}>
              <SelectTrigger id="sector-filter-select" className="w-full bg-gray-800 border-gray-700 text-soft-white">
                <SelectValue placeholder="Filter by sector" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-soft-white z-[9999]">
                {allSectors.map(sector => (
                  <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center space-x-2">
            <Switch
              id="colorblind-toggle"
              checked={colorScheme === 'colorblind'}
              onCheckedChange={(checked) => setColorScheme(checked ? 'colorblind' : 'default')}
              className="data-[state=checked]:bg-electric-blue"
            />
            <Label htmlFor="colorblind-toggle" className="text-body-label text-sm">Colorblind Mode</Label>
          </div>
          <Button variant="ghost" className="text-gray-400 hover:text-electric-blue" onClick={() => toast.info("Zoom/Pan", { description: "Zoom and Pan functionality coming soon!" })}>
            Zoom/Pan (Coming Soon)
          </Button>
        </div>
      </Card>

      {/* Heatmap Display */}
      <Card className="glassmorphic-card flex-grow p-6 overflow-y-auto custom-scrollbar">
        {Object.keys(groupedBySector).length === 0 ? (
          <p className="text-gray-400 text-lg text-center py-10">No stocks match your criteria.</p>
        ) : (
          Object.entries(groupedBySector).map(([sector, stocks]) => (
            <div key={sector} className="mb-6 last:mb-0">
              <div
                className="flex items-center justify-between py-2 px-3 bg-gray-800 rounded-md cursor-pointer hover:bg-gray-700 transition-colors duration-200"
                onClick={() => toggleSectorCollapse(sector)}
              >
                <h3 className="text-lg font-semibold text-soft-white">{sector}</h3>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-electric-blue">
                  {collapsedSectors.has(sector) ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                </Button>
              </div>
              {!collapsedSectors.has(sector) && (
                <div className="grid gap-2 p-2 mt-2" style={{
                  gridTemplateColumns: `repeat(auto-fill, minmax(${sizeMode === 'equal' ? '100px' : '80px'}, 1fr))`
                }}>
                  {stocks.map(stock => (
                    <HeatmapTile
                      key={stock.symbol}
                      {...stock}
                      colorScheme={colorScheme}
                      isTopMover={topMovers.includes(stock.symbol)}
                      onClick={handleTileClick}
                      // Apply dynamic size if not equal mode
                      style={sizeMode === 'marketCap' ? { width: getTileSize(stock.marketCap), height: getTileSize(stock.marketCap) } : {}}
                    />
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </Card>

      {/* Legend */}
      <Card className="glassmorphic-card mt-6 p-4">
        <CardTitle className="text-lg font-semibold text-electric-blue mb-3">Legend</CardTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          {legendItems.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className={cn("w-4 h-4 rounded-sm", item.color)}></span>
              <span className="text-body-label">{item.label}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default MarketHeatmap;