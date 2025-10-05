"use client";

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChevronLeft, Cloud, HardDrive, RefreshCcw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useSession } from '@/components/SessionContextProvider';

const OSConnectPage: React.FC = () => {
  const navigate = useNavigate();
  const { session, isLoading: isSessionLoading } = useSession();
  const [localOSData, setLocalOSData] = useState<{ cashBalance: number; portfolio: { [key: string]: number }; tradingLog: string[] } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load data from OS simulation's localStorage
    if (typeof window !== 'undefined') {
      const savedCash = localStorage.getItem('os_cashBalance');
      const savedPortfolio = localStorage.getItem('os_portfolio');
      const savedTradingLog = localStorage.getItem('os_tradingLog');

      const cashBalance = savedCash ? parseFloat(savedCash) : 0;
      let portfolio = {};
      try {
        portfolio = savedPortfolio ? JSON.parse(savedPortfolio) : {};
      } catch (e) {
        console.error("Error parsing local OS portfolio:", e);
      }
      let tradingLog = [];
      try {
        tradingLog = savedTradingLog ? JSON.parse(savedTradingLog) : [];
      } catch (e) {
        console.error("Error parsing local OS trading log:", e);
      }

      setLocalOSData({ cashBalance, portfolio, tradingLog });
    }
  }, []);

  const handleSyncOSDataToDashboard = async () => {
    if (!session?.user) {
      toast.error("Authentication Required", { description: "Please sign in to sync your data." });
      navigate('/login');
      return;
    }
    if (!localOSData) {
      toast.info("No Local OS Data", { description: "No simulation data found in your browser's local storage to sync." });
      return;
    }

    setLoading(true);
    toast.loading("Syncing OS data to dashboard...", { id: 'sync-toast' });

    try {
      const { cashBalance, portfolio } = localOSData;
      const userId = session.user.id;

      // Check if user_trading_data exists, if not, insert, otherwise update
      const { data: existingData, error: fetchError } = await supabase
        .from('user_trading_data')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means "no rows found"
        throw fetchError;
      }

      if (existingData) {
        // Update existing data
        const { error: updateError } = await supabase
          .from('user_trading_data')
          .update({
            cash_balance: cashBalance,
            portfolio: portfolio,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId);

        if (updateError) throw updateError;
      } else {
        // Insert new data
        const { error: insertError } = await supabase
          .from('user_trading_data')
          .insert({
            user_id: userId,
            cash_balance: cashBalance,
            portfolio: portfolio,
          });

        if (insertError) throw insertError;
      }

      toast.success("Sync Complete!", { description: "Your OS simulation data has been successfully synced to your dashboard.", id: 'sync-toast' });
      // Optionally clear local OS data after sync
      // localStorage.removeItem('os_cashBalance');
      // localStorage.removeItem('os_portfolio');
      // localStorage.removeItem('os_tradingLog');
      // localStorage.removeItem('os_experienceLevel');
      navigate('/dashboard'); // Redirect to dashboard to see updated data
    } catch (error: any) {
      console.error("Error syncing OS data:", error);
      toast.error("Sync Failed", { description: error.message || "An unexpected error occurred during sync.", id: 'sync-toast' });
    } finally {
      setLoading(false);
    }
  };

  if (isSessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0B0B] text-soft-white font-mono">
        <p>Loading user session...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0B0B0B] text-soft-white p-6 font-mono">
      <div className="w-full max-w-3xl mx-auto mb-6 flex items-center justify-between">
        <Link to="/dashboard">
          <Button variant="ghost" className="text-gray-400 hover:text-electric-blue">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </Link>
      </div>

      <Card className="w-full max-w-3xl mx-auto glassmorphic-card flex flex-col flex-grow">
        <CardHeader className="p-6 border-b border-gray-700">
          <CardTitle className="text-3xl font-bold text-electric-blue flex items-center space-x-3">
            <Cloud className="h-7 w-7 text-teal" />
            <span>Connect Stock OS Simulation</span>
          </CardTitle>
          <CardDescription className="text-gray-400 mt-2">
            Transfer your local Stock OS demo data (cash balance, portfolio) to your cloud dashboard profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow p-6 space-y-6">
          <div className="flex items-center space-x-4 p-4 bg-gray-800 rounded-md border border-gray-700">
            <HardDrive className="h-8 w-8 text-yellow-400 flex-shrink-0" />
            <div>
              <p className="text-lg font-semibold text-soft-white">Local OS Simulation Data</p>
              {localOSData ? (
                <>
                  <p className="text-sm text-gray-300">Cash Balance: <span className="text-green-400">${localOSData.cashBalance.toFixed(2)}</span></p>
                  <p className="text-sm text-gray-300">Portfolio Items: {Object.keys(localOSData.portfolio).length}</p>
                </>
              ) : (
                <p className="text-sm text-gray-400">No local simulation data found.</p>
              )}
            </div>
          </div>

          <p className="text-gray-300 text-center">
            Click the button below to sync this data to your authenticated Stock OS Dashboard profile.
            This will overwrite your current dashboard trading data with the local simulation data.
          </p>

          <Button
            onClick={handleSyncOSDataToDashboard}
            disabled={loading || !session?.user || !localOSData}
            className="w-full bg-electric-blue hover:bg-electric-blue/90 text-white text-lg py-3 flex items-center justify-center space-x-2"
          >
            <RefreshCcw className="h-5 w-5" />
            <span>{loading ? 'Syncing...' : 'Sync OS Data to Dashboard'}</span>
          </Button>

          {!session?.user && (
            <p className="text-red-400 text-sm text-center">You must be logged in to sync data.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OSConnectPage;