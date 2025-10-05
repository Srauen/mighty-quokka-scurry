"use client";

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Bell, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useStockData } from '@/hooks/use-stock-data';
import Chart from 'chart.js/auto'; // Import Chart.js
import { useTradingViewScript } from '@/hooks/use-tradingview-script'; // Import TradingView script hook
import TradingViewWidget from '@/components/TradingViewWidget'; // Import TradingView widget

interface MainChartPanelProps {
  selectedStock: string;
  isTradingViewMode: boolean; // New prop
}

const MainChartPanel: React.FC<MainChartPanelProps> = ({ selectedStock, isTradingViewMode }) => {
  const { stockData } = useStockData();
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>("1D"); // Default to Daily

  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const scriptLoaded = useTradingViewScript(); // Check if TradingView script is loaded

  const baseStockSymbol = selectedStock;

  const stockInfo = stockData[baseStockSymbol] || {
    companyName: 'Loading...',
    lastPrice: 0,
    dailyChange: 0,
    sentiments: [0],
    volumes: [0],
    prices: [],
    labels: [],
  };

  const currentPrice = stockInfo.lastPrice;
  const dailyChange = stockInfo.dailyChange;
  const isPositiveChange = dailyChange >= 0;
  const profitProbability = stockInfo.sentiments[stockInfo.sentiments.length - 1] || 0;
  const currentVolume = stockInfo.volumes[stockInfo.volumes.length - 1] || 0;

  // Chart.js specific effect
  useEffect(() => {
    if (!isTradingViewMode && chartRef.current && stockInfo.prices.length > 0) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      if (!ctx) return;

      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, 'rgba(0, 174, 239, 0.5)'); // Electric Blue
      gradient.addColorStop(1, 'rgba(0, 174, 239, 0)');

      const getFilteredData = () => {
        let startIndex = 0;
        switch (timeframe) {
          case '1D': startIndex = Math.max(0, stockInfo.prices.length - 20); break;
          case '1W': startIndex = Math.max(0, stockInfo.prices.length - 50); break;
          case '1M': startIndex = Math.max(0, stockInfo.prices.length - 100); break;
          case '1Y': startIndex = Math.max(0, stockInfo.prices.length - 365); break;
        }
        return {
          prices: stockInfo.prices.slice(startIndex),
          labels: stockInfo.labels.slice(startIndex),
          volumes: stockInfo.volumes.slice(startIndex),
        };
      };

      const filteredData = getFilteredData();

      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: filteredData.labels,
          datasets: [{
            label: `${baseStockSymbol} Price`,
            data: filteredData.prices,
            borderColor: '#00AEFF', // Electric Blue
            backgroundColor: gradient,
            pointBackgroundColor: '#00AEFF',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#00AEFF',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointRadius: 0,
            pointHoverRadius: 6,
            yAxisID: 'y-price',
          },
          {
            label: 'Volume',
            data: filteredData.volumes,
            type: 'bar',
            backgroundColor: 'rgba(0, 230, 118, 0.3)', // Teal with transparency
            borderColor: 'rgba(0, 230, 118, 0.6)',
            borderWidth: 1,
            yAxisID: 'y-volume',
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          scales: {
            'y-price': {
              beginAtZero: false,
              position: 'right',
              grid: { color: 'rgba(156, 163, 175, 0.1)' },
              ticks: { color: '#E5E7EB' },
            },
            'y-volume': {
              beginAtZero: true,
              position: 'left',
              grid: { display: false },
              ticks: { color: '#E5E7EB', maxTicksLimit: 4 },
            },
            x: {
              grid: { display: false },
              ticks: { color: '#E5E7EB' },
            }
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: '#1f2937',
              titleColor: '#fff',
              bodyColor: '#d1d5db',
              borderColor: '#00AEFF',
              borderWidth: 1,
              cornerRadius: 6,
              padding: 10,
            }
          },
          animation: { duration: 1000, easing: 'easeOutQuart' }
        }
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [stockInfo, baseStockSymbol, timeframe, isTradingViewMode]);

  const handleSetAlert = () => {
    toast.info("Set Alert", { description: `Setting alert for ${baseStockSymbol}... (Feature coming soon)` });
  };

  const formatVolume = (value: number) => {
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
    return value.toLocaleString();
  };

  const tradingViewWidgetOptions = useMemo(() => ({
    width: "100%",
    height: 500, // Changed from "100%"
    symbol: selectedStock,
    interval: "D",
    timezone: "Etc/UTC",
    theme: "dark",
    style: "1", // Candlestick chart
    locale: "en",
    toolbar_bg: "#0B0B0B",
    enable_publishing: false,
    allow_symbol_change: true,
    hide_side_toolbar: false,
    hide_top_toolbar: false,
    withdateranges: true,
    studies: ["MACD@tv-basicstudies", "RSI@tv-basicstudies"],
    watchlist: true,
    details: true,
    hotlist: true,
    calendar: true,
    news: true,
    overrides: {
      "paneProperties.background": "#0B0B0B",
      "paneProperties.vertGridProperties.color": "rgba(156, 163, 175, 0.1)", // Lighter grid lines
      "paneProperties.horzGridProperties.color": "rgba(156, 163, 175, 0.1)", // Lighter grid lines
      "scalesProperties.textColor": "#E5E7EB", // charts-text-primary
      "mainSeriesProperties.candleStyle.upColor": "#00E676",
      "mainSeriesProperties.candleStyle.downColor": "#FF3B30",
      "mainSeriesProperties.candleStyle.borderUpColor": "#00E676",
      "mainSeriesProperties.candleStyle.borderDownColor": "#FF3B30",
      "mainSeriesProperties.candleStyle.wickUpColor": "#00E676",
      "mainSeriesProperties.candleStyle.wickDownColor": "#FF3B30",
    }
  }), [selectedStock]);

  return (
    <div className={cn(
      "flex flex-col flex-grow bg-charts-panel-bg backdrop-blur-lg rounded-mac-window shadow-lg border border-charts-border relative overflow-hidden",
      isTradingViewMode ? "animate-glow-charts" : "transition-all duration-500"
    )}>
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
        {!isTradingViewMode && ( // Hide Chart.js timeframe controls in TradingView mode
          <div className="flex space-x-1 bg-charts-toolbar-bg backdrop-blur-md p-1 rounded-lg shadow-md border border-charts-border">
            {['1D', '1W', '1M', '1Y'].map((tf) => (
              <Button
                key={tf}
                variant="ghost"
                size="sm"
                onClick={() => setTimeframe(tf as '1D' | '1W' | '1M' | '1Y')}
                className={cn(
                  "h-7 px-3 text-xs text-charts-text-secondary hover:text-charts-accent",
                  timeframe === tf && "bg-charts-panel-bg text-charts-accent"
                )}
              >
                {tf}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Chart Area */}
      <div className="flex-grow w-full h-full min-h-0 p-4 transition-opacity duration-500">
        {isTradingViewMode && scriptLoaded ? (
          <TradingViewWidget containerId={`tradingview-main-chart-${selectedStock}`} widgetOptions={tradingViewWidgetOptions} />
        ) : (
          <canvas ref={chartRef} className="w-full h-full"></canvas>
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