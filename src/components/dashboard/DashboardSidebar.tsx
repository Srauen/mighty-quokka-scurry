"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, List, LayoutGrid, TrendingUp, TrendingDown, Star, LayoutDashboard, Brain, Settings, ChevronLeft, ChevronRight } from 'lucide-react'; // Added LayoutDashboard, Brain, Settings, Chevron icons
import { mockNotifications } from '@/lib/mockData'; // Reusing mock notifications
import { useStockData } from '@/hooks/use-stock-data';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom'; // Import Link for navigation

const DashboardSidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { stockData, stocksList } = useStockData();

  const watchlistStocks = ['AAPL', 'TSLA', 'MSFT', 'AMZN', 'NVDA'];

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', link: '/dashboard' },
    { id: 'watchlist', icon: Star, label: 'Watchlist' },
    { id: 'ai-insights', icon: Brain, label: 'AI Insights' },
    { id: 'alerts', icon: Bell, label: 'Alerts' },
    { id: 'heatmap', icon: LayoutGrid, label: 'Heatmap' },
    { id: 'settings', icon: Settings, label: 'Settings', link: '/dashboard/settings' },
  ];

  return (
    <aside className={cn(
      "bg-gray-900 border-r border-gray-700 p-4 flex flex-col shadow-lg z-20 transition-all duration-300 ease-in-out",
      isCollapsed ? "w-20 items-center" : "w-64"
    )}>
      <div className={cn("flex items-center mb-6", isCollapsed ? "justify-center" : "justify-end")}>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-400 hover:text-electric-blue"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      <nav className="flex-grow space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.id}
            to={item.link || '#'} // Use link if available, otherwise a placeholder
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex items-center py-2 px-3 rounded-md text-soft-white transition-colors duration-200 group",
              activeTab === item.id ? "bg-gray-800 text-electric-blue animate-glow-subtle" : "hover:bg-gray-800 hover:text-electric-blue"
            )}
          >
            <item.icon className={cn("h-5 w-5", isCollapsed ? "mr-0" : "mr-3", activeTab === item.id ? "text-electric-blue" : "text-gray-400 group-hover:text-electric-blue")} />
            {!isCollapsed && (
              <span className={cn("text-sm font-medium", activeTab === item.id ? "text-electric-blue" : "text-soft-white group-hover:text-electric-blue")}>
                {item.label}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {!isCollapsed && (
        <div className="mt-auto pt-4 border-t border-gray-700">
          {activeTab === 'watchlist' && (
            <Card className="glassmorphic-card text-soft-white mb-4">
              <CardHeader className="p-3 border-b border-gray-700">
                <CardTitle className="text-md font-semibold text-electric-blue">My Watchlist</CardTitle>
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
                          <Star className="h-4 w-4 text-teal" />
                          <span className="font-medium text-soft-white">{symbol}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-soft-white">${lastPrice.toFixed(2)}</span>
                          <span className={cn(isPositive ? "text-teal" : "text-red-500", "flex items-center")}>
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
            <Card className="glassmorphic-card text-soft-white mb-4">
              <CardHeader className="p-3 border-b border-gray-700">
                <CardTitle className="text-md font-semibold text-electric-blue">Recent Alerts</CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <ul className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                  {mockNotifications.length === 0 ? (
                    <p className="text-gray-400 text-sm">No new alerts.</p>
                  ) : (
                    mockNotifications.slice(0, 5).map((notification) => (
                      <li key={notification.id} className={`flex items-start space-x-2 text-sm ${notification.read ? 'text-gray-500' : 'text-soft-white'}`}>
                        <Bell className={`h-4 w-4 ${notification.read ? 'text-gray-500' : 'text-teal'} flex-shrink-0 mt-0.5`} />
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

          {activeTab === 'ai-insights' && (
            <Card className="glassmorphic-card text-soft-white mb-4">
              <CardHeader className="p-3 border-b border-gray-700">
                <CardTitle className="text-md font-semibold text-electric-blue">AI Insights Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-3 text-gray-400 text-sm">
                <p>Quick summary of top AI insights.</p>
                <p className="mt-2">View full insights in the main panel.</p>
              </CardContent>
            </Card>
          )}

          {activeTab === 'heatmap' && (
            <Card className="glassmorphic-card text-soft-white mb-4">
              <CardHeader className="p-3 border-b border-gray-700">
                <CardTitle className="text-md font-semibold text-electric-blue">Market Heatmap</CardTitle>
              </CardHeader>
              <CardContent className="p-3 text-gray-400 text-sm">
                <p>Market heatmap visualization coming soon!</p>
                <p className="mt-2">This section will display a visual representation of market performance across different sectors or stocks.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </aside>
  );
};

export default DashboardSidebar;