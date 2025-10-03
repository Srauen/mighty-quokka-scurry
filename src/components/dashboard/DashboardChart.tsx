"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartData } from '@/types/dashboard';

interface DashboardChartProps {
  chartData: ChartData;
}

const DashboardChart: React.FC<DashboardChartProps> = ({ chartData }) => {
  // The chartData prop now directly contains the data for the "peak" stock
  // We'll default to 'week' data as it's the most frequently updated in our simulation
  const data = chartData.week;

  const formatYAxisPrice = (value: number) => `$${value.toFixed(2)}`; // Show two decimal places for price
  const formatYAxisVolume = (value: number) => `${(value / 1000).toFixed(0)}k`;
  const formatTooltipLabel = (value: string) => `Time: ${value}`; // Label for time
  const formatTooltipValue = (value: number, name: string) => {
    let formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    if (name === 'price') return [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, formattedName];
    if (name === 'volume') return [`${value.toLocaleString()} units`, formattedName];
    if (name === 'sentiment') return [`${value}%`, formattedName];
    return [`${value.toLocaleString()}`, formattedName];
  };

  return (
    <Card className="bg-card border border-border shadow-sm col-span-full lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-foreground">Peak Stock Performance</CardTitle>
        {/* Removed time period selector as it's now dynamically showing peak stock */}
      </CardHeader>
      <CardContent className="h-[350px] p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
            <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" tickFormatter={formatYAxisPrice} />
            <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" tickFormatter={formatYAxisVolume} />
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
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="price"
              stroke="hsl(var(--chart-1))"
              activeDot={{ r: 8 }}
              strokeWidth={2}
              name="Price"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="volume"
              stroke="hsl(var(--chart-2))"
              activeDot={{ r: 8 }}
              strokeWidth={2}
              name="Volume"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="sentiment"
              stroke="hsl(var(--chart-3))"
              activeDot={{ r: 8 }}
              strokeWidth={2}
              name="Sentiment"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DashboardChart;