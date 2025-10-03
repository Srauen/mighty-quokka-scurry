"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, User, Lock, Bell, Database, Plug, Info, Palette } from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from '@/components/SessionContextProvider';
import { useTheme } from '@/components/ThemeContext'; // Import useTheme

const DashboardSettings: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSession();
  const { theme, setTheme } = useTheme(); // Get and set theme from context

  // Mock state for profile info
  const [firstName, setFirstName] = useState(user?.user_metadata?.first_name || '');
  const [lastName, setLastName] = useState(user?.user_metadata?.last_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.user_metadata?.avatar_url || '');

  // Mock state for notification settings
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [portfolioNotifications, setPortfolioNotifications] = useState(true);
  const [systemNotifications, setSystemNotifications] = useState(true);

  const handleSaveProfile = () => {
    toast.success("Profile Updated", { description: "Your profile information has been saved." });
    // In a real app, this would update Supabase user metadata or a 'profiles' table.
  };

  const handleChangePassword = () => {
    toast.info("Change Password", { description: "A password reset link has been sent to your email." });
    // In a real app, this would trigger Supabase auth password reset.
  };

  const handle2FASetup = () => {
    toast.info("Two-Factor Authentication", { description: "2FA setup initiated. Please follow the instructions." });
    // Placeholder for 2FA setup logic.
  };

  const handleExportData = () => {
    toast.info("Exporting Data", { description: "Your portfolio data is being prepared for download." });
    // Placeholder for data export logic (e.g., generate CSV/JSON).
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      toast.error("Account Deletion", { description: "Account deletion initiated. Please confirm via email." });
      // Placeholder for account deletion logic.
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4 sm:px-6 lg:px-8 font-mono">
      <div className="max-w-4xl mx-auto space-y-8">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6 text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Button>

        <h1 className="text-3xl font-bold mb-8 text-foreground">Dashboard Settings</h1>

        {/* Account Settings */}
        <Card className="bg-card border border-border shadow-sm">
          <CardHeader className="flex flex-row items-center space-x-3">
            <User className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl font-semibold">Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} disabled />
            </div>
            <div>
              <Label htmlFor="avatarUrl">Avatar URL</Label>
              <Input id="avatarUrl" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
            </div>
            <Button onClick={handleSaveProfile} className="bg-primary text-primary-foreground hover:bg-primary/90">Save Profile</Button>
            <Separator className="my-4" />
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" onClick={handleChangePassword}>Change Password</Button>
              <Button variant="outline" onClick={handle2FASetup}>Setup Two-Factor Authentication</Button>
            </div>
          </CardContent>
        </Card>

        {/* Display & Theme */}
        <Card className="bg-card border border-border shadow-sm">
          <CardHeader className="flex flex-row items-center space-x-3">
            <Palette className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl font-semibold">Display & Theme</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme-select">Theme</Label>
              <Select value={theme} onValueChange={(value: Theme) => setTheme(value)}>
                <SelectTrigger id="theme-select" className="w-[180px]">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="os-style">OS-Style (Neon)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="font-size">Font Size / UI Scaling</Label>
              <Select defaultValue="medium">
                <SelectTrigger id="font-size" className="w-[180px]">
                  <SelectValue placeholder="Medium" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <CardDescription className="text-sm text-muted-foreground">
              Note: "Color accents" are integrated into the "OS-Style" theme.
            </CardDescription>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-card border border-border shadow-sm">
          <CardHeader className="flex flex-row items-center space-x-3">
            <Bell className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl font-semibold">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="price-alerts">Price Alerts</Label>
              <Switch id="price-alerts" checked={priceAlerts} onCheckedChange={setPriceAlerts} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="portfolio-notifications">Portfolio Performance Notifications</Label>
              <Switch id="portfolio-notifications" checked={portfolioNotifications} onCheckedChange={setPortfolioNotifications} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="system-notifications">System Notifications</Label>
              <Switch id="system-notifications" checked={systemNotifications} onCheckedChange={setSystemNotifications} />
            </div>
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card className="bg-card border border-border shadow-sm">
          <CardHeader className="flex flex-row items-center space-x-3">
            <Database className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl font-semibold">Data & Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" onClick={handleExportData}>Export Portfolio Data (CSV/JSON)</Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>Delete Account / Reset Data</Button>
            <CardDescription className="text-sm text-muted-foreground">
              Manage your data sharing and marketing preferences.
            </CardDescription>
          </CardContent>
        </Card>

        {/* Integrations */}
        <Card className="bg-card border border-border shadow-sm">
          <CardHeader className="flex flex-row items-center space-x-3">
            <Plug className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl font-semibold">Integrations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Manage API keys and third-party integrations here.</p>
            <Button variant="outline" className="mt-4" onClick={() => toast.info("API Keys", { description: "This section would allow managing API keys for external services." })}>Manage API Keys</Button>
          </CardContent>
        </Card>

        {/* Miscellaneous */}
        <Card className="bg-card border border-border shadow-sm">
          <CardHeader className="flex flex-row items-center space-x-3">
            <Info className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl font-semibold">Miscellaneous</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="language-select">Language / Regional Settings</Label>
              <Select defaultValue="en">
                <SelectTrigger id="language-select" className="w-[180px]">
                  <SelectValue placeholder="English" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="link" className="p-0 h-auto text-primary" onClick={() => toast.info("Help & Support", { description: "This would link to a help center or support contact." })}>Help & Support</Button>
            <p className="text-sm text-muted-foreground">About Stock-OS: Version 1.0.0</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardSettings;