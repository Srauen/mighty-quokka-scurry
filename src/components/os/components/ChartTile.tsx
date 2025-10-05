"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Bell, Maximize } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useStockData } from '@/hooks/use-stock-data'; // To get company name and AI score

interface ChartTileProps {
  symbol: string;
  index: number;
  openFull: (symbol: string) => void;
}

const ChartTile: React.FC<ChartTileProps> = ({ symbol, index, openFull }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = `tv-small-${index}`;
  const { stockData } = useStockData(); // Get stock data for additional info

  // Extract the base stock symbol from the TradingView formatted symbol (e.g., "NASDAQ:AAPL" -> "AAPL")
  const baseStockSymbol = symbol.includes(':') ? symbol.split(':')[1] : symbol;

  const stockInfo = stockData[baseStockSymbol] || {
    companyName: 'Loading...',
    lastPrice: 0,
    dailyChange: 0,
    sentiments: [0],
  };

  const currentPrice = stockInfo.lastPrice;
  const dailyChange = stockInfo.dailyChange;
  const isPositiveChange = dailyChange >= 0;
  const profitProbability = stockInfo.sentiments[stockInfo.sentiments.length - 1] || 0; // Using sentiment as AI score

  useEffect(() => {
    let widget: any = null;
    let retryTimer: NodeJS.Timeout | null = null;

    const createWidget = () => {
      const el = document.getElementById(widgetId);
      if (!el) return;

      // Clear existing widget content
      el.innerHTML = "";

      if (!(window && (window as any).TradingView)) {
        console.warn("TradingView script not loaded yet. Retrying...");
        retryTimer = setTimeout(createWidget, 500); // Retry after 0.5 seconds
        return;
      }

      widget = new (window as any).TradingView.widget({
        container_id: widgetId,
        width: "100%",
        height: 260,
        symbol: symbol,
        interval: "60", // 60 minute default for tile
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1", // Candlestick chart
        locale: "en",
        toolbar_bg: "#0B0B0B",
        enable_publishing: false,
        allow_symbol_change: false, // Keep false for tile, symbol is controlled by parent
        hide_top_toolbar: true, // Keep hidden for tile
        hide_side_toolbar: true, // Keep hidden for tile
        withdateranges: false,
        studies_overrides: {},
        overrides: {
          "paneProperties.background": "#0B0B0B",
          "paneProperties.vertGridProperties.color": "#121212",
          "paneProperties.horzGridProperties.color": "#121212",
          "scalesProperties.textColor": "#BFC7D6",
          // Candlestick colors
          "mainSeriesProperties.candleStyle.upColor": "#00E676", // Green for up
          "mainSeriesProperties.candleStyle.downColor": "#FF3B30", // Red for down
          "mainSeriesProperties.candleStyle.borderUpColor": "#00E676",
          "mainSeriesProperties.candleStyle.borderDownColor": "#FF3B30",
          "mainSeriesProperties.candleStyle.wickUpColor": "#00E676",
          "mainSeriesProperties.candleStyle.wickDownColor": "#FF3B30",
        }
      });
    };

    createWidget();

    return () => {
      if (retryTimer) clearTimeout(retryTimer);
      if (widget && typeof widget.remove === 'function') {
        widget.remove();
      }
    };
  }, [symbol, widgetId]); // Only re-run if symbol or widgetId changes

  const handleSetAlert = () => {
    toast.info("Set Alert", { description: `Setting alert for ${baseStockSymbol}... (Feature coming soon)` });
  };

  return (
    <div ref={containerRef} className="glassmorphic-card chart-tile p-4 rounded-xl shadow-lg border border-gray-700 hover:border-electric-blue transition-all duration-200 flex flex-col" role="article" aria-label={`Chart tile ${symbol}`}>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-2">
          {/* Company Logo Placeholder */}
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-electric-blue to-teal flex items-center justify-center text-xs font-bold text-white" aria-hidden>
            {baseStockSymbol.substring(0, 2)}
          </div>
          <div>
            <div className="text-lg font-bold text-soft-white">{baseStockSymbol}</div>
            <div className="text-xs text-body-label">{stockInfo.companyName}</div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-xl font-bold text-soft-white">${currentPrice.toFixed(2)}</div>
          <div className={cn("flex items-center text-sm font-medium", isPositiveChange ? "text-teal" : "text-red-500")}>
            {isPositiveChange ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            {dailyChange.toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="relative flex-grow min-h-[260px] bg-[#0B0B0B] rounded-md overflow-hidden">
        <div id={widgetId} className="w-full h-full" />
      </div>

      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-800">
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" className="h-7 px-3 text-xs text-gray-400 hover:text-electric-blue" onClick={() => toast.info("Timeframe", { description: "Timeframe toggle coming soon!" })}>1D</Button>
          <Button variant="ghost" size="sm" className="h-7 px-3 text-xs text-gray-400 hover:text-electric-blue" onClick={() => toast.info("Timeframe", { description: "Timeframe toggle coming soon!" })}>1W</Button>
          <Button variant="ghost" size="sm" className="h-7 px-3 text-xs text-gray-400 hover:text-electric-blue" onClick={() => toast.info("Timeframe", { description: "Timeframe toggle coming soon!" })}>1M</Button>
          <Button variant="ghost" size="sm" className="h-7 px-3 text-xs text-gray-400 hover:text-electric-blue" onClick={() => toast.info("Timeframe", { description: "Timeframe toggle coming soon!" })}>1Y</Button>
        </div>
        <div className="flex space-x-2">
          <div className="flex items-center text-sm text-body-label">
            <span className="mr-1">📈</span> <strong>Prob:</strong> <span className="font-bold text-electric-blue">{profitProbability.toFixed(0)}%</span>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-electric-blue" onClick={handleSetAlert} aria-label="Set Alert">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-electric-blue" onClick={() => openFull(symbol)} aria-label="Open Full Chart">
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChartTile;