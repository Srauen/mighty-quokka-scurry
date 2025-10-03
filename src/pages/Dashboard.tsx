"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from '@/components/SessionContextProvider';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStats from '@/components/dashboard/DashboardStats';
import DashboardChart from '@/components/dashboard/DashboardChart';
import TopTradersCard from '@/components/dashboard/TopTradersCard'; // Renamed component
import SecurityStatusCard from '@/components/dashboard/SecurityStatusCard';
import NotificationsCard from '@/components/dashboard/NotificationsCard';
import MarketStatusWidget from '@/components/dashboard/MarketStatusWidget'; // Renamed component
import { mockDashboardData } from '@/lib/mockData';
import { MockDashboardData } from '@/types/dashboard';
import { useTheme } from '@/components/ThemeContext'; // Import useTheme

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
  const [dashboardData, setDashboardData] = useState<MockDashboardData>(mockDashboardData);
  const { theme } = useTheme(); // Get current theme

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

  if (loading || setLoadingProfile) {
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
          <DashboardChart chartData={dashboardData.chartData} />
          <TopTradersCard ranking={dashboardData.rebelsRanking} /> {/* Use TopTradersCard */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SecurityStatusCard statusData={dashboardData.securityStatus} />
          <NotificationsCard notifications={dashboardData.notifications} />
          <MarketStatusWidget widgetData={dashboardData.widgetData} /> {/* Use MarketStatusWidget */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;