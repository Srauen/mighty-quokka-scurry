"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useStockData } from '@/hooks/use-stock-data';
import { cn } from '@/lib/utils';

const TopMoversPanel: React.FC = () => {
  const { stockData, stocksList } = useStockData();
  const [topMovers, setTopMovers] = useState<Array<{ symbol: string; price: number; change: number }>>([]);

  useEffect(() => {
    const calculateTopMovers = () => {
      const movers = stocksList.map(symbol => {
        const data = stockData[symbol];
        if (data) {
          return {
            symbol,
            price: data.lastPrice,
            change: data.dailyChange,
          };
        }
        return null;
      }).filter(Boolean) as Array<{ symbol: string; price: number; change: number }>;

      // Sort by absolute change to find top movers (both up and down)
      movers.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));

      setTopMovers(movers.slice(0, 5)); // Get top 5 movers
    };

    calculateTopMovers();
    const interval = setInterval(calculateTopMovers, 5000); // Recalculate every 5 seconds

    return () => clearInterval(interval);
  }, [stockData, stocksList]);

  return (
    <Card className="bg-gray-800 border border-gray-700 text-white shadow-lg">
      <CardHeader className="p-4 border-b border-gray-700">
        <CardTitle className="text-lg font-semibold text-green-400">Top Movers (Today)</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700">
              <TableHead className="text-gray-400">Stock</TableHead>
              <TableHead className="text-right text-gray-400">Price</TableHead>
              <TableHead className="text-right text-gray-400">Change (%)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topMovers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-gray-400">No top movers available.</TableCell>
              </TableRow>
            ) : (
              topMovers.map((mover) => (
                <TableRow key={mover.symbol} className="border-gray-800 hover:bg-gray-700">
                  <TableCell className="font-medium text-gray-300">{mover.symbol}</TableCell>
                  <TableCell className="text-right text-white">${mover.price.toFixed(2)}</TableCell>
                  <TableCell className={cn(
                    "text-right flex items-center justify-end",
                    mover.change >= 0 ? "text-green-500" : "text-red-500"
                  )}>
                    {mover.change >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                    {mover.change.toFixed(2)}%
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TopMoversPanel;