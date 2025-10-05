"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  Legend,
  BarChart, // Added for volume chart
  Bar,      // Added for volume chart
} from 'recharts';
import { Button } from '@/components/ui/button'; // Using Button for timeframe selection
import { useStockData } from '@/hooks/use-stock-data';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils'; // For conditional class names

interface DashboardChartProps {
  initialStocks: string[];
}

const DashboardChart: React.FC<DashboardChartProps> = ({ initialStocks }) => {
  const { stockData, stocksList } = useStockData();
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'year'>('week');
  const [selectedStocks, setSelectedStocks] = useState<string[]>(initialStocks);

  const chartColors = [
    'hsl(var(--chart-1))', // Green
    'hsl(var(--chart-2))', // Blue
    'hsl(var(--chart-3))', // Yellow
    'hsl(var(--chart-4))', // Purple
    'hsl(var(--chart-5))', // Orange
  ];

  const getChartDataForTimeframe = (stock: string, timeframe: 'week' | 'month' | 'year') => {
    const data = stockData[stock];
    if (!data) return [];

    const { prices, labels, volumes, sentiments } = data;

    let startIndex = 0;
    if (timeframe === 'week') {
      startIndex = Math.max(0, prices.length - 7);
    } else if (timeframe === 'month') {
      startIndex = Math.max(0, prices.length - 30);
    } else if (timeframe === 'year') {
      startIndex = Math.max(0, prices.length - 365);
    }

    return prices.slice(startIndex).map((price, index) => ({
      date: labels[startIndex + index],
      price: price,
      volume: volumes[startIndex + index],
      sentiment: sentiments[startIndex + index],
    }));
  };

  const combinedChartData = React.useMemo(() => {
    if (selectedStocks.length === 0) return [];

    const allDates = new Set<string>();
    selectedStocks.forEach(stock => {
      getChartDataForTimeframe(stock, selectedTimeframe).forEach(item => allDates.add(item.date));
    });

    const sortedDates = Array.from(allDates).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    return sortedDates.map(date => {
      const dataPoint: { date: string; [key: string]: any; totalVolume?: number; avgSentiment?: number } = { date };
      let currentTotalVolume = 0;
      let currentSentimentSum = 0;
      let sentimentCount = 0;

      selectedStocks.forEach(stock => {
        const stockItems = getChartDataForTimeframe(stock, selectedTimeframe);
        const item = stockItems.find(si => si.date === date);
        dataPoint[`${stock}Price`] = item ? item.price : null;
        // For volume, we'll use the total volume for the first selected stock for simplicity in the combined chart
        // If multiple stocks are selected, we'll sum their volumes for the totalVolume property
        if (item && item.volume !== null) {
          currentTotalVolume += item.volume;
        }
        if (item && item.sentiment !== null) {
          currentSentimentSum += item.sentiment;
          sentimentCount++;
        }
      });
      dataPoint.totalVolume = currentTotalVolume; // Aggregate volume
      dataPoint.avgSentiment = sentimentCount > 0 ? currentSentimentSum / sentimentCount : null; // Average sentiment
      return dataPoint;
    });
  }, [selectedStocks, selectedTimeframe, stockData]);

  const formatYAxisPrice = (value: number) => `$${value.toFixed(2)}`;
  const formatYAxisVolume = (value: number) => {
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
    return value.toString();
  };
  const formatTooltipLabel = (value: string) => `Date: ${value}`;
  const formatTooltipValue = (value: number, name: string) => {
    if (value === null) return ['N/A', name];
    if (name.includes('Price')) {
      return [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, name.replace('Price', ' Price')];
    }
    if (name === 'totalVolume') {
      return [`${value.toLocaleString()}`, 'Volume'];
    }
    return [`${value.toLocaleString()}`, name];
  };

  const handleStockSelection = (stock: string, checked: boolean) => {
    setSelectedStocks(prev => {
      if (checked) {
        return [...prev, stock];
      } else {
        return prev.filter(s => s !== stock);
      }
    });
  };

  // Get data for the info panel (first selected stock)
  const firstSelectedStock = selectedStocks[0];
  const currentStockTimeSeries = firstSelectedStock ? getChartDataForTimeframe(firstSelectedStock, selectedTimeframe) : [];

  const openPrice = currentStockTimeSeries.length > 0 ? currentStockTimeSeries[0].price : 0;
  const highPrice = currentStockTimeSeries.length > 0 ? Math.max(...currentStockTimeSeries.map(item => item.price)) : 0;
  const lowPrice = currentStockTimeSeries.length > 0 ? Math.min(...currentStockTimeSeries.map(item => item.price)) : 0;
  const totalVolume = currentStockTimeSeries.length > 0 ? currentStockTimeSeries.reduce((sum, item) => sum + item.volume, 0) : 0;
  const lastPrice = firstSelectedStock && stockData[firstSelectedStock] ? stockData[firstSelectedStock].lastPrice : 0;
  const dailyChange = firstSelectedStock && stockData[firstSelectedStock] ? stockData[firstSelectedStock].dailyChange : 0;


  const timeframeOptions = [
    { value: 'week', label: '1W' },
    { value: 'month', label: '1M' },
    { value: 'year', label: '1Y' },
  ];

  return (
    <Card className="bg-gray-800 border border-gray-700 shadow-lg col-span-full lg:col-span-2 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-gray-700">
        <CardTitle className="text-lg font-semibold text-green-400">Stock Performance</CardTitle>
        <div className="flex items-center space-x-2">
          {timeframeOptions.map((option) => (
            <Button
              key={option.value}
              variant="ghost"
              size="sm"
              onClick={() => setSelectedTimeframe(option.value as 'week' | 'month' | 'year')}
              className={cn(
                "text-gray-400 hover:text-white",
                selectedTimeframe === option.value && "bg-gray-700 text-white"
              )}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
          {stocksList.slice(0, 5).map((stock) => ( // Limit to first 5 for brevity
            <div key={stock} className="flex items-center space-x-2">
              <Checkbox
                id={`stock-${stock}`}
                checked={selectedStocks.includes(stock)}
                onCheckedChange={(checked: boolean) => handleStockSelection(stock, checked)}
                className="border-gray-500 data-[state=checked]:bg-green-500 data-[state=checked]:text-white"
              />
              <Label htmlFor={`stock-${stock}`} className="text-gray-300">{stock}</Label>
            </div>
          ))}
        </div>
        <div className="h-[250px] w-full"> {/* Reduced height for price chart */}
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={combinedChartData}
              margin={{
                top: 10,
                right: 10,
                left: 10,
                bottom: 0,
              }}
              syncId="stockChartSync" // Sync ID for price and volume charts
            >
              <CartesianGrid
                horizontal={true} // Keep horizontal gridlines
                vertical={false} // Remove vertical gridlines for cleaner look
                strokeDasharray="3 3"
                stroke="hsl(var(--muted-foreground) / 0.1)" // Very subtle grid
              />
              <XAxis dataKey="date" hide /> {/* Hide X-axis for price chart */}
              <YAxis
                orientation="right" // Y-axis on the right
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={formatYAxisPrice}
                tickLine={false}
                axisLine={false}
                domain={['auto', 'auto']}
                width={60} // Give some width for labels
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
              <Legend />
              {selectedStocks.map((stock, index) => (
                <Area
                  key={stock}
                  type="monotone"
                  dataKey={`${stock}Price`} // Use specific dataKey for price
                  stroke={chartColors[index % chartColors.length]}
                  fillOpacity={0.4} // Increased opacity for more vibrant fill
                  fill={`url(#color${stock})`}
                  strokeWidth={2}
                  name={`${stock} Price`}
                  dot={false}
                >
                  <defs>
                    <linearGradient id={`color${stock}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColors[index % chartColors.length]} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={chartColors[index % chartColors.length]} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                </Area>
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Volume Chart */}
        <div className="h-[100px] w-full mt-2"> {/* Smaller height for volume chart */}
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={combinedChartData}
              margin={{
                top: 0,
                right: 10,
                left: 10,
                bottom: 0,
              }}
              syncId="stockChartSync" // Sync ID for price and volume charts
            >
              <CartesianGrid
                horizontal={false} // No horizontal gridlines for volume
                vertical={false} // No vertical gridlines for volume
                strokeDasharray="3 3"
                stroke="hsl(var(--muted-foreground) / 0.1)"
              />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                tickLine={false}
                axisLine={false}
                minHeight={20}
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                orientation="right" // Y-axis on the right
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={formatYAxisVolume}
                tickLine={false}
                axisLine={false}
                domain={['auto', 'auto']}
                width={60} // Give some width for labels
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
              <Bar dataKey="totalVolume" fill="hsl(var(--chart-3))" opacity={0.6} name="Volume" /> {/* Changed to chart-3 for distinct color */}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Key Metrics Display */}
        {firstSelectedStock && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-300 border-t border-gray-700 pt-4">
            <div>
              <p className="font-medium text-gray-400">Open</p>
              <p className="text-white">${openPrice.toFixed(2)}</p>
            </div>
            <div>
              <p className="font-medium text-gray-400">High</p>
              <p className="text-white">${highPrice.toFixed(2)}</p>
            </div>
            <div>
              <p className="font-medium text-gray-400">Low</p>
              <p className="text-white">${lowPrice.toFixed(2)}</p>
            </div>
            <div>
              <p className="font-medium text-gray-400">Volume</p>
              <p className="text-white">{formatYAxisVolume(totalVolume)}</p>
            </div>
            {/* Add more metrics here if available, e.g., P/E, Mkt Cap */}
            <div>
              <p className="font-medium text-gray-400">Last Price</p>
              <p className="text-white">${lastPrice.toFixed(2)}</p>
            </div>
            <div>
              <p className="font-medium text-gray-400">Daily Change</p>
              <p className={cn("text-white", dailyChange >= 0 ? "text-green-500" : "text-red-500")}>
                {dailyChange >= 0 ? '+' : ''}{dailyChange.toFixed(2)}%
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardChart;