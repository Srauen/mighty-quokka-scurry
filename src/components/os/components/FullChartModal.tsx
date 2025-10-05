"use client";

import React, { useEffect, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useTradingViewScript } from '@/hooks/use-tradingview-script'; // New import
import TradingViewWidget from '@/components/TradingViewWidget'; // New import

interface FullChartModalProps {
  symbol: string;
  onClose: () => void;
}

const FullChartModal: React.FC<FullChartModalProps> = ({ symbol, onClose }) => {
  const scriptLoaded = useTradingViewScript(); // Check if script is loaded
  const containerId = `tv-full-${symbol.replace(/[^\w]/g, "_")}`;

  const widgetOptions = useMemo(() => ({
    width: "100%",
    height: "100%",
    symbol: symbol,
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
  }), [symbol]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col z-[100] p-4" role="dialog" aria-modal="true">
      <div className="flex justify-between items-center p-3 bg-gray-900 rounded-t-lg shadow-lg">
        <h2 className="text-xl font-bold text-soft-white">{symbol}</h2>
        <Button onClick={onClose} variant="ghost" size="icon" className="text-gray-400 hover:text-white">
          <X className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex-1 bg-[#0B0B0B] rounded-b-lg">
        {scriptLoaded ? (
          <TradingViewWidget containerId={containerId} widgetOptions={widgetOptions} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">Loading chart script...</div>
        )}
      </div>
    </div>
  );
};

export default FullChartModal;