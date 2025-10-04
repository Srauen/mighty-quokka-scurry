"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { useStockData } from '@/hooks/use-stock-data';

interface PortfolioOverviewCardProps {
  cashBalance: number;
  portfolio: { [key: string]: number };
}

const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#0088FE', '#8884d8', '#82ca9d']; // Green, Yellow, Orange, Blue, Purple, Light Green

const PortfolioOverviewCard: React.FC<PortfolioOverviewCardProps> = ({ cashBalance, portfolio }) => {
  const { stockData } = useStockData();

  const portfolioAssets = Object.keys(portfolio).map(stock => {
    const quantity = portfolio[stock];
    const lastPrice = stockData[stock]?.lastPrice || 0;
    return {
      name: stock,
      value: quantity * lastPrice,
      quantity: quantity,
      lastPrice: lastPrice,
    };
  }).filter(asset => asset.value > 0);

  const totalPortfolioValue = portfolioAssets.reduce((sum, asset) => sum + asset.value, 0);
  const totalBalance = cashBalance + totalPortfolioValue;

  // For simplicity, let's simulate a daily profit/loss
  const simulatedDailyProfitLoss = parseFloat(((Math.random() - 0.5) * 0.02 * totalBalance).toFixed(2)); // +/- 1% of total balance
  const profitLossType = simulatedDailyProfitLoss >= 0 ? 'positive' : 'negative';
  const profitLossBadgeVariant = profitLossType === 'positive' ? 'default' : 'destructive'; // Using default for positive, destructive for negative
  const profitLossSign = simulatedDailyProfitLoss >= 0 ? '+' : '';

  const pieChartData = portfolioAssets.map(asset => ({
    name: asset.name,
    value: asset.value,
  }));

  // Add cash to the pie chart if it's a significant portion
  if (cashBalance > 0) {
    pieChartData.push({ name: 'Cash', value: cashBalance });
  }

  return (
    <Card className="bg-gray-800 border border-gray-700 text-white shadow-lg flex flex-col">
      <CardHeader className="p-4 border-b border-gray-700">
        <CardTitle className="text-lg font-semibold text-green-400">Portfolio Overview</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-4 flex flex-col justify-between">
        <div className="mb-4">
          <p className="text-gray-400 text-sm">Total Balance</p>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-white">${totalBalance.toFixed(2)}</span>
            <Badge variant={profitLossBadgeVariant} className={`text-sm px-3 py-1 ${profitLossType === 'positive' ? 'bg-green-600' : 'bg-red-600'}`}>
              {profitLossSign}{simulatedDailyProfitLoss.toFixed(2)}
            </Badge>
          </div>
        </div>

        <div className="h-[200px] w-full">
          {pieChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  labelLine={false}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '0.5rem',
                    color: 'hsl(var(--foreground))'
                  }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                  formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, name]}
                />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  wrapperStyle={{ right: -20, fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">No assets in portfolio.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioOverviewCard;