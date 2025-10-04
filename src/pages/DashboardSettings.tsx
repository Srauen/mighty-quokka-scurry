"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/components/ThemeContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, Download, Trash2, Bell, Settings, Globe, Info, Mail } from 'lucide-react'; // Added Mail icon
import { sendEmail } from '@/utils/email'; // Import the new sendEmail utility

interface Profile {
  first_name: string;
  last_name: string;
  avatar_url: string;
}

const DashboardSettings: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile>({ first_name: '', last_name: '', avatar_url: '' });
  const [email, setEmail] = useState('');
  const [testEmailRecipient, setTestEmailRecipient] = useState('');

  useEffect(() => {
    const getProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setEmail(user.email || '');
        setTestEmailRecipient(user.email || ''); // Pre-fill test email with user's email
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, avatar_url')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          toast.error("Error", { description: "Failed to load user profile." });
        } else if (data) {
          setProfile({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            avatar_url: data.avatar_url || '',
          });
        }
      }
      setLoading(false);
    };

    getProfile();
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          avatar_url: profile.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        toast.error("Update Failed", { description: error.message });
      } else {
        toast.success("Profile Updated", { description: "Your profile has been successfully updated." });
      }
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Sign Out Failed", { description: error.message });
    } else {
      toast.success("Signed Out", { description: "You have been successfully signed out." });
      navigate('/login');
    }
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'os-style') => {
    setTheme(newTheme);
    toast.info("Theme Changed", { description: `Switched to ${newTheme} theme.` });
  };

  const handleExportData = () => {
    toast.info("Export Data", { description: "Feature to export portfolio data (CSV/JSON) is not yet implemented." });
  };

  const handleDeleteAccount = () => {
    toast.warning("Delete Account", { description: "Feature to delete account / reset data is not yet implemented. This action is irreversible!", duration: 5000 });
  };

  const handleSendTestEmail = async () => {
    if (!testEmailRecipient) {
      toast.error("Email Required", { description: "Please enter a recipient email address." });
      return;
    }
    toast.loading("Sending test email...", { id: 'test-email-toast' });
    const { success, error } = await sendEmail({
      to: testEmailRecipient,
      subject: "Stock OS Test Email",
      body: `
        <h1>Hello from Stock OS!</h1>
        <p>This is a test email sent from your Stock OS application using a Supabase Edge Function.</p>
        <p>If you received this, your email integration is working correctly!</p>
        <p>Best regards,<br/>The Stock OS Team</p>
      `,
    });

    if (success) {
      toast.success("Test Email Sent!", { description: `Check ${testEmailRecipient}'s inbox.`, id: 'test-email-toast' });
    } else {
      toast.error("Failed to Send Test Email", { description: error, id: 'test-email-toast' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white p-6 font-mono">
      <div className="w-full max-w-3xl mx-auto mb-6 flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white">
          <ChevronLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>

      <Card className="w-full max-w-3xl mx-auto bg-gray-900 border border-gray-700 shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-green-400">Settings</CardTitle>
          <CardDescription className="text-gray-400">Manage your account and application preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* 1. Account Settings */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center"><Settings className="mr-2 h-5 w-5 text-green-400" /> Account Settings</h3>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="mt-1 bg-gray-800 border-gray-700 text-gray-400"
                />
              </div>
              <div>
                <Label htmlFor="first_name" className="text-gray-300">First Name</Label>
                <Input
                  id="first_name"
                  type="text"
                  value={profile.first_name}
                  onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                  className="mt-1 bg-gray-800 border-gray-700 text-white focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <Label htmlFor="last_name" className="text-gray-300">Last Name</Label>
                <Input
                  id="last_name"
                  type="text"
                  value={profile.last_name}
                  onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                  className="mt-1 bg-gray-800 border-gray-700 text-white focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <Label htmlFor="avatar_url" className="text-gray-300">Avatar URL</Label>
                <Input
                  id="avatar_url"
                  type="text"
                  value={profile.avatar_url}
                  onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
                  className="mt-1 bg-gray-800 border-gray-700 text-white focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white">
                {loading ? 'Saving...' : 'Save Profile'}
              </Button>
            </form>
            <Button variant="secondary" className="w-full bg-gray-700 hover:bg-gray-600 text-white">Change Password (Coming Soon)</Button>
            <Button variant="secondary" className="w-full bg-gray-700 hover:bg-gray-600 text-white">Setup 2FA (Coming Soon)</Button>
          </div>

          <Separator className="bg-gray-700" />

          {/* 2. Email Settings */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center"><Mail className="mr-2 h-5 w-5 text-green-400" /> Email Settings</h3>
            <div>
              <Label htmlFor="test-email-recipient" className="text-gray-300">Send Test Email To</Label>
              <Input
                id="test-email-recipient"
                type="email"
                value={testEmailRecipient}
                onChange={(e) => setTestEmailRecipient(e.target.value)}
                placeholder="Enter recipient email"
                className="mt-1 bg-gray-800 border-gray-700 text-white focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <Button onClick={handleSendTestEmail} className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center">
              <Mail className="mr-2 h-4 w-4" /> Send Test Email
            </Button>
            <p className="text-sm text-gray-400">
              Note: SMTP credentials are securely managed via Supabase Edge Functions.
              Ensure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` are set as Supabase secrets.
            </p>
          </div>

          <Separator className="bg-gray-700" />

          {/* 3. Display & Theme */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center"><Settings className="mr-2 h-5 w-5 text-green-400" /> Display & Theme</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="theme-toggle" className="text-gray-300">Theme</Label>
              <Select value={theme} onValueChange={handleThemeChange}>
                <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white z-[9999]">
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="os-style">OS-style</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="secondary" className="w-full bg-gray-700 hover:bg-gray-600 text-white">Font Size / UI Scaling (Coming Soon)</Button>
            <Button variant="secondary" className="w-full bg-gray-700 hover:bg-gray-600 text-white">Color Accents (Coming Soon)</Button>
          </div>

          <Separator className="bg-gray-700" />

          {/* 4. Notifications */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center"><Bell className="mr-2 h-5 w-5 text-green-400" /> Notifications</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="price-alerts" className="text-gray-300">Price Alerts</Label>
              <Switch id="price-alerts" className="data-[state=checked]:bg-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="portfolio-notifications" className="text-gray-300">Portfolio Performance Notifications</Label>
              <Switch id="portfolio-notifications" className="data-[state=checked]:bg-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="system-notifications" className="text-gray-300">System Notifications</Label>
              <Switch id="system-notifications" defaultChecked className="data-[state=checked]:bg-green-500" />
            </div>
          </div>

          <Separator className="bg-gray-700" />

          {/* 5. Data & Privacy */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center"><Download className="mr-2 h-5 w-5 text-green-400" /> Data & Privacy</h3>
            <Button onClick={handleExportData} variant="secondary" className="w-full bg-gray-700 hover:bg-gray-600 text-white flex items-center">
              <Download className="mr-2 h-4 w-4" /> Export Portfolio Data (CSV/JSON)
            </Button>
            <Button onClick={handleDeleteAccount} variant="destructive" className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center">
              <Trash2 className="mr-2 h-4 w-4" /> Delete Account / Reset Data
            </Button>
            <Button variant="secondary" className="w-full bg-gray-700 hover:bg-gray-600 text-white">Privacy Settings (Coming Soon)</Button>
          </div>

          <Separator className="bg-gray-700" />

          {/* 6. Integrations */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center"><Settings className="mr-2 h-5 w-5 text-green-400" /> Integrations</h3>
            <Button variant="secondary" className="w-full bg-gray-700 hover:bg-gray-600 text-white">API Keys / Third-Party Integrations (Coming Soon)</Button>
          </div>

          <Separator className="bg-gray-700" />

          {/* 7. Miscellaneous */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center"><Info className="mr-2 h-5 w-5 text-green-400" /> Miscellaneous</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="language-select" className="text-gray-300">Language</Label>
              <Select defaultValue="en">
                <SelectTrigger id="language-select" className="w-[180px] bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white z-[9999]">
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish (Coming Soon)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="secondary" className="w-full bg-gray-700 hover:bg-gray-600 text-white">Help & Support (Coming Soon)</Button>
            <p className="text-sm text-gray-400">About Stock-OS: Version 1.0.0</p>
          </div>

          <div className="pt-6">
            <Button onClick={handleSignOut} variant="destructive" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white">
              Log Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSettings;