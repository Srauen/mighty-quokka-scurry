"use client";

import React from 'react';
import { useSession } from '@/components/SessionContextProvider';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface Profile {
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
}

interface DashboardHeaderProps {
  profile: Profile | null;
  onSignOut: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ profile, onSignOut }) => {
  const { user } = useSession();

  const displayName = profile?.first_name || user?.email?.split('@')[0] || 'User';
  const displayAvatar = profile?.avatar_url || user?.user_metadata.avatar_url || undefined;
  const fallbackAvatar = profile?.first_name ? profile.first_name[0].toUpperCase() : (user?.email ? user.email[0].toUpperCase() : 'U');

  return (
    <div className="flex items-center justify-between p-4 bg-card rounded-lg shadow-sm border border-border">
      <div className="flex items-center space-x-4">
        <Avatar className="h-12 w-12 border-2 border-primary">
          <AvatarImage src={displayAvatar} alt={displayName} />
          <AvatarFallback className="bg-primary text-primary-foreground">{fallbackAvatar}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-bold text-foreground">Welcome, {displayName}!</h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <Link to="/dashboard/settings"> {/* Placeholder for settings page */}
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
            <Settings className="h-5 w-5" />
          </Button>
        </Link>
        <Button variant="ghost" size="icon" onClick={onSignOut} className="text-muted-foreground hover:text-destructive">
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;