"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Search, LayoutDashboard, Star, Brain, Bell, LayoutGrid, Cloud, Settings, Calculator, TrendingUp, Briefcase, Newspaper, CandlestickChart, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { LucideIcon } from 'lucide-react'; // Import LucideIcon type

interface OSSpotlightProps {
  isOpen: boolean;
  onClose: () => void;
  stocksList: string[];
  openApp: (appId: string, stockSymbol?: string, initialSearchText?: string) => void;
  setIsTradingViewMode: React.Dispatch<React.SetStateAction<boolean>>; // New prop
}

// Define a union type for searchable items
type SearchableItem =
  | { type: 'app'; id: string; name: string; icon: LucideIcon; keywords: string; action?: never; }
  | { type: 'stock'; id: string; name: string; icon: LucideIcon; keywords: string; action?: never; }
  | { type: 'command'; id: string; name: string; icon: LucideIcon; keywords: string; action: () => void; };


const OSSpotlight: React.FC<OSSpotlightProps> = ({ isOpen, onClose, stocksList, openApp, setIsTradingViewMode }) => {
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const apps = [
    { id: 'charts-app', name: 'Charts', icon: CandlestickChart },
    { id: 'watchlist-app', name: 'Watchlist', icon: Star },
    { id: 'trading-terminal', name: 'Trading Terminal', icon: TrendingUp },
    { id: 'portfolio-manager', name: 'Portfolio Manager', icon: Briefcase },
    { id: 'news-feed', name: 'News Feed', icon: Newspaper },
    { id: 'calculator', name: 'Calculator', icon: Calculator },
  ];

  const specialCommands = [
    {
      id: 'tradingiseasy',
      name: 'tradingiseasy',
      icon: TrendingUp,
      type: 'command',
      action: () => {
        setIsTradingViewMode(true);
        openApp('charts-app'); // Open charts app when activating TradingView mode
        toast.success("TradingView Mode Activated ✅", { duration: 3000 });
      }
    },
    {
      id: 'resetcharts',
      name: 'resetcharts',
      icon: RotateCcw,
      type: 'command',
      action: () => {
        setIsTradingViewMode(false);
        toast.info("Charts Reset", { description: "Switched back to default charts.", duration: 3000 });
      }
    }
  ];

  const allSearchableItems: SearchableItem[] = [
    ...apps.map((app): SearchableItem => ({ type: 'app', id: app.id, name: app.name, icon: app.icon, keywords: app.name.toLowerCase() })),
    ...stocksList.map((stock): SearchableItem => ({ type: 'stock', id: stock, name: stock, icon: CandlestickChart, keywords: stock.toLowerCase() })),
    ...specialCommands.map((cmd): SearchableItem => ({ type: cmd.type, id: cmd.id, name: cmd.name, icon: cmd.icon, keywords: cmd.name.toLowerCase(), action: cmd.action })),
  ];

  const filteredItems = allSearchableItems.filter(item =>
    item.keywords.includes(search.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setTimeout(() => inputRef.current?.focus(), 100); // Focus input after modal opens
    }
  }, [isOpen]);

  const handleSelect = useCallback((item: SearchableItem) => { // Use SearchableItem type
    if (item.type === 'app') {
      openApp(item.id);
    } else if (item.type === 'stock') {
      openApp('charts-app', item.id); // Open Charts app with selected stock
    } else if (item.type === 'command' && item.action) {
      item.action(); // Execute the special command action
    }
    onClose();
  }, [openApp, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-start justify-center p-8 z-[1000]
                 bg-black/50 backdrop-blur-lg"
      onClick={onClose}
    >
      <Command
        className="w-full max-w-3xl bg-gray-900/80 border border-gray-700 rounded-lg shadow-2xl overflow-hidden"
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            onClose();
          }
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <CommandInput
          ref={inputRef}
          placeholder="Search apps, stocks, documents..."
          value={search}
          onValueChange={setSearch}
          className="h-12 text-lg bg-gray-800/70 border-b border-gray-700 text-soft-white placeholder-gray-500 focus:ring-0 focus:border-0"
        />
        <CommandList className="max-h-[400px] overflow-y-auto custom-scrollbar">
          <CommandEmpty className="py-6 text-center text-gray-400">No results found.</CommandEmpty>
          <CommandGroup heading="Results" className="text-gray-400">
            {filteredItems.map((item) => (
              <CommandItem
                key={item.type === 'app' ? `app-${item.id}` : `stock-${item.id}`}
                onSelect={() => handleSelect(item)}
                className="flex items-center space-x-3 px-4 py-3 cursor-pointer hover:bg-gray-800/70 text-soft-white"
              >
                <item.icon className="h-5 w-5 text-electric-blue" />
                <span>{item.name}</span>
                <span className="ml-auto text-xs text-gray-500">{item.type === 'app' ? 'Application' : item.type === 'stock' ? 'Stock' : 'Command'}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};

export default OSSpotlight;