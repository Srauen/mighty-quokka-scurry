"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import Chart from 'chart.js/auto'; // Import Chart.js
import { useStockData } from '@/hooks/use-stock-data';
import { cn } from '@/lib/utils'; // Imported cn

interface FullChartModalProps {
  symbol: string;
  onClose: () => void;
}

const FullChartModal: React.FC<FullChartModalProps> = ({ symbol, onClose }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const { stockData } = useStockData();
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1D');

  const stockInfo = stockData[symbol] || {
    companyName: 'Loading...',
    prices: [],
    labels: [],
    volumes: [],
  };

  useEffect(() => {
    if (chartRef.current && stockInfo.prices.length > 0) {
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
            label: `${symbol} Price`,
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
  }, [stockInfo, symbol, timeframe]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col z-[100] p-4" role="dialog" aria-modal="true">
      <div className="flex justify-between items-center p-3 bg-gray-900 rounded-t-lg shadow-lg">
        <h2 className="text-xl font-bold text-soft-white">{symbol}</h2>
        <div className="flex items-center space-x-2">
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
          <Button onClick={onClose} variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="flex-1 bg-[#0B0B0B] rounded-b-lg p-4">
        <canvas ref={chartRef} className="w-full h-full"></canvas>
      </div>
    </div>
  );
};

export default FullChartModal;