"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Bell, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useStockData } from '@/hooks/use-stock-data';
import { useTradingViewScript } from '@/hooks/use-tradingview-script';
import TradingViewWidget from '@/components/TradingViewWidget';

interface MainChartPanelProps {
  selectedStock: string;
}

const MainChartPanel: React.FC<MainChartPanelProps> = ({ selectedStock }) => {
  const scriptLoaded = useTradingViewScript();
  const { stockData } = useStockData();
  const [timeframe, setTimeframe] = useState<string>("D"); // Default to Daily

  const baseStockSymbol = selectedStock; // Already the base symbol

  const stockInfo = stockData[baseStockSymbol] || {
    companyName: 'Loading...',
    lastPrice: 0,
    dailyChange: 0,
    sentiments: [0],
    volumes: [0],
  };

  const currentPrice = stockInfo.lastPrice;
  const dailyChange = stockInfo.dailyChange;
  const isPositiveChange = dailyChange >= 0;
  const profitProbability = stockInfo.sentiments[stockInfo.sentiments.length - 1] || 0;
  const currentVolume = stockInfo.volumes[stockInfo.volumes.length - 1] || 0;

  // Helper to prefix symbol for TradingView
  const getTradingViewSymbol = useCallback((stock: string) => {
    // Simple heuristic: assume NASDAQ for most tech, NYSE for others
    if (['AAPL', 'TSLA', 'MSFT', 'AMZN', 'NVDA', 'GOOGL', 'INTC', 'SQ', 'NFLX', 'FB'].includes(stock)) {
      return `NASDAQ:${stock}`;
    }
    return `NYSE:${stock}`;
  }, []);

  const tradingViewSymbol = getTradingViewSymbol(selectedStock);

  const widgetOptions = useMemo(() => ({
    width: "100%",
    height: "100%",
    symbol: tradingViewSymbol,
    interval: timeframe,
    timezone: "Etc/UTC",
    theme: "dark",
    style: "1", // Candlestick chart
    locale: "en",
    toolbar_bg: "#0B0B0B",
    enable_publishing: false,
    allow_symbol_change: false, // Managed by our app
    hide_top_toolbar: true,
    hide_side_toolbar: true,
    hide_bottom_toolbar: true,
    hide_legend: true,
    hide_indicators: true,
    hide_timezone_footer: true,
    withdateranges: false,
    hide_time_scale: true, // Hide the time scale at the bottom
    studies: [], // Explicitly set to empty array to remove all default studies/indicators
    watchlist: false,
    details: false,
    hotlist: false,
    calendar: false,
    news: false,
    left_axis_visible: false,
    right_axis_visible: false,
    hide_volume: true,
    overrides: {
      "paneProperties.background": "#0B0B0B",
      "paneProperties.vertGridProperties.color": "rgba(156, 163, 175, 0.1)", // Lighter grid lines
      "paneProperties.horzGridProperties.color": "rgba(156, 163, 175, 0.1)", // Lighter grid lines
      "scalesProperties.textColor": "#E5E7EB", // charts-text-primary
      "scalesProperties.leftAxisProperties.visible": false, // Explicitly hide left axis
      "scalesProperties.rightAxisProperties.visible": false, // Explicitly hide right axis
      "mainSeriesProperties.candleStyle.upColor": "#00E676", // Teal
      "mainSeriesProperties.candleStyle.downColor": "#FF3B30", // Red
      "mainSeriesProperties.candleStyle.borderUpColor": "#00E676",
      "mainSeriesProperties.candleStyle.borderDownColor": "#FF3B30",
      "mainSeriesProperties.candleStyle.wickUpColor": "#00E676",
      "mainSeriesProperties.candleStyle.wickDownColor": "#FF3B30",
    },
    container_id: "tradingview_chart_container", // Fixed ID for the main chart
  }), [tradingViewSymbol, timeframe]);

  const handleSetAlert = () => {
    toast.info("Set Alert", { description: `Setting alert for ${baseStockSymbol}... (Feature coming soon)` });
  };

  const formatVolume = (value: number) => {
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
    return value.toLocaleString();
  };

  return (
    <div className="flex flex-col flex-grow bg-charts-panel-bg backdrop-blur-lg rounded-mac-window shadow-lg border border-charts-border relative overflow-hidden">
      {/* Header for Info Cards and Timeframe Controls */}
      <div className="p-4 border-b border-charts-border flex justify-between items-start">
        {/* Left: Price, Change, Volume, AI Prob */}
        <div className="flex flex-col space-y-2">
          <div className="flex flex-col">
            <div className="text-charts-text-secondary text-xs">Current Price</div>
            <div className="text-charts-text-primary text-2xl font-bold">${currentPrice.toFixed(2)}</div>
            <div className={cn("flex items-center text-sm font-medium", isPositiveChange ? "text-teal" : "text-red-500")}>
              {isPositiveChange ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              {dailyChange.toFixed(2)}%
            </div>
          </div>
          <div className="flex flex-col">
            <div className="text-charts-text-secondary text-xs">Volume</div>
            <div className="text-charts-text-primary text-xl font-bold">{formatVolume(currentVolume)}</div>
          </div>
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-charts-accent" />
            <div>
              <div className="text-charts-text-secondary text-xs">AI Profit Prob.</div>
              <div className="text-charts-accent text-xl font-bold">{profitProbability.toFixed(0)}%</div>
            </div>
          </div>
        </div>

        {/* Right: Timeframe Controls */}
        <div className="flex space-x-1 bg-charts-toolbar-bg backdrop-blur-md p-1 rounded-lg shadow-md border border-charts-border">
          {['1', '5', '15', '30', '60', 'D', 'W', 'M'].map((tf) => (
            <Button
              key={tf}
              variant="ghost"
              size="sm"
              onClick={() => setTimeframe(tf)}
              className={cn(
                "h-7 px-3 text-xs text-charts-text-secondary hover:text-charts-accent",
                timeframe === tf && "bg-charts-panel-bg text-charts-accent"
              )}
            >
              {tf === '1' ? '1m' : tf === '5' ? '5m' : tf === '15' ? '15m' : tf === '30' ? '30m' : tf === '60' ? '1h' : tf}
            </Button>
          ))}
        </div>
      </div>

      {/* TradingView Chart */}
      <div className="flex-grow w-full"> {/* Removed 'relative' here as parent is relative */}
        {scriptLoaded ? (
          <TradingViewWidget containerId="tradingview_chart_container" widgetOptions={widgetOptions} />
        ) : (
          <div className="flex items-center justify-center h-full text-charts-text-secondary">Loading chart script...</div>
        )}
      </div>

      {/* AI Insights Overlay (Placeholder) - Now positioned relative to the *panel* */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-charts-toolbar-bg backdrop-blur-md p-2 rounded-lg shadow-md border border-charts-border text-charts-text-primary text-sm flex items-center space-x-2">
        <Brain className="h-4 w-4 text-charts-accent animate-pulse-orb" />
        <span>AI BUY SIGNAL +84% for {selectedStock}</span>
      </div>
    </div>
  );
};

export default MainChartPanel;