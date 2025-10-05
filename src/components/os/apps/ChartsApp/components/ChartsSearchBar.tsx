"use client";

import React, { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface ChartsSearchBarProps {
  onSearch: (symbol: string) => void;
}

const ChartsSearchBar: React.FC<ChartsSearchBarProps> = ({ onSearch }) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInputRef.current?.value) {
      onSearch(searchInputRef.current.value.toUpperCase());
      searchInputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSearchSubmit} className="relative flex-grow max-w-md">
      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-charts-text-secondary" />
      <Input
        ref={searchInputRef}
        type="text"
        placeholder="Search symbol or company..."
        className="pl-8 pr-3 py-1.5 rounded-md bg-charts-panel-bg border border-charts-border text-charts-text-primary placeholder-charts-text-secondary focus:ring-1 focus:ring-charts-accent focus:border-charts-accent transition-all duration-200 w-full"
      />
    </form>
  );
};

export default ChartsSearchBar;