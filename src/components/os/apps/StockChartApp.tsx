"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface StockChartAppProps {
  stocksList: string[];
  stockData: {
    [key: string]: { prices: number[]; labels: string[] };
  };
}

const StockChartApp: React.FC<StockChartAppProps> = ({ stocksList, stockData }) => {
  const [selectedStock, setSelectedStock] = useState<string>(stocksList[0]);
  const chartRef = useRef<ChartJS<'line', number[], string> | null>(null);

  useEffect(() => {
    // Ensure chart resizes when window changes or component mounts
    if (chartRef.current) {
      chartRef.current.resize();
    }
  }, [selectedStock]); // Only resize on stock change, data updates handled below

  useEffect(() => {
    // Explicitly update chart data when stockData changes
    if (chartRef.current) {
      chartRef.current.data.labels = stockData[selectedStock]?.labels || [];
      chartRef.current.data.datasets[0].data = stockData[selectedStock]?.prices || [];
      chartRef.current.update();
    }
  }, [stockData, selectedStock]); // Re-run when stockData or selectedStock changes

  const currentStockData = stockData[selectedStock] || { prices: [], labels: [] };
  const currentPrice = currentStockData.prices.length > 0 ? currentStockData.prices[currentStockData.prices.length - 1] : 0;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        grid: { color: '#374151' },
        ticks: { color: '#d1d5db' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#d1d5db' }
      }
    },
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: `${selectedStock} Price Chart`,
        color: '#d1d5db',
        font: {
          size: 18,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 10
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: '#1f2937',
        titleColor: '#fff',
        bodyColor: '#d1d5db',
        borderColor: '#4f46e5',
        borderWidth: 1,
        cornerRadius: 6,
        padding: 10,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    animation: { duration: 1000, easing: 'easeOutQuart' as const }
  };

  const chartData = {
    labels: currentStockData.labels,
    datasets: [
      {
        label: `${selectedStock} Price`,
        data: currentStockData.prices,
        borderColor: '#4f46e5',
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return;
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, 'rgba(79, 70, 229, 0)');
          gradient.addColorStop(1, 'rgba(79, 70, 229, 0.5)');
          return gradient;
        },
        pointBackgroundColor: '#4f46e5',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#4f46e5',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
    ],
  };

  return (
    <div className="flex flex-col h-full p-2">
      <div className="mb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-grow w-full sm:w-auto">
          <label htmlFor="stock-select" className="block text-sm font-medium mb-1 text-gray-300">Select a Stock</label>
          <Select value={selectedStock} onValueChange={setSelectedStock}>
            <SelectTrigger id="stock-select" className="w-full bg-[#2d3748] border-[#4a5568] text-white focus:ring-2 focus:ring-indigo-500">
              <SelectValue placeholder="Select a stock" />
            </SelectTrigger>
            <SelectContent className="bg-[#2d3748] border-[#4a5568] text-white">
              {stocksList.map((stock) => (
                <SelectItem key={stock} value={stock}>
                  {stock}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-right w-full sm:w-auto">
          <p className="text-sm font-medium text-gray-300">Current Price:</p>
          <p className="text-2xl font-bold text-green-400">${currentPrice.toFixed(2)}</p>
        </div>
      </div>
      <div className="relative flex-grow w-full h-full min-h-[200px] bg-[#1f2937] rounded-lg p-4">
        <Line ref={chartRef} data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default StockChartApp;