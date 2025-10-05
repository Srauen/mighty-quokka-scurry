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
  const widgetRef = useRef<any>(null); // Ref to store the TradingView widget instance
  const containerRef = useRef<HTMLDivElement>(null); // Ref for the container div

  useEffect(() => {
    let retryTimer: NodeJS.Timeout | null = null;

    const loadAndCreateWidget = () => {
      if (!containerRef.current) return;

      // Clear container before creating new widget
      containerRef.current.innerHTML = "";

      if (!(window && (window as any).TradingView)) {
        console.warn("TradingView script not loaded for full chart. Retrying...");
        retryTimer = setTimeout(loadAndCreateWidget, 500);
        return;
      }
      
      // Destroy any previously created widget for this container
      if (widgetRef.current && typeof widgetRef.current.remove === 'function') {
        widgetRef.current.remove();
        widgetRef.current = null;
      }

      widgetRef.current = new (window as any).TradingView.widget({
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
    };

    loadAndCreateWidget();

    return () => {
      if (retryTimer) clearTimeout(retryTimer);
      // Cleanup: remove the widget when component unmounts or symbol changes
      if (widgetRef.current && typeof widgetRef.current.remove === 'function') {
        widgetRef.current.remove();
        widgetRef.current = null;
      }
    };
  }, [symbol, id]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col z-[100] p-4" role="dialog" aria-modal="true">
      <div className="flex justify-between items-center p-3 bg-gray-900 rounded-t-lg shadow-lg">
        <h2 className="text-xl font-bold text-soft-white">{symbol}</h2>
        <Button onClick={onClose} variant="ghost" size="icon" className="text-gray-400 hover:text-white">
          <X className="h-5 w-5" />
        </Button>
      </div>
      <div ref={containerRef} id={id} className="flex-1 bg-[#0B0B0B] rounded-b-lg" />
    </div>
  );
};

export default FullChartModal;