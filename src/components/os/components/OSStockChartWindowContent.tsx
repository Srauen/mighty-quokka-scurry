"use client";

import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react'; // Added useMemo
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStockData } from '@/hooks/use-stock-data';
import Chart from 'chart.js/auto'; // Import Chart.js
import { Button } from '@/components/ui/button';
import { Maximize } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTradingViewScript } from '@/hooks/use-tradingview-script'; // Import TradingView script hook
import TradingViewWidget from '@/components/TradingViewWidget'; // Import TradingView widget
import FullChartModal from './FullChartModal'; // Imported FullChartModal

interface OSStockChartWindowContentProps {
  stocksList: string[];
  openFullChart: (symbol: string) => void;
  fullSymbol: string | null;
  closeFullChart: () => void;
  initialSelectedStock?: string;
  isTradingViewMode: boolean; // New prop
}

const OSStockChartWindowContent: React.FC<OSStockChartWindowContentProps> = ({
  stocksList,
  openFullChart,
  fullSymbol,
  closeFullChart,
  initialSelectedStock,
  isTradingViewMode,
}) => {
  const [selectedStock, setSelectedStock] = useState<string>(initialSelectedStock || stocksList[0] || 'AAPL');
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1D');

  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const { stockData } = useStockData();
  const scriptLoaded = useTradingViewScript(); // Check if TradingView script is loaded

  const stockInfo = stockData[selectedStock] || {
    companyName: 'Loading...',
    prices: [],
    labels: [],
    volumes: [],
  };

  useEffect(() => {
    if (initialSelectedStock && initialSelectedStock !== selectedStock) {
      setSelectedStock(initialSelectedStock);
    }
    if (stocksList.length > 0 && !stocksList.includes(selectedStock)) {
      setSelectedStock(stocksList[0]);
    }
  }, [stocksList, initialSelectedStock, selectedStock]);

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
            label: `${selectedStock} Price`,
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
  }, [stockInfo, selectedStock, timeframe, isTradingViewMode]);

  const tradingViewWidgetOptions = useMemo(() => ({
    width: "100%",
    height: 500, // Changed from "100%"
    symbol: selectedStock,
    interval: "D",
    timezone: "Etc/UTC",
    theme: "dark",
    style: "1",
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
      "paneProperties.vertGridProperties.color": "rgba(156, 163, 175, 0.1)",
      "paneProperties.horzGridProperties.color": "rgba(156, 163, 175, 0.1)",
      "scalesProperties.textColor": "#E5E7EB",
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
      "flex flex-col h-full p-4 bg-[#1a2033] text-soft-white transition-all duration-500",
      isTradingViewMode && "animate-glow-charts"
    )}>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex-grow mr-4">
          <label htmlFor="stock-select-os" className="block text-sm font-medium mb-1 text-body-label">Select Stock</label>
          <Select value={selectedStock} onValueChange={setSelectedStock}>
            <SelectTrigger id="stock-select-os" className="w-full bg-gray-800 border-gray-700 text-soft-white">
              <SelectValue placeholder="Select a stock" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-soft-white">
              {stocksList.map((stock) => (
                <SelectItem key={stock} value={stock}>{stock}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex space-x-1 bg-gray-800 border border-gray-700 rounded-lg p-1">
          {!isTradingViewMode && ( // Hide Chart.js timeframe controls in TradingView mode
            <>
              {['1D', '1W', '1M', '1Y'].map(tf => (
                <Button
                  key={tf}
                  variant="ghost"
                  size="sm"
                  onClick={() => setTimeframe(tf as '1D' | '1W' | '1M' | '1Y')}
                  className={cn(
                    "h-7 px-3 text-xs text-gray-400 hover:text-electric-blue",
                    timeframe === tf && "bg-gray-700 text-electric-blue"
                  )}
                >
                  {tf}
                </Button>
              ))}
            </>
          )}
          <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-electric-blue" onClick={() => openFullChart(selectedStock)} aria-label="Open Full Chart">
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-grow min-h-0 transition-opacity duration-500">
        {isTradingViewMode && scriptLoaded ? (
          <TradingViewWidget containerId={`tradingview-os-chart-${selectedStock}`} widgetOptions={tradingViewWidgetOptions} />
        ) : (
          <canvas ref={chartRef} className="w-full h-full"></canvas>
        )}
      </div>

      {fullSymbol && (
        <FullChartModal symbol={fullSymbol} onClose={closeFullChart} isTradingViewMode={isTradingViewMode} />
      )}
    </div>
  );
};

export default OSStockChartWindowContent;