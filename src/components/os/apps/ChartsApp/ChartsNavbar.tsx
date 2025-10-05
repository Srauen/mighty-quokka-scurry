"use client";

import React, { useEffect, useRef } from 'react';
import { Search, User, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ChartsNavbarProps {
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
  onSearch: (symbol: string) => void;
  userName: string;
  userAvatarUrl?: string;
}

const ChartsNavbar: React.FC<ChartsNavbarProps> = ({
  onToggleSidebar,
  isSidebarCollapsed,
  onSearch,
  userName,
  userAvatarUrl,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Use Alt+F for focusing search bar in OS simulation
      if (event.altKey && event.code === 'KeyF') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInputRef.current?.value) {
      onSearch(searchInputRef.current.value.toUpperCase());
      searchInputRef.current.value = '';
    }
  };

  const handleSettingsClick = () => {
    toast.info("Settings", { description: "Charts app settings coming soon!" });
  };

  return (
    <div className="flex items-center justify-between p-2 bg-charts-toolbar-bg backdrop-blur-lg border-b border-charts-border shadow-md relative z-10">
      {/* Left: Sidebar Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSidebar}
        className="text-charts-text-secondary hover:text-charts-accent transition-colors duration-200"
        aria-label={isSidebarCollapsed ? "Expand Watchlist" : "Collapse Watchlist"}
      >
        {isSidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
      </Button>

      {/* Center: App Title */}
      <h2 className="text-lg font-semibold text-charts-text-primary flex items-center space-x-2">
        <span className="text-charts-accent">📊</span>
        <span>Charts</span>
      </h2>

      {/* Right: Search, Profile, Settings */}
      <div className="flex items-center space-x-3">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-charts-text-secondary" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search symbol or company..."
            className="pl-8 pr-3 py-1.5 rounded-md bg-charts-panel-bg border border-charts-border text-charts-text-primary placeholder-charts-text-secondary focus:ring-1 focus:ring-charts-accent focus:border-charts-accent transition-all duration-200 w-40 md:w-56"
          />
        </form>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
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