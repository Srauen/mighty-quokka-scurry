"use client";

import React, { useState, useEffect } from 'react';
import { Apple, Wifi, BatteryCharging, Search, Settings, Bell, LayoutGrid, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface OSTopBarProps {
  onOpenSpotlight: () => void;
  onOpenSettings: () => void;
  onOpenNotifications: () => void;
  onOpenHeatmap: () => void;
}

const OSTopBar: React.FC<OSTopBarProps> = ({ onOpenSpotlight, onOpenSettings, onOpenNotifications, onOpenHeatmap }) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState(90); // Mock battery level
  const [isCharging, setIsCharging] = useState(true); // Mock charging status

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock battery updates
  useEffect(() => {
    const batteryInterval = setInterval(() => {
      setBatteryLevel(prev => {
        if (isCharging) {
          return Math.min(100, prev + 1);
        } else {
          return Math.max(0, prev - 1);
        }
      });
      // Simulate charging/discharging toggle
      if (Math.random() < 0.1) { // 10% chance to toggle charging status
        setIsCharging(prev => !prev);
      }
    }, 5000); // Update every 5 seconds
    return () => clearInterval(batteryInterval);
  }, [isCharging]);

  const formatDateTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };
    return date.toLocaleString('en-US', options);
  };

  const handleMenuClick = (menuItem: string) => {
    toast.info(`${menuItem} Menu`, { description: `${menuItem} functionality coming soon!` });
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-8 bg-mac-menubar-bg backdrop-blur-lg flex items-center justify-between px-4 z-[1000] text-soft-white text-sm font-sans border-b border-gray-800">
      {/* Left Section: Apple Logo and Menu Items */}
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-soft-white hover:bg-white/20">
              <Apple className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 bg-charts-panel-bg border border-charts-border text-charts-text-primary" align="start">
            <DropdownMenuItem onClick={() => handleMenuClick("About Stock OS")}>About Stock OS</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-charts-border" />
            <DropdownMenuItem onClick={() => handleMenuClick("System Settings")}>System Settings...</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuClick("Restart")}>Restart...</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuClick("Shut Down")}>Shut Down...</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <span className="font-semibold">Stock OS</span>
        <span className="text-gray-400">File</span>
        <span className="text-gray-400">Edit</span>
        <span className="text-gray-400">View</span>
        <span className="text-gray-400">Window</span>
        <span className="text-gray-400">Help</span>
      </div>

      {/* Right Section: System Icons and Date/Time */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:bg-white/20" onClick={() => toast.info("Wi-Fi", { description: "Wi-Fi status: Connected" })}>
          <Wifi className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-6 px-2 text-gray-400 hover:bg-white/20 flex items-center space-x-1" onClick={() => toast.info("Battery", { description: `Battery: ${batteryLevel}% ${isCharging ? '(Charging)' : '(Discharging)'}` })}>
          <BatteryCharging className={cn("h-4 w-4", isCharging ? "text-teal" : "text-soft-white")} />
          <span>{batteryLevel}%</span>
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:bg-white/20" onClick={onOpenNotifications} aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:bg-white/20" onClick={onOpenSpotlight} aria-label="Search / Spotlight">
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:bg-white/20" onClick={onOpenSettings} aria-label="Settings">
          <Settings className="h-4 w-4" />
        </Button>
        <span className="text-soft-white">{formatDateTime(currentDateTime)}</span>
      </div>
    </div>
  );
};

export default OSTopBar;