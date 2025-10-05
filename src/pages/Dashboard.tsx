"use client";

import React, { useState, useEffect } from 'react';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar'; // New Navbar
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'; // New Sidebar
import StockChartPanel from '@/components/dashboard/StockChartPanel'; // New Chart Panel
import LiveMarketTicker from '@/components/dashboard/LiveMarketTicker';
import { useStockData } from '@/hooks/use-stock-data';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Dashboard: React.FC = () => {
  const { stockData, stocksList } = useStockData(); // Keep useStockData for global stock data
  const [cashBalance, setCashBalance] = useState<number>(10000); // Keep for potential future use or display
  const [portfolio, setPortfolio] = useState<{ [key: string]: number }>({}); // Keep for potential future use or display
  const [userName, setUserName] = useState('Trader');
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | undefined>(undefined);

  // Stocks for the multi-panel chart layout
  const mainChartStocks = ['AAPL', 'TSLA', 'MSFT', 'AMZN', 'NVDA'];

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
    // Only save if cashBalance or portfolio are actually managed/changed on this dashboard
    // For this redesign, they are mostly read-only, but keeping the hook for completeness.
    // saveUserData();
  }, [cashBalance, portfolio]);


  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white font-mono">
      <DashboardNavbar userName={userName} userAvatarUrl={userAvatarUrl} />
      <LiveMarketTicker /> {/* Live Market Ticker Strip */}

      <div className="flex flex-grow">
        <DashboardSidebar /> {/* Left Sidebar */}

        <main className="flex-grow p-6 overflow-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {mainChartStocks.map(stock => (
              <StockChartPanel key={stock} stockSymbol={stock} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;