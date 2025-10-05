"use client";

import React, { useEffect, useRef } from 'react';
import { User, Settings, ChevronLeft, ChevronRight, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import ChartsSearchBar from './components/ChartsSearchBar'; // Import the new search bar component

interface ChartsNavbarProps {
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
  onSearch: (symbol: string) => void;
  userName: string;
  userAvatarUrl?: string;
  onToggleInsights: () => void;
  isInsightsPanelCollapsed: boolean;
}

const ChartsNavbar: React.FC<ChartsNavbarProps> = ({
  onToggleSidebar,
  isSidebarCollapsed,
  onSearch,
  userName,
  userAvatarUrl,
  onToggleInsights,
  isInsightsPanelCollapsed,
}) => {
  // The searchInputRef is now managed within ChartsSearchBar, but we keep the Alt+F listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Use Alt+F for focusing search bar in OS simulation
      if (event.altKey && event.code === 'KeyF') {
        event.preventDefault();
        // We can't directly focus the input inside ChartsSearchBar from here,
        // but we can trigger a toast or a global state to indicate focus.
        // For now, we'll just prevent default.
        toast.info("Search Focus", { description: "Search bar is ready for input." });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSettingsClick = () => {
    toast.info("Settings", { description: "Charts app settings coming soon!" });
  };

  return (
    <div className="flex items-center justify-between p-2 bg-charts-toolbar-bg backdrop-blur-lg border-b border-charts-border shadow-md relative z-10">
      {/* Left: Sidebar Toggle and Insights Toggle */}
      <div className="flex items-center space-x-2 flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="text-charts-text-secondary hover:text-charts-accent transition-colors duration-200"
          aria-label={isSidebarCollapsed ? "Expand Watchlist" : "Collapse Watchlist"}
        >
          {isSidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleInsights}
          className={cn(
            "text-charts-text-secondary hover:text-charts-accent transition-colors duration-200",
            !isInsightsPanelCollapsed && "text-charts-accent"
          )}
          aria-label={isInsightsPanelCollapsed ? "Show AI Insights" : "Hide AI Insights"}
        >
          <Brain className="h-5 w-5" />
        </Button>
      </div>

      {/* Center: App Title */}
      <h2 className="text-lg font-semibold text-charts-text-primary flex items-center space-x-2 flex-shrink-0 mx-4">
        <span className="text-charts-accent">📊</span>
        <span>Charts</span>
      </h2>

      {/* Right: Search Bar and Profile */}
      <div className="flex items-center space-x-3 flex-grow justify-end">
        <ChartsSearchBar onSearch={onSearch} /> {/* Using the new ChartsSearchBar component */}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full flex-shrink-0">
              <Avatar className="h-8 w-8">
                <AvatarImage src={userAvatarUrl || "/placeholder.svg"} alt={userName} />
                <AvatarFallback>
                  <User className="h-4 w-4 text-charts-text-secondary" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 bg-charts-panel-bg border border-charts-border text-charts-text-primary" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userName}</p>
                <p className="text-xs leading-none text-charts-text-secondary">
                  {/* User email could go here */}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-charts-border" />
            <DropdownMenuItem onClick={handleSettingsClick} className="flex items-center cursor-pointer hover:bg-gray-800 text-charts-text-primary">
              <Settings className="mr-2 h-4 w-4 text-charts-accent" />
              <span>Settings</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ChartsNavbar;