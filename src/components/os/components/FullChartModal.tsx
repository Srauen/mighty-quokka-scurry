"use client";

import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface FullChartModalProps {
  symbol: string;
  onClose: () => void;
}

const FullChartModal: React.FC<FullChartModalProps> = ({ symbol, onClose }) => {
  const id = `tv-full-${symbol.replace(/[^\w]/g, "_")}`;
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!(window && (window as any).TradingView)) {
      console.warn("TradingView script not loaded for full chart.");
      return;
    }
    
    // Clear container before creating new widget
    if (widgetRef.current) {
      widgetRef.current.innerHTML = "";
    }

    new (window as any).TradingView.widget({
      container_id: id,
      width: "100%",
      height: "100%",
      symbol: symbol,
      interval: "D",
      timezone: "Etc/UTC",
      theme: "dark", // Keep dark theme for OS consistency
      style: "1", // Candlestick chart
      locale: "en",
      toolbar_bg: "#0B0B0B", // Dark toolbar background
      enable_publishing: false,
      allow_symbol_change: true, // Allow changing symbol in full chart
      hide_side_toolbar: false, // Show side toolbar
      hide_top_toolbar: false, // Show top toolbar
      withdateranges: true, // Show date ranges
      studies: ["MACD@tv-basicstudies", "RSI@tv-basicstudies"], // Keep studies
      watchlist: true, // Show watchlist
      details: true, // Show company details
      hotlist: true, // Show hotlist
      calendar: true, // Show calendar
      news: true, // Show news
      overrides: {
        "paneProperties.background": "#0B0B0B", // Dark background
        "scalesProperties.textColor": "#BFC7D6", // Soft white text
        // Candlestick colors
        "mainSeriesProperties.candleStyle.upColor": "#00E676", // Green for up
        "mainSeriesProperties.candleStyle.downColor": "#FF3B30", // Red for down
        "mainSeriesProperties.candleStyle.borderUpColor": "#00E676",
        "mainSeriesProperties.candleStyle.borderDownColor": "#FF3B30",
        "mainSeriesProperties.candleStyle.wickUpColor": "#00E676",
        "mainSeriesProperties.candleStyle.wickDownColor": "#FF3B30",
      }
    });
  }, [symbol, id]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col z-[100] p-4" role="dialog" aria-modal="true">
      <div className="flex justify-between items-center p-3 bg-gray-900 rounded-t-lg shadow-lg">
        <h2 className="text-xl font-bold text-soft-white">{symbol}</h2>
        <Button onClick={onClose} variant="ghost" size="icon" className="text-gray-400 hover:text-white">
          <X className="h-5 w-5" />
        </Button>
      </div>
      <div ref={widgetRef} id={id} className="flex-1 bg-[#0B0B0B] rounded-b-lg" />
    </div>
  );
};

export default FullChartModal;