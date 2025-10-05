"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, List, LayoutGrid, TrendingUp, TrendingDown, Star } from 'lucide-react';
import { mockNotifications } from '@/lib/mockData'; // Reusing mock notifications
import { useStockData } from '@/hooks/use-stock-data';
import { cn } from '@/lib/utils';

const DashboardSidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState('watchlist');
  const { stockData, stocksList } = useStockData();

  // For the watchlist, let's pick a few prominent stocks
  const watchlistStocks = ['AAPL', 'TSLA', 'MSFT', 'AMZN', 'NVDA'];

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-700 p-4 flex flex-col shadow-lg z-20">
      <div className="flex justify-around mb-4 border-b border-gray-700 pb-2">
        <Button
          variant="ghost"
          className={cn("text-gray-400 hover:text-blue-400", activeTab === 'watchlist' && "text-blue-400 border-b-2 border-blue-400")}
          onClick={() => setActiveTab('watchlist')}
        >
          <List className="mr-2 h-4 w-4" /> Watchlist
        </Button>
        <Button
          variant="ghost"
          className={cn("text-gray-400 hover:text-blue-400", activeTab === 'alerts' && "text-blue-400 border-b-2 border-blue-400")}
          onClick={() => setActiveTab('alerts')}
        >
          <Bell className="mr-2 h-4 w-4" /> Alerts
        </Button>
        {/* Heatmap is a placeholder for now */}
        <Button
          variant="ghost"
          className={cn("text-gray-400 hover:text-blue-400", activeTab === 'heatmap' && "text-blue-400 border-b-2 border-blue-400")}
          onClick={() => setActiveTab('heatmap')}
        >
          <LayoutGrid className="mr-2 h-4 w-4" /> Heatmap
        </Button>
      </div>

      <div className="flex-grow overflow-y-auto custom-scrollbar">
        {activeTab === 'watchlist' && (
          <Card className="bg-gray-800 border border-gray-700 text-white mb-4">
            <CardHeader className="p-3 border-b border-gray-700">
              <CardTitle className="text-md font-semibold text-blue-400">My Watchlist</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <ul className="space-y-2">
                {watchlistStocks.map((symbol) => {
                  const data = stockData[symbol];
                  const lastPrice = data?.lastPrice || 0;
                  const dailyChange = data?.dailyChange || 0;
                  const isPositive = dailyChange >= 0;

                  return (
                    <li key={symbol} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span className="font-medium text-gray-300">{symbol}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-white">${lastPrice.toFixed(2)}</span>
                        <span className={cn(isPositive ? "text-green-500" : "text-red-500", "flex items-center")}>
                          {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {dailyChange.toFixed(2)}%
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        )}

        {activeTab === 'alerts' && (
          <Card className="bg-gray-800 border border-gray-700 text-white mb-4">
            <CardHeader className="p-3 border-b border-gray-700">
              <CardTitle className="text-md font-semibold text-blue-400">Recent Alerts</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <ul className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                {mockNotifications.length === 0 ? (
                  <p className="text-gray-400 text-sm">No new alerts.</p>
                ) : (
                  mockNotifications.slice(0, 5).map((notification) => ( // Show top 5 alerts
                    <li key={notification.id} className={`flex items-start space-x-2 text-sm ${notification.read ? 'text-gray-500' : 'text-gray-300'}`}>
                      <Bell className={`h-4 w-4 ${notification.read ? 'text-gray-500' : 'text-blue-400'} flex-shrink-0 mt-0.5`} />
                      <div>
                        <p>{notification.message}</p>
                        <span className="text-xs text-gray-500">{notification.timestamp}</span>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </CardContent>
          </Card>
        )}

        {activeTab === 'heatmap' && (
          <Card className="bg-gray-800 border border-gray-700 text-white mb-4">
            <CardHeader className="p-3 border-b border-gray-700">
              <CardTitle className="text-md font-semibold text-blue-400">Market Heatmap</CardTitle>
            </CardHeader>
            <CardContent className="p-3 text-gray-400 text-sm">
              <p>Market heatmap visualization coming soon!</p>
              <p className="mt-2">This section will display a visual representation of market performance across different sectors or stocks.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </aside>
  );
};

export default DashboardSidebar;