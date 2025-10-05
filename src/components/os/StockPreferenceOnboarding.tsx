"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Lightbulb, TrendingUp, Wallet, Brain, Zap, Globe } from 'lucide-react';
import { useStockData } from '@/hooks/use-stock-data';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface StockPreferenceOnboardingProps {
  isOpen: boolean;
  onComplete: (selectedPortfolio: { [key: string]: number }) => void;
}

interface PreferenceOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  keywords: string[]; // Used to match with stock sectors/types
}

const preferenceOptions: PreferenceOption[] = [
  {
    id: 'tech-growth',
    title: 'Tech & Growth',
    description: 'Focus on innovative technology companies with high growth potential.',
    icon: <Zap className="w-8 h-8 text-electric-blue" />,
    keywords: ['Technology', 'Growth', 'Innovation'],
  },
  {
    id: 'stable-value',
    title: 'Stable & Value',
    description: 'Invest in established companies with consistent performance and dividends.',
    icon: <Wallet className="w-8 h-8 text-teal" />,
    keywords: ['Financials', 'Consumer Staples', 'Healthcare', 'Value', 'Stability'],
  },
  {
    id: 'diversified',
    title: 'Diversified Portfolio',
    description: 'A balanced mix across various sectors to minimize risk.',
    icon: <Globe className="w-8 h-8 text-yellow-400" />,
    keywords: ['Diversified', 'Balanced', 'Mixed'],
  },
  {
    id: 'energy-commodities',
    title: 'Energy & Commodities',
    description: 'Target companies in the energy and raw materials sectors.',
    icon: <TrendingUp className="w-8 h-8 text-red-500" />,
    keywords: ['Energy', 'Commodities', 'Materials'],
  },
];

const StockPreferenceOnboarding: React.FC<StockPreferenceOnboardingProps> = ({ isOpen, onComplete }) => {
  const { stocksList, stockData } = useStockData();
  const [selectedPreference, setSelectedPreference] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generatePortfolio = useCallback(() => {
    if (!selectedPreference) {
      toast.error("Selection Required", { description: "Please select a preference to generate your portfolio." });
      return {};
    }

    const option = preferenceOptions.find(opt => opt.id === selectedPreference);
    if (!option) return {};

    const newPortfolio: { [key: string]: number } = {};
    const availableStocks = stocksList.filter(symbol => stockData[symbol]);

    // Filter stocks based on keywords/sectors
    let candidateStocks = availableStocks.filter(symbol => {
      const stock = stockData[symbol];
      return option.keywords.some(keyword =>
        stock.sector.toLowerCase().includes(keyword.toLowerCase()) ||
        stock.companyName.toLowerCase().includes(keyword.toLowerCase())
      );
    });

    // If no specific stocks found, fall back to a general diversified set
    if (candidateStocks.length === 0 || option.id === 'diversified') {
      candidateStocks = availableStocks;
    }

    // Select a few stocks (e.g., 3-5) and assign random quantities
    const numStocks = Math.min(5, candidateStocks.length);
    const shuffledStocks = candidateStocks.sort(() => 0.5 - Math.random());

    for (let i = 0; i < numStocks; i++) {
      const symbol = shuffledStocks[i];
      if (symbol) {
        newPortfolio[symbol] = Math.floor(Math.random() * 10) + 5; // 5-14 shares
      }
    }
    return newPortfolio;
  }, [selectedPreference, stocksList, stockData]);

  const handleConfirm = () => {
    setLoading(true);
    const newPortfolio = generatePortfolio();
    onComplete(newPortfolio);
    setLoading(false);
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[600px] bg-gray-900 text-white border-gray-700">
        <DialogHeader className="flex flex-col items-center text-center">
          <Brain className="w-16 h-16 text-electric-blue mb-4 animate-pulse-orb" />
          <DialogTitle className="text-3xl font-bold mb-2">Tailor Your Trading Experience</DialogTitle>
          <DialogDescription className="text-lg text-gray-300">
            To personalize your Stock OS, tell us about your investment preferences.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6">
          {preferenceOptions.map((option) => (
            <div
              key={option.id}
              className={cn(
                "flex flex-col items-center text-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200",
                selectedPreference === option.id
                  ? "border-electric-blue bg-charts-panel-bg shadow-lg"
                  : "border-gray-700 bg-gray-800 hover:border-gray-600 hover:bg-gray-700"
              )}
              onClick={() => setSelectedPreference(option.id)}
            >
              <div className="mb-3">{option.icon}</div>
              <h4 className="text-lg font-semibold text-soft-white mb-1">{option.title}</h4>
              <p className="text-sm text-gray-400">{option.description}</p>
            </div>
          ))}
        </div>
        <DialogFooter className="flex justify-center pt-6">
          <Button
            onClick={handleConfirm}
            disabled={loading || !selectedPreference}
            className="bg-electric-blue hover:bg-electric-blue/90 text-white text-lg px-6 py-3"
          >
            {loading ? 'Generating...' : 'Confirm Preferences'} <CheckCircle className="ml-2 h-5 w-5" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StockPreferenceOnboarding;