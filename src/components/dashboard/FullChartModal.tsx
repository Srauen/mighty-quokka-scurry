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
      theme: "dark",
      style: "1",
      locale: "en",
      toolbar_bg: "#0B0B0B",
      enable_publishing: false,
      allow_symbol_change: true,
      hide_side_toolbar: false,
      studies: ["MACD@tv-basicstudies", "RSI@tv-basicstudies"],
      overrides: {
        "paneProperties.background": "#0B0B0B",
        "scalesProperties.textColor": "#BFC7D6",
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