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
import RebelsRankingCard from '@/components/dashboard/RebelsRankingCard';
import SecurityStatusCard from '@/components/dashboard/SecurityStatusCard';
import NotificationsCard from '@/components/dashboard/NotificationsCard';
import WeatherWidget from '@/components/dashboard/WeatherWidget';
import { mockDashboardData } from '@/lib/mockData';
import { MockDashboardData } from '@/types/dashboard';

interface Profile {
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
}

const Dashboard: React.FC = () => {
  const { user, loading } = useSession();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<MockDashboardData>(mockDashboardData); // Use mock data

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    } else if (user) {
      fetchProfile();
    }
  }, [user, loading, navigate]);

  const fetchProfile = async () => {
    if (!user) return;
    setProfileLoading(true);
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
    setProfileLoading(false);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      toast.error('Error', { description: 'Failed to sign out.' });
    }
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        Loading dashboard...
      </div>
    );
  }

  if (!user) {
    return null; // Should be redirected by SessionContextProvider
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4 sm:px-6 lg:px-8 font-mono">
      <div className="max-w-7xl mx-auto space-y-8">
        <DashboardHeader profile={profile} onSignOut={handleSignOut} />

        <DashboardStats stats={dashboardData.dashboardStats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <DashboardChart chartData={dashboardData.chartData} />
          <RebelsRankingCard ranking={dashboardData.rebelsRanking} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SecurityStatusCard statusData={dashboardData.securityStatus} />
          <NotificationsCard notifications={dashboardData.notifications} />
          <WeatherWidget widgetData={dashboardData.widgetData} />
        </div>

        {/* The original profile update section is removed to make way for the new dashboard design.
            If you need to re-add profile editing, it could be a separate settings page. */}
      </div>
    </div>
  );
};

export default Dashboard;