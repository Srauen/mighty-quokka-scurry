"use client";

import React, { useState, useEffect } from 'react';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import StockChartPanel from '@/components/dashboard/StockChartPanel';
import AIInsightsPanel from '@/components/dashboard/AIInsightsPanel';
import AlertsBar from '@/components/dashboard/AlertsBar';
import FloatingActionButtons from '@/components/dashboard/FloatingActionButtons';
import { useStockData } from '@/hooks/use-stock-data';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useSession } from '@/components/SessionContextProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Star, Brain, Bell, LayoutGrid, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockNotifications } from '@/lib/mockData'; // Reusing mock notifications for summary

const Dashboard: React.FC = () => {
  const { stockData, stocksList } = useStockData();
  const [userName, setUserName] = useState('Trader');
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | undefined>(undefined);
  const { session, isLoading: isSessionLoading } = useSession();

  // Stocks for the main dashboard overview charts
  const overviewCharts = ['AAPL', 'TSLA', 'MSFT']; // Fewer charts for a cleaner overview

  // For Watchlist Summary
  const watchlistStocks = ['GOOGL', 'AMZN']; // Example watchlist for summary
  const watchlistSummary = watchlistStocks.map(symbol => {
    const data = stockData[symbol];
    if (data) {
      return {
        symbol,
        lastPrice: data.lastPrice,
        dailyChange: data.dailyChange,
        isPositive: data.dailyChange >= 0,
      };
    }
    return null;
  }).filter(Boolean);

  // For Alerts Summary
  const unreadAlertsCount = mockNotifications.filter(n => !n.read).length;
  const latestAlert = mockNotifications.find(n => !n.read) || mockNotifications[0];

  // Fetch user profile and initial data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!session) return;

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        toast.error("Error", { description: "Failed to load user profile." });
      } else if (profileData) {
        setUserName(`${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || session.user.email || 'Trader');
        setUserAvatarUrl(profileData.avatar_url || undefined);
      } else {
        setUserName(session.user.email || 'Trader');
      }

      const { data: userData, error: userDataError } = await supabase
        .from('user_trading_data')
        .select('cash_balance, portfolio')
        .eq('user_id', session.user.id)
        .single();

      if (userDataError && userDataError.code !== 'PGRST116') {
        console.error('Error fetching user trading data:', userDataError);
        toast.error("Error", { description: "Failed to load trading data." });
      } else if (!userData) {
        await supabase.from('user_trading_data').insert({ user_id: session.user.id, cash_balance: 10000, portfolio: {} });
      }
    };

    if (!isSessionLoading && session) {
      fetchUserData();
    }
  }, [session, isSessionLoading]);

  if (isSessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-soft-white font-mono">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0B0B0B] text-soft-white font-mono">
      <DashboardNavbar userName={userName} userAvatarUrl={userAvatarUrl} />

      <div className="flex flex-grow overflow-hidden">
        <DashboardSidebar />

        <main className="flex-grow p-6 overflow-y-auto custom-scrollbar grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Overview Charts - 2 charts for a cleaner cockpit view */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:col-span-2">
            {overviewCharts.map(stock => (
              <StockChartPanel key={stock} stockSymbol={stock} />
            ))}
          </div>

          {/* Right Panel for Summaries and AI Insights */}
          <div className="xl:col-span-1 grid grid-cols-1 gap-6">
            {/* AI Insights Panel (full component) */}
            <AIInsightsPanel />

            {/* Watchlist Summary Card */}
            <Card className="glassmorphic-card flex flex-col animate-glow-subtle hover:ring-2 hover:ring-electric-blue transition-all duration-200">
              <CardHeader className="p-4 border-b border-gray-700 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold text-electric-blue flex items-center space-x-2">
                  <Star className="h-5 w-5 text-teal" />
                  <span>Watchlist Summary</span>
                </CardTitle>
                <Link to="/dashboard/watchlist">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-electric-blue">View All</Button>
                </Link>
              </CardHeader>
              <CardContent className="p-4">
                {watchlistSummary.length === 0 ? (
                  <p className="text-gray-400 text-sm">No stocks in watchlist. Add some!</p>
                ) : (
                  <ul className="space-y-2">
                    {watchlistSummary.map((stock) => (
                      <li key={stock.symbol} className="flex items-center justify-between text-sm">
                        <span className="font-medium text-soft-white">{stock.symbol}</span>
                        <div className="flex items-center space-x-1">
                          <span className="text-soft-white">${stock.lastPrice.toFixed(2)}</span>
                          <span className={cn(stock.isPositive ? "text-teal" : "text-red-500", "flex items-center")}>
                            {stock.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {stock.dailyChange.toFixed(2)}%
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* Alerts Summary Card */}
            <Card className="glassmorphic-card flex flex-col animate-glow-subtle hover:ring-2 hover:ring-electric-blue transition-all duration-200">
              <CardHeader className="p-4 border-b border-gray-700 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold text-electric-blue flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-teal" />
                  <span>Recent Alerts</span>
                </CardTitle>
                <Link to="/dashboard/alerts">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-electric-blue">
                    View All {unreadAlertsCount > 0 && `(${unreadAlertsCount} New)`}
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="p-4">
                {latestAlert ? (
                  <div className="flex items-start space-x-3 text-sm">
                    <Bell className={cn("h-4 w-4 flex-shrink-0 mt-0.5", latestAlert.read ? "text-gray-500" : "text-teal")} />
                    <div>
                      <p className={cn(latestAlert.read ? "text-gray-500" : "text-soft-white")}>{latestAlert.message}</p>
                      <span className="text-xs text-gray-500">{latestAlert.timestamp}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No recent alerts.</p>
                )}
              </CardContent>
            </Card>

            {/* Heatmap Summary Card */}
            <Card className="glassmorphic-card flex flex-col animate-glow-subtle hover:ring-2 hover:ring-electric-blue transition-all duration-200">
              <CardHeader className="p-4 border-b border-gray-700 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold text-electric-blue flex items-center space-x-2">
                  <LayoutGrid className="h-5 w-5 text-teal" />
                  <span>Market Heatmap</span>
                </CardTitle>
                <Link to="/dashboard/heatmap">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-electric-blue">View Heatmap</Button>
                </Link>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-gray-400 text-sm">A visual overview of market performance by sector or industry.</p>
                <p className="text-gray-500 text-xs mt-2">Click to explore detailed heatmap.</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <AlertsBar />
      <FloatingActionButtons />
    </div>
  );
};

export default Dashboard;