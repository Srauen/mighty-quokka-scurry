"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Search, LayoutDashboard, Star, Brain, Bell, LayoutGrid, Cloud, Settings, Calculator, TrendingUp, Briefcase, Newspaper, CandlestickChart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OSSpotlightProps {
  isOpen: boolean;
  onClose: () => void;
  stocksList: string[];
  openApp: (appId: string, stockSymbol?: string) => void;
}

const OSSpotlight: React.FC<OSSpotlightProps> = ({ isOpen, onClose, stocksList, openApp }) => {
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const apps = [
    { id: 'stock-chart', name: 'Stock Chart', icon: CandlestickChart },
    { id: 'trading-terminal', name: 'Trading Terminal', icon: TrendingUp },
    { id: 'portfolio-manager', name: 'Portfolio Manager', icon: Briefcase },
    { id: 'news-feed', name: 'News Feed', icon: Newspaper },
    { id: 'calculator', name: 'Calculator', icon: Calculator },
  ];

  const allSearchableItems = [
    ...apps.map(app => ({ type: 'app', id: app.id, name: app.name, icon: app.icon, keywords: app.name.toLowerCase() })),
    ...stocksList.map(stock => ({ type: 'stock', id: stock, name: stock, icon: CandlestickChart, keywords: stock.toLowerCase() })),
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

  const handleSelect = useCallback((item: typeof filteredItems[0]) => {
    if (item.type === 'app') {
      openApp(item.id);
    } else if (item.type === 'stock') {
      openApp('stock-chart', item.id); // Open stock chart with selected stock
    }
    onClose();
  }, [openApp, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start justify-center p-8 z-[1000]"
      onClick={onClose}
    >
      <Command
        className="w-full max-w-xl bg-gray-900 border border-gray-700 rounded-lg shadow-2xl overflow-hidden"
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            onClose();
          }
        }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <CommandInput
          ref={inputRef}
          placeholder="Search apps, stocks, documents..."
          value={search}
          onValueChange={setSearch}
          className="h-12 text-lg bg-gray-800 border-b border-gray-700 text-soft-white placeholder-gray-500 focus:ring-0 focus:border-0"
        />
        <CommandList className="max-h-[400px] overflow-y-auto custom-scrollbar">
          <CommandEmpty className="py-6 text-center text-gray-400">No results found.</CommandEmpty>
          <CommandGroup heading="Results" className="text-gray-400">
            {filteredItems.map((item) => (
              <CommandItem
                key={item.type === 'app' ? `app-${item.id}` : `stock-${item.id}`}
                onSelect={() => handleSelect(item)}
                className="flex items-center space-x-3 px-4 py-3 cursor-pointer hover:bg-gray-800 text-soft-white"
              >
                <item.icon className="h-5 w-5 text-electric-blue" />
                <span>{item.name}</span>
                <span className="ml-auto text-xs text-gray-500">{item.type === 'app' ? 'Application' : 'Stock'}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};

export default OSSpotlight;