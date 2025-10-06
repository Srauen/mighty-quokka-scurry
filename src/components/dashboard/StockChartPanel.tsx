"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { useStockData } from '@/hooks/use-stock-data';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Import Button for timeframe selection

interface StockChartPanelProps {
  stockSymbol: string;
}

const StockChartPanel: React.FC<StockChartPanelProps> = ({ stockSymbol }) => {
  const { stockData } = useStockData();
  const [aiScore, setAiScore] = useState<number>(() => parseFloat((Math.random() * (95 - 60) + 60).toFixed(0))); // Initial random score 60-95
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1D');

  useEffect(() => {
    // Simulate AI score updates
    const scoreInterval = setInterval(() => {
      setAiScore(prevScore => {
        const change = (Math.random() - 0.5) * 5; // +/- 2.5 points
        let newScore = prevScore + change;
        newScore = Math.max(50, Math.min(99, newScore)); // Keep between 50 and 99
        return parseFloat(newScore.toFixed(0));
      });
    }, 10000); // Update every 10 seconds

    return () => clearInterval(scoreInterval);
  }, []);

  const data = stockData[stockSymbol];

  // Filter data based on selected timeframe
  const getFilteredChartData = () => {
    if (!data) return [];
    const { prices, labels, volumes } = data;
    let startIndex = 0;

    switch (selectedTimeframe) {
      case '1D':
        startIndex = Math.max(0, prices.length - 20); // Last 20 points for "1 Day"
        break;
      case '1W':
        startIndex = Math.max(0, prices.length - 50); // Last 50 points for "1 Week"
        break;
      case '1M':
        startIndex = Math.max(0, prices.length - 100); // Last 100 points for "1 Month"
        break;
      case '1Y':
        startIndex = Math.max(0, prices.length - 365); // Last 365 points for "1 Year"
        break;
    }

    return prices.slice(startIndex).map((price, index) => ({
      date: labels[startIndex + index],
      price: price,
      volume: volumes[startIndex + index],
    }));
  };

  const chartData = getFilteredChartData();

  const formatYAxisPrice = (value: number) => `$${value.toFixed(2)}`;
  const formatYAxisVolume = (value: number) => {
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
    return value.toString();
  };
  const formatTooltipLabel = (value: string) => `Date: ${value}`;
  const formatTooltipValue = (value: number, name: string) => {
    if (name === 'Price') {
      return [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, name];
    }
    if (name === 'Volume') {
      return [`${value.toLocaleString()}`, name];
    }
    return [`${value.toLocaleString()}`, name];
  };

  const lastPrice = data?.lastPrice || 0;
  const dailyChange = data?.dailyChange || 0;
  const isPositiveChange = dailyChange >= 0;

  const chartColor = 'hsl(var(--primary))'; // Using primary for neon blue accent

  const timeframeOptions = ['1D', '1W', '1M', '1Y'];

  return (
    <Card className="glassmorphic-card flex flex-col animate-glow-subtle hover:ring-2 hover:ring-electric-blue transition-all duration-200">
      <CardHeader className="p-4 border-b border-gray-700 flex flex-row items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Placeholder for Company Logo */}
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-xs font-bold text-soft-white">
            {stockSymbol.substring(0, 2)}
          </div>
          <CardTitle className="text-lg font-semibold text-soft-white flex items-center space-x-2">
            <span>{stockSymbol}</span>
            <span className={cn(
              "text-sm font-medium flex items-center",
              isPositiveChange ? "text-teal" : "text-red-500"
            )}>
              ${lastPrice.toFixed(2)}
              {isPositiveChange ? <TrendingUp className="h-4 w-4 ml-1" /> : <TrendingDown className="h-4 w-4 ml-1" />}
              {dailyChange.toFixed(2)}%
            </span>
          </CardTitle>
        </div>
        <div className="text-sm text-gray-400">
          AI Score: <span className={cn("font-bold", aiScore > 75 ? "text-teal" : aiScore > 60 ? "text-yellow-400" : "text-red-400")}>
            {aiScore}%
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        {/* Mini Toolbar for Timeframes */}
        <div className="flex justify-end space-x-1 mb-3">
          {timeframeOptions.map(tf => (
            <Button
              key={tf}
              variant="ghost"
              size="sm"
              onClick={() => setSelectedTimeframe(tf as '1D' | '1W' | '1M' | '1Y')}
              className={cn(
                "h-7 px-3 text-xs text-gray-400 hover:text-electric-blue",
                selectedTimeframe === tf && "bg-gray-700 text-electric-blue"
              )}
            >
              {tf}
            </Button>
          ))}
        </div>

        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                horizontal={true}
                vertical={false}
                strokeDasharray="3 3"
                stroke="hsl(var(--muted-foreground) / 0.1)"
              />
              <XAxis dataKey="date" hide />
              <YAxis
                orientation="right"
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={formatYAxisPrice}
                tickLine={false}
                axisLine={false}
                domain={['auto', 'auto']}
                width={60}
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip
                formatter={formatTooltipValue}
                labelFormatter={formatTooltipLabel}
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '0.5rem',
                  color: 'hsl(var(--foreground))'
                }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={chartColor}
                fillOpacity={0.6}
                fill={`url(#colorPrice${stockSymbol})`}
                strokeWidth={2}
                name="Price"
                dot={false}
                animationDuration={800}
                animationEasing="ease-out"
              >
                <defs>
                  <linearGradient id={`colorPrice${stockSymbol}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </Area>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="h-[60px] w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                horizontal={false}
                vertical={false}
                strokeDasharray="3 3"
                stroke="hsl(var(--muted-foreground) / 0.1)"
              />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                tickLine={false}
                axisLine={false}
                height={20} // Changed minHeight to height
                tick={{ fontSize: 8, fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                orientation="right"
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={formatYAxisVolume}
                tickLine={false}
                axisLine={false}
                domain={['auto', 'auto']}
                width={40}
                tick={{ fontSize: 8, fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip
                formatter={formatTooltipValue}
                labelFormatter={formatTooltipLabel}
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '0.5rem',
                  color: 'hsl(var(--foreground))'
                }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Bar dataKey="volume" fill="hsl(var(--chart-3))" opacity={0.6} name="Volume" animationDuration={800} animationEasing="ease-out" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockChartPanel;