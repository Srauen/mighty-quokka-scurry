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
  ResponsiveContainer,
  Area, // Import Area for gradient fill
  AreaChart, // Use AreaChart for gradient fill
} from 'recharts';
import { ChartData } from '@/types/dashboard';

interface DashboardChartProps {
  chartData: ChartData;
}

const DashboardChart: React.FC<DashboardChartProps> = ({ chartData }) => {
  const data = chartData.week;

  // Format Y-axis for volume (e.g., 100K)
  const formatYAxisVolume = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  // Format Y-axis for price (e.g., $150.00)
  const formatYAxisPrice = (value: number) => `$${value.toFixed(2)}`;

  // Tooltip formatting
  const formatTooltipLabel = (value: string) => `Date: ${value}`;
  const formatTooltipValue = (value: number, name: string) => {
    let formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    if (name === 'price') return [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, formattedName];
    if (name === 'volume') return [`${value.toLocaleString()} units`, formattedName];
    if (name === 'sentiment') return [`${value.toLocaleString()}%`, formattedName];
    return [`${value.toLocaleString()}`, formattedName];
  };

  return (
    <Card className="bg-card border border-border shadow-sm col-span-full lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-foreground">Peak Stock Performance</CardTitle>
      </CardHeader>
      <CardContent className="h-[350px] p-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid
              horizontal={false} // Remove horizontal grid lines
              vertical={true} // Keep vertical grid lines
              strokeDasharray="4 4" // Dashed lines
              stroke="hsl(var(--muted-foreground) / 0.5)" // Light gray, slightly transparent
            />
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
            <YAxis
              yAxisId="left"
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={formatYAxisVolume}
              tickLine={false}
              axisLine={false}
              domain={[0, 'dataMax + (dataMax * 0.2)]']} // Add padding to top
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={formatYAxisPrice}
              tickLine={false}
              axisLine={false}
              domain={[0, 'dataMax + (dataMax * 0.2)]']} // Add padding to top
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
            {/* Volume Line (Green, filled) */}
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="volume"
              stroke="hsl(var(--chart-1))"
              fill="url(#colorVolume)"
              strokeWidth={2}
              name="Volume"
              dot={false} // No dots on the line
            />
            {/* Price Line (Blue, thin) */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="price"
              stroke="hsl(var(--chart-2))"
              activeDot={{ r: 4 }} // Smaller active dot
              strokeWidth={1.5}
              name="Price"
              dot={false} // No dots on the line
            />
            {/* Sentiment Line (Orange, thin) */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="sentiment"
              stroke="hsl(var(--chart-3))"
              activeDot={{ r: 4 }} // Smaller active dot
              strokeWidth={1.5}
              name="Sentiment"
              dot={false} // No dots on the line
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DashboardChart;