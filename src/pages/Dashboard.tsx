"use client";

import React, { useState, useEffect } from 'react';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import StockChartPanel from '@/components/dashboard/StockChartPanel';
import AIInsightsPanel from '@/components/dashboard/AIInsightsPanel'; // New AI Insights Panel
import AlertsBar from '@/components/dashboard/AlertsBar'; // New Alerts Bar
import FloatingActionButtons from '@/components/dashboard/FloatingActionButtons'; // New Floating Action Buttons
import { useStockData } from '@/hooks/use-stock-data';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useSession } from '@/components/SessionContextProvider'; // Import useSession

const Dashboard: React.FC = () => {
  const { stockData, stocksList } = useStockData();
  const [userName, setUserName] = useState('Trader');
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | undefined>(undefined);
  const { session, isLoading: isSessionLoading } = useSession(); // Use useSession hook

  // Stocks for the multi-panel chart layout
  const mainChartStocks = ['AAPL', 'TSLA', 'MSFT', 'AMZN', 'NVDA'];

  // Fetch user profile and initial data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!session) return; // Only fetch if session exists

      // Fetch profile
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

      // Fetch user trading data (cash, portfolio) - for future use if needed on dashboard
      const { data: userData, error: userDataError } = await supabase
        .from('user_trading_data')
        .select('cash_balance, portfolio')
        .eq('user_id', session.user.id)
        .single();

      if (userDataError && userDataError.code !== 'PGRST116') { // PGRST116 means no rows found
        console.error('Error fetching user trading data:', userDataError);
        toast.error("Error", { description: "Failed to load trading data." });
      } else if (!userData) {
        // Initialize if no data found
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
      {/* LiveMarketTicker is replaced by AlertsBar at the bottom */}

      <div className="flex flex-grow overflow-hidden">
        <DashboardSidebar /> {/* Left Sidebar */}

        <main className="flex-grow p-6 overflow-y-auto custom-scrollbar grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Panel (Charts Area) - 2x3 responsive grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:col-span-2">
            {mainChartStocks.map(stock => (
              <StockChartPanel key={stock} stockSymbol={stock} />
            ))}
          </div>

          {/* AI Insights Panel (Right side) */}
          <div className="xl:col-span-1">
            <AIInsightsPanel />
          </div>
        </main>
      </div>

      <AlertsBar /> {/* Fixed slim bar at the bottom */}
      <FloatingActionButtons /> {/* Floating action buttons */}
    </div>
  );
};

export default Dashboard;