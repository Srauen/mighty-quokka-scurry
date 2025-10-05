"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronLeft, Star, TrendingUp, TrendingDown } from 'lucide-react';
import { useStockData } from '@/hooks/use-stock-data';
import { cn } from '@/lib/utils';

const WatchlistPage: React.FC = () => {
  const { stockData, stocksList } = useStockData();
  // For demonstration, let's use a fixed set of watchlist stocks. In a real app, this would come from user data.
  const userWatchlist = ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMZN', 'NVDA', 'NFLX'];

  const watchlistDetails = userWatchlist
    .map(symbol => {
      const data = stockData[symbol];
      if (data) {
        const lastPrice = data.lastPrice;
        const dailyChange = data.dailyChange;
        const openPrice = data.prices[0]; // Assuming first price in data is daily open
        const highPrice = Math.max(...data.prices);
        const lowPrice = Math.min(...data.prices);
        const volume = data.volumes[data.volumes.length - 1]; // Latest volume
        return {
          symbol,
          lastPrice,
          dailyChange,
          openPrice,
          highPrice,
          lowPrice,
          volume,
          isPositive: dailyChange >= 0,
        };
      }
      return null;
    })
    .filter(Boolean); // Filter out any nulls if stockData isn't ready

  return (
    <div className="flex flex-col min-h-screen bg-[#0B0B0B] text-soft-white p-6 font-mono">
      <div className="w-full max-w-6xl mx-auto mb-6 flex items-center justify-between">
        <Link to="/dashboard">
          <Button variant="ghost" className="text-gray-400 hover:text-electric-blue">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </Link>
      </div>

      <Card className="w-full max-w-6xl mx-auto glassmorphic-card flex flex-col flex-grow">
        <CardHeader className="p-6 border-b border-gray-700">
          <CardTitle className="text-3xl font-bold text-electric-blue flex items-center space-x-3">
            <Star className="h-7 w-7 text-teal" />
            <span>My Watchlist</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow p-6 overflow-y-auto custom-scrollbar">
          {watchlistDetails.length === 0 ? (
            <p className="text-gray-400 text-lg text-center py-10">Your watchlist is empty. Add some stocks!</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-400">Symbol</TableHead>
                  <TableHead className="text-right text-gray-400">Last Price</TableHead>
                  <TableHead className="text-right text-gray-400">Change (%)</TableHead>
                  <TableHead className="text-right text-gray-400">Open</TableHead>
                  <TableHead className="text-right text-gray-400">High</TableHead>
                  <TableHead className="text-right text-gray-400">Low</TableHead>
                  <TableHead className="text-right text-gray-400">Volume</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {watchlistDetails.map((stock) => (
                  <TableRow key={stock.symbol} className="border-gray-800 hover:bg-gray-700">
                    <TableCell className="font-medium text-soft-white">{stock.symbol}</TableCell>
                    <TableCell className="text-right text-soft-white">${stock.lastPrice.toFixed(2)}</TableCell>
                    <TableCell className={cn(
                      "text-right flex items-center justify-end",
                      stock.isPositive ? "text-teal" : "text-red-500"
                    )}>
                      {stock.isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                      {stock.dailyChange.toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right text-gray-300">${stock.openPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right text-gray-300">${stock.highPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right text-gray-300">${stock.lowPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right text-gray-300">{stock.volume.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WatchlistPage;