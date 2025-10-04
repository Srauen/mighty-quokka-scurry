"use client";

import React, { useState, useEffect } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStats from '@/components/dashboard/DashboardStats';
import DashboardChart from '@/components/dashboard/DashboardChart';
import TopTradersCard from '@/components/dashboard/TopTradersCard';
import SecurityStatusCard from '@/components/dashboard/SecurityStatusCard';
import NotificationsCard from '@/components/dashboard/NotificationsCard';
import MarketStatusWidget from '@/components/dashboard/MarketStatusWidget';
import PortfolioOverviewCard from '@/components/dashboard/PortfolioOverviewCard';
import LiveMarketTicker from '@/components/dashboard/LiveMarketTicker';
import TopMoversPanel from '@/components/dashboard/TopMoversPanel';
import RecentTradesFeed from '@/components/dashboard/RecentTradesFeed';
import NewsFeedApp from '@/components/os/apps/NewsFeedApp'; // Reusing NewsFeedApp for the dashboard news panel
import { mockStats, mockTopTraders, mockNotifications } from '@/lib/mockData';
import { useStockData } from '@/hooks/use-stock-data';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const initialNewsHeadlines = [
  "Market volatility expected after global events.",
  "Tech stocks surge on strong Q3 reports.",
  "Energy sector sees gains as oil prices stabilize.",
  "Inflation concerns lead to interest rate hike speculation.",
  "Analyst predicts strong year for renewable energy.",
  "Major companies announce stock buyback programs.",
  "New trade agreements could impact commodities.",
  "Retail sector reports mixed holiday sales.",
  "Cryptocurrency market shows signs of recovery.",
  "Pharmaceutical stock rallies on new drug approval."
];

const Dashboard: React.FC = () => {
  const { stockData, stocksList } = useStockData();
  const [cashBalance, setCashBalance] = useState<number>(10000);
  const [portfolio, setPortfolio] = useState<{ [key: string]: number }>({});
  const [currentNewsItem, setCurrentNewsItem] = useState<string | null>(null); // Changed to single news item
  const [userName, setUserName] = useState('Trader');
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | undefined>(undefined);

  // Fetch user profile and initial data
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('first_name, last_name, avatar_url')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          toast.error("Error", { description: "Failed to load user profile." });
        } else if (profileData) {
          setUserName(`${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || user.email || 'Trader');
          setUserAvatarUrl(profileData.avatar_url || undefined);
        } else {
          setUserName(user.email || 'Trader');
        }

        // Fetch user trading data (cash, portfolio)
        const { data: userData, error: userDataError } = await supabase
          .from('user_trading_data')
          .select('cash_balance, portfolio')
          .eq('user_id', user.id)
          .single();

        if (userDataError && userDataError.code !== 'PGRST116') { // PGRST116 means no rows found
          console.error('Error fetching user trading data:', userDataError);
          toast.error("Error", { description: "Failed to load trading data." });
        } else if (userData) {
          setCashBalance(userData.cash_balance || 10000);
          setPortfolio(userData.portfolio || {});
        } else {
          // Initialize if no data found
          await supabase.from('user_trading_data').insert({ user_id: user.id, cash_balance: 10000, portfolio: {} });
        }
      }
    };

    fetchUserData();
  }, []);

  // Save user trading data to Supabase whenever cashBalance or portfolio changes
  useEffect(() => {
    const saveUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('user_trading_data')
          .update({ cash_balance: cashBalance, portfolio: portfolio, updated_at: new Date().toISOString() })
          .eq('user_id', user.id);

        if (error) {
          console.error('Error saving user trading data:', error);
          toast.error("Error", { description: "Failed to save trading data." });
        }
      }
    };
    saveUserData();
  }, [cashBalance, portfolio]);

  // Initialize news feed and simulate updates
  useEffect(() => {
    // Set initial news item
    setCurrentNewsItem(`[${new Date().toLocaleTimeString()}] ${initialNewsHeadlines[0]}`);

    const newsUpdateInterval = setInterval(() => {
      const headline = initialNewsHeadlines[Math.floor(Math.random() * initialNewsHeadlines.length)];
      const time = new Date().toLocaleTimeString();
      setCurrentNewsItem(`[${time}] ${headline}`);
    }, 20000); // Update every 20 seconds

    return () => clearInterval(newsUpdateInterval);
  }, []);

  // Calculate dynamic stats
  const totalPortfolioValue = Object.keys(portfolio).reduce((sum, stock) => {
    const quantity = portfolio[stock];
    const lastPrice = stockData[stock] ? stockData[stock].lastPrice : 0;
    return sum + (quantity * lastPrice);
  }, 0);

  const currentStats = [
    {
      title: "Cash Balance",
      value: `$${cashBalance.toFixed(2)}`,
      change: "", // No direct change for cash balance here
      changeType: "neutral",
    },
    {
      title: "Total Portfolio Value",
      value: `$${totalPortfolioValue.toFixed(2)}`,
      change: mockStats[0].change, // Using mock change for now
      changeType: mockStats[0].changeType,
    },
    {
      title: "Open Positions",
      value: Object.keys(portfolio).filter(stock => portfolio[stock] > 0).length.toString(),
      change: mockStats[2].change,
      changeType: mockStats[2].changeType,
    },
    {
      title: "Market Sentiment",
      value: mockStats[3].value,
      change: mockStats[3].change,
      changeType: mockStats[3].changeType,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white font-mono">
      <DashboardHeader userName={userName} userAvatarUrl={userAvatarUrl} />
      <LiveMarketTicker /> {/* Live Market Ticker Strip */}
      <main className="flex-grow p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {/* Row 1: Stats and Portfolio Overview */}
          <div className="lg:col-span-3 xl:col-span-4">
            <DashboardStats stats={currentStats} />
          </div>

          {/* Row 2: Main Chart and Portfolio Overview */}
          <div className="lg:col-span-2 xl:col-span-3">
            <DashboardChart initialStocks={['AAPL', 'MSFT', 'GOOGL']} /> {/* Main Stock Chart */}
          </div>
          <PortfolioOverviewCard cashBalance={cashBalance} portfolio={portfolio} /> {/* Portfolio Overview Card */}

          {/* Row 3: Top Movers, Recent Trades, News, Market Status - now grouped and smaller */}
          <div className="lg:col-span-3 xl:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <TopMoversPanel /> {/* Top Movers Panel */}
            <RecentTradesFeed /> {/* Recent Trades Feed */}

            <Card className="bg-gray-800 border border-gray-700 text-white shadow-lg flex flex-col">
              <CardHeader className="p-4 border-b border-gray-700">
                <CardTitle className="text-lg font-semibold text-green-400">Live News Feed</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow p-4 flex items-center justify-center"> {/* Centered content */}
                <NewsFeedApp newsFeed={currentNewsItem ? [currentNewsItem] : []} /> {/* Pass single news item as an array */}
              </CardContent>
            </Card>

            <MarketStatusWidget
              status="open"
              marketIndex="S&P 500"
              indexValue={4567.89}
              indexChange={0.75}
            />
          </div>

          {/* Other Widgets - these will now appear below the grouped section */}
          <TopTradersCard traders={mockTopTraders} />
          <SecurityStatusCard status="secure" message="All systems operational. Your account is secure." />
          <NotificationsCard notifications={mockNotifications} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;