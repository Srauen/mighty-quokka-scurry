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
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStockData } from '@/hooks/use-stock-data';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

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
    const data = stockData[stock]?.prices || [];
    const labels = stockData[stock]?.labels || [];

    let startIndex = 0;
    if (timeframe === 'week') {
      startIndex = Math.max(0, data.length - 7);
    } else if (timeframe === 'month') {
      startIndex = Math.max(0, data.length - 30);
    } else if (timeframe === 'year') {
      startIndex = Math.max(0, data.length - 365);
    }

    return data.slice(startIndex).map((price, index) => ({
      date: labels[startIndex + index],
      [stock]: price,
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
      const dataPoint: { date: string; [key: string]: any } = { date };
      selectedStocks.forEach(stock => {
        const stockItems = getChartDataForTimeframe(stock, selectedTimeframe);
        const item = stockItems.find(si => si.date === date);
        dataPoint[stock] = item ? item[stock] : null; // Use null for missing data points
      });
      return dataPoint;
    });
  }, [selectedStocks, selectedTimeframe, stockData]);


  const formatYAxisPrice = (value: number) => `$${value.toFixed(2)}`;
  const formatTooltipLabel = (value: string) => `Date: ${value}`;
  const formatTooltipValue = (value: number, name: string) => {
    if (value === null) return ['N/A', name];
    return [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, name];
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

  return (
    <Card className="bg-gray-800 border border-gray-700 shadow-lg col-span-full lg:col-span-2 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-gray-700">
        <CardTitle className="text-lg font-semibold text-green-400">Stock Performance</CardTitle>
        <div className="flex items-center space-x-4">
          <Select value={selectedTimeframe} onValueChange={(value) => setSelectedTimeframe(value as 'week' | 'month' | 'year')}>
            <SelectTrigger className="w-[120px] bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white z-[9999]">
              <SelectItem value="week">1 Week</SelectItem>
              <SelectItem value="month">1 Month</SelectItem>
              <SelectItem value="year">1 Year</SelectItem>
            </SelectContent>
          </Select>
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
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={combinedChartData}
              margin={{
                top: 10,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <CartesianGrid
                horizontal={false}
                vertical={true}
                strokeDasharray="3 3"
                stroke="hsl(var(--muted-foreground) / 0.3)"
              />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={formatYAxisPrice}
                tickLine={false}
                axisLine={false}
                domain={['auto', 'auto']}
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
                  dataKey={stock}
                  stroke={chartColors[index % chartColors.length]}
                  fillOpacity={0.3}
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
      </CardContent>
    </Card>
  );
};

export default DashboardChart;