"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useSession } from '@/components/SessionContextProvider';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStats from '@/components/dashboard/DashboardStats';
import DashboardChart from '@/components/dashboard/DashboardChart';
import TopTradersCard from '@/components/dashboard/TopTradersCard';
import SecurityStatusCard from '@/components/dashboard/SecurityStatusCard';
import NotificationsCard from '@/components/dashboard/NotificationsCard';
import MarketStatusWidget from '@/components/dashboard/MarketStatusWidget';
import { mockDashboardData } from '@/lib/mockData';
import { MockDashboardData, DashboardStat, ChartData } from '@/types/dashboard';
import { useTheme } from '@/components/ThemeContext';
import { useStockData } from '@/hooks/use-stock-data'; // Import the new hook

interface Profile {
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
}

const Dashboard: React.FC = () => {
  const { user, loading } = useSession();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setLoadingProfile] = useState(true);
  const { theme } = useTheme();
  const { stockData, stocksList } = useStockData(); // Use the new hook

  // State for dashboard data, initialized with mock data
  const [dashboardData, setDashboardData] = useState<MockDashboardData>(mockDashboardData);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    } else if (user) {
      fetchProfile();
    }
  }, [user, loading, navigate]);

  const fetchProfile = async () => {
    if (!user) return;
    setLoadingProfile(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('first_name, last_name, avatar_url')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      toast.error('Error', { description: 'Failed to load user profile.' });
    } else if (data) {
      setProfile(data);
    }
    setLoadingProfile(false);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      toast.error('Error', { description: 'Failed to sign out.' });
    }
  };

  // Logic to find the "peak" stock for the chart and update dashboard stats
  const peakStockData = useMemo(() => {
    if (Object.keys(stockData).length === 0) return null;

    let peakStockId: string | null = null;
    let maxDailyChange = -Infinity;

    // Find the stock with the highest daily change
    for (const stockId of stocksList) {
      const data = stockData[stockId];
      if (data && data.dailyChange > maxDailyChange) {
        maxDailyChange = data.dailyChange;
        peakStockId = stockId;
      }
    }

    if (peakStockId) {
      const currentPeakStockData = stockData[peakStockId];
      const lastPrice = currentPeakStockData.lastPrice;
      const dailyChange = currentPeakStockData.dailyChange;

      // Update DashboardStats
      const updatedStats: DashboardStat[] = dashboardData.dashboardStats.map(stat => {
        if (stat.label === "DAILY GAIN/LOSS") {
          return {
            ...stat,
            value: `${dailyChange.toFixed(2)}%`,
            description: `TODAY'S PERFORMANCE (${peakStockId})`,
            intent: dailyChange >= 0 ? "positive" : "negative",
            direction: dailyChange >= 0 ? "up" : "down",
          };
        }
        return stat;
      });

      // Create ChartData for the peak stock
      const chartDataForPeakStock: ChartData = {
        week: currentPeakStockData.prices.map((price, index) => ({
          date: currentPeakStockData.labels[index],
          price: price,
          volume: Math.floor(Math.random() * 50000) + 10000, // Simulate volume
          sentiment: Math.floor(Math.random() * 40) + 50, // Simulate sentiment
        })),
        month: [], // For simplicity, we'll just use 'week' data for now
        year: [],  // For simplicity, we'll just use 'week' data for now
      };

      // Ensure chart data has enough points for a meaningful display
      if (chartDataForPeakStock.week.length < 2) {
        // If not enough data points, create some dummy ones for display
        const dummyPrice = currentPeakStockData.initialPrice;
        chartDataForPeakStock.week = [
          { date: "Start", price: dummyPrice, volume: 10000, sentiment: 60 },
          { date: "Current", price: lastPrice, volume: 20000, sentiment: 70 },
        ];
      }


      setDashboardData(prevData => ({
        ...prevData,
        dashboardStats: updatedStats,
        chartData: chartDataForPeakStock,
      }));

      return {
        selectedStockId: peakStockId,
        chartData: chartDataForPeakStock,
      };
    }
    return null;
  }, [stockData, stocksList, dashboardData.dashboardStats]);


  if (loading || profileLoading || Object.keys(stockData).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground font-mono">
        Loading dashboard...
      </div>
    );
  }

  if (!user) {
    return null; // Should be redirected by SessionContextProvider
  }

  return (
    <div className={`min-h-screen bg-background text-foreground py-8 px-4 sm:px-6 lg:px-8 font-mono ${theme === 'os-style' ? 'os-style' : ''}`}>
      <div className="max-w-7xl mx-auto space-y-8">
        <DashboardHeader profile={profile} onSignOut={handleSignOut} />

        <DashboardStats stats={dashboardData.dashboardStats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {peakStockData && <DashboardChart chartData={peakStockData.chartData} />}
          <TopTradersCard ranking={dashboardData.rebelsRanking} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SecurityStatusCard statusData={dashboardData.securityStatus} />
          <NotificationsCard notifications={dashboardData.notifications} />
          <MarketStatusWidget widgetData={dashboardData.widgetData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;