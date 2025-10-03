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

interface Profile {
  first_name: string;
  last_name: string;
  avatar_url: string;
}

const DashboardSettings: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile>({ first_name: '', last_name: '', avatar_url: '' });
  const [email, setEmail] = useState('');

  useEffect(() => {
    const getProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setEmail(user.email || '');
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white p-6">
      <Card className="w-full max-w-3xl mx-auto bg-gray-900 border border-gray-700 shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-green-400">Settings</CardTitle>
          <CardDescription className="text-gray-400">Manage your account and profile settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Profile Settings */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Profile Information</h3>
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
          </div>

          <Separator className="bg-gray-700" />

          {/* Account Actions */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Account Actions</h3>
            <Button onClick={handleSignOut} variant="destructive" disabled={loading} className="bg-red-600 hover:bg-red-700 text-white">
              Log Out
            </Button>
            {/* Add other account actions like change password, delete account etc. */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSettings;