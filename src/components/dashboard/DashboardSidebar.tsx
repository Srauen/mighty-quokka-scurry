"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, List, LayoutGrid, TrendingUp, TrendingDown, Star, LayoutDashboard, Brain, Settings, ChevronLeft, ChevronRight, Cloud } from 'lucide-react'; // Added Cloud icon
import { mockNotifications } from '@/lib/mockData';
import { useStockData } from '@/hooks/use-stock-data';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const DashboardSidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  // Removed useStockData and mockNotifications as they are no longer needed directly in the sidebar for content.

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', link: '/dashboard' },
    { id: 'watchlist', icon: Star, label: 'Watchlist', link: '/dashboard/watchlist' },
    { id: 'ai-insights', icon: Brain, label: 'AI Insights', link: '/dashboard/ai-insights' },
    { id: 'alerts', icon: Bell, label: 'Alerts', link: '/dashboard/alerts' },
    { id: 'heatmap', icon: LayoutGrid, label: 'Heatmap', link: '/dashboard/heatmap' },
    { id: 'os-connect', icon: Cloud, label: 'OS Connect', link: '/dashboard/os-connect' }, // New item
    { id: 'settings', icon: Settings, label: 'Settings', link: '/dashboard/settings' },
  ];

  return (
    <aside className={cn(
      "hidden md:flex bg-gray-900 border-r border-gray-700 p-4 flex-col shadow-lg z-20 transition-all duration-300 ease-in-out",
      isCollapsed ? "w-20 items-center" : "w-64"
    )}>
      <div className={cn("flex items-center mb-6", isCollapsed ? "justify-center" : "justify-end")}>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-400 hover:text-electric-blue"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      <nav className="flex-grow space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.id}
            to={item.link}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex items-center py-2 px-3 rounded-md text-soft-white transition-colors duration-200 group",
              activeTab === item.id ? "bg-gray-800 text-electric-blue animate-glow-subtle" : "hover:bg-gray-800 hover:text-electric-blue"
            )}
          >
            <item.icon className={cn("h-5 w-5", isCollapsed ? "mr-0" : "mr-3", activeTab === item.id ? "text-electric-blue" : "text-gray-400 group-hover:text-electric-blue")} />
            {!isCollapsed && (
              <span className={cn("text-sm font-medium", activeTab === item.id ? "text-electric-blue" : "text-soft-white group-hover:text-electric-blue")}>
                {item.label}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Removed conditional content rendering from sidebar as features now have dedicated pages */}
    </aside>
  );
};

export default DashboardSidebar;