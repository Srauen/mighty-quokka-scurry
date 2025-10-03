"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartData, TimePeriod } from '@/types/dashboard';
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
import { format } from 'date-fns';

interface DashboardChartProps {
  chartData: ChartData;
}

const DashboardChart: React.FC<DashboardChartProps> = ({ chartData }) => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('week');

  const data = chartData[timePeriod];

  const formatYAxisPrice = (value: number) => `$${value.toFixed(0)}`;
  const formatYAxisVolume = (value: number) => `${(value / 1000).toFixed(0)}k`;
  const formatTooltipLabel = (value: string) => `Period: ${value}`;
  const formatTooltipValue = (value: number, name: string) => {
    let formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    if (name === 'price') return [`$${value.toLocaleString()}`, formattedName];
    if (name === 'volume') return [`${value.toLocaleString()} units`, formattedName];
    if (name === 'sentiment') return [`${value}%`, formattedName];
    return [`${value.toLocaleString()}`, formattedName];
  };

  return (
    <Card className="bg-card border border-border shadow-sm col-span-full lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-foreground">Stock Performance Overview</CardTitle>
        <Select value={timePeriod} onValueChange={(value: TimePeriod) => setTimePeriod(value)}>
          <SelectTrigger className="w-[120px] bg-input border-border text-foreground">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border text-foreground">
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="year">Year</SelectItem>
          </SelectContent>
        </Select>
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