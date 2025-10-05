"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useStockData } from '@/hooks/use-stock-data';
import { cn } from '@/lib/utils';
import ChartTile from './ChartTile';
import FullChartModal from './FullChartModal';
import DashboardNavbar from './DashboardNavbar'; // Reusing existing navbar
import DashboardSidebar from './DashboardSidebar'; // Reusing existing sidebar
import AlertsBar from './AlertsBar'; // Reusing existing alerts bar
import FloatingActionButtons from './FloatingActionButtons'; // Reusing existing FABs

// Default symbol list fallback (using stocksList from useStockData)
const DEFAULT_SYMBOLS_PREFIXED = [
  "NASDAQ:AAPL", "NASDAQ:TSLA", "NASDAQ:MSFT", "NASDAQ:AMZN", "NASDAQ:NVDA",
  "NASDAQ:GOOGL", "NYSE:IBM", "NASDAQ:INTC", "NYSE:GS", "NASDAQ:SQ",
  "NYSE:KO", "NYSE:PEP", "NYSE:MCD", "NYSE:DIS", "NYSE:NKE"
];

export default function TradingGrid() {
  const { stocksList } = useStockData(); // Get the dynamic stocksList
  const [symbols, setSymbols] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [fullSymbol, setFullSymbol] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // State for sidebar

  useEffect(() => {
    // Use the stocksList from the hook, prefixing them for TradingView
    const prefixedSymbols = stocksList.map(s => {
      // Simple heuristic: assume NASDAQ for most tech, NYSE for others
      if (['AAPL', 'TSLA', 'MSFT', 'AMZN', 'NVDA', 'GOOGL', 'INTC', 'SQ'].includes(s)) {
        return `NASDAQ:${s}`;
      }
      return `NYSE:${s}`;
    });
    setSymbols(prefixedSymbols);
    setLoading(false);
  }, [stocksList]);

  const openFullChart = useCallback((sym: string) => {
    setFullSymbol(sym);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#0B0B0B] text-soft-white font-mono">
      <DashboardNavbar userName="Trader" /> {/* Reusing DashboardNavbar */}

      <div className="flex flex-grow overflow-hidden">
        {/* Reusing DashboardSidebar */}
        <DashboardSidebar /> 

        <main className="flex-grow p-6 overflow-y-auto custom-scrollbar">
          <h2 className="text-3xl font-bold text-electric-blue mb-6">Multi-Chart Workspace</h2>
          <p className="text-gray-400 mb-8">Monitor multiple stocks in real-time with TradingView-style charts.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center text-gray-400 text-lg py-10">Loading charts...</div>
            ) : (
              symbols.map((s, i) => (
                <ChartTile key={s} symbol={s} index={i} openFull={openFullChart} />
              ))
            )}
          </div>
        </main>
      </div>

      <AlertsBar /> {/* Reusing AlertsBar */}
      <FloatingActionButtons /> {/* Reusing FloatingActionButtons */}

      {fullSymbol && (
        <FullChartModal symbol={fullSymbol} onClose={() => setFullSymbol(null)} />
      )}
    </div>
  );
}