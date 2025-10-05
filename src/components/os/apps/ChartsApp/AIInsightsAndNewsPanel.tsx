"use client";

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, TrendingUp, AlertTriangle, Newspaper, Signal, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockNotifications } from '@/lib/mockData'; // Reusing mock notifications for news
import { toast } from 'sonner';

interface Insight {
  id: string;
  type: 'breakout' | 'momentum' | 'overbought' | 'oversold' | 'volatility';
  stock: string;
  message: string;
  timestamp: string;
}

interface NewsItem {
  id: string;
  headline: string;
  source: string;
  timestamp: string;
}

interface SignalItem {
  id: string;
  type: 'buy' | 'sell' | 'hold';
  stock: string;
  reason: string;
  strength: number; // 0-100
  timestamp: string;
}

const mockInsights: Insight[] = [
  { id: '1', type: 'breakout', stock: 'AAPL', message: '84% chance of breakout.', timestamp: '2 min ago' },
  { id: '2', type: 'momentum', stock: 'NVDA', message: 'High momentum detected.', timestamp: '5 min ago' },
  { id: '3', type: 'overbought', stock: 'TSLA', message: 'Overbought region.', timestamp: '10 min ago' },
  { id: '4', type: 'oversold', stock: 'MSFT', message: 'Oversold conditions.', timestamp: '15 min ago' },
  { id: '5', type: 'volatility', stock: 'AMZN', message: 'Increased volatility expected.', timestamp: '20 min ago' },
];

const mockNews: NewsItem[] = [
  { id: 'n1', headline: 'Tech sector sees strong Q3 earnings.', source: 'Reuters', timestamp: '1 hour ago' },
  { id: 'n2', headline: 'Global markets react to inflation data.', source: 'Bloomberg', timestamp: '2 hours ago' },
  { id: 'n3', headline: 'AAPL unveils new product line.', source: 'The Verge', timestamp: '3 hours ago' },
  { id: 'n4', headline: 'NVDA stock surges on AI chip demand.', source: 'WSJ', timestamp: '4 hours ago' },
];

const mockSignals: SignalItem[] = [
  { id: 's1', type: 'buy', stock: 'GOOGL', reason: 'Strong earnings outlook.', strength: 90, timestamp: '30 min ago' },
  { id: 's2', type: 'sell', stock: 'BABA', reason: 'Regulatory concerns.', strength: 75, timestamp: '1 hour ago' },
  { id: 's3', type: 'hold', stock: 'SBUX', reason: 'Stable performance.', strength: 60, timestamp: '2 hours ago' },
];

const AIInsightsAndNewsPanel: React.FC = () => {
  const [insights, setInsights] = useState<Insight[]>(mockInsights);
  const [news, setNews] = useState<NewsItem[]>(mockNews);
  const [signals, setSignals] = useState<SignalItem[]>(mockSignals);

  // Simulate real-time updates for insights
  useEffect(() => {
    const interval = setInterval(() => {
      setInsights(prev => {
        const newInsight: Insight = {
          id: Date.now().toString(),
          type: ['breakout', 'momentum', 'overbought', 'oversold', 'volatility'][Math.floor(Math.random() * 5)] as any,
          stock: ['AAPL', 'TSLA', 'MSFT', 'AMZN', 'NVDA', 'GOOGL'][Math.floor(Math.random() * 6)],
          message: `New insight for ${['AAPL', 'TSLA', 'MSFT', 'AMZN', 'NVDA', 'GOOGL'][Math.floor(Math.random() * 6)]}: ${Math.floor(Math.random() * 20) + 70}% chance of ${['breakout', 'reversal', 'consolidation'][Math.floor(Math.random() * 3)]}.`,
          timestamp: new Date().toLocaleTimeString(),
        };
        return [newInsight, ...prev].slice(0, 10); // Keep last 10
      });
    }, 15000); // Every 15 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col w-full bg-charts-panel-bg backdrop-blur-lg rounded-mac-window shadow-lg border border-charts-border overflow-hidden">
      <Tabs defaultValue="insights" className="w-full h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-3 rounded-none border-b border-charts-border bg-charts-toolbar-bg p-0">
          <TabsTrigger value="insights" className="rounded-none data-[state=active]:bg-charts-panel-bg data-[state=active]:text-charts-accent data-[state=active]:shadow-none text-charts-text-secondary hover:text-charts-accent">Insights</TabsTrigger>
          <TabsTrigger value="news" className="rounded-none data-[state=active]:bg-charts-panel-bg data-[state=active]:text-charts-accent data-[state=active]:shadow-none text-charts-text-secondary hover:text-charts-accent">News</TabsTrigger>
          <TabsTrigger value="signals" className="rounded-none data-[state=active]:bg-charts-panel-bg data-[state=active]:text-charts-accent data-[state=active]:shadow-none text-charts-text-secondary hover:text-charts-accent">Signals</TabsTrigger>
        </TabsList>
        <TabsContent value="insights" className="flex-grow p-4 overflow-y-auto custom-scrollbar mt-0">
          <ul className="space-y-3">
            {insights.length === 0 ? (
              <p className="text-charts-text-secondary text-sm">No AI insights available.</p>
            ) : (
              insights.map((insight) => (
                <li key={insight.id} className="flex items-start space-x-3 text-sm">
                  {insight.type === 'breakout' && <TrendingUp className="h-4 w-4 text-teal flex-shrink-0 mt-0.5" />}
                  {insight.type === 'momentum' && <Signal className="h-4 w-4 text-charts-accent flex-shrink-0 mt-0.5" />}
                  {insight.type === 'overbought' && <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />}
                  {insight.type === 'oversold' && <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />}
                  {insight.type === 'volatility' && <Newspaper className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />}
                  <div>
                    <p className="text-charts-text-primary"><span className="font-bold">{insight.stock}:</span> {insight.message}</p>
                    <span className="text-xs text-charts-text-secondary">{insight.timestamp}</span>
                  </div>
                </li>
              ))
            )}
          </ul>
        </TabsContent>
        <TabsContent value="news" className="flex-grow p-4 overflow-y-auto custom-scrollbar mt-0">
          <ul className="space-y-3">
            {news.length === 0 ? (
              <p className="text-charts-text-secondary text-sm">No recent news.</p>
            ) : (
              news.map((item) => (
                <li key={item.id} className="flex items-start space-x-3 text-sm">
                  <Newspaper className="h-4 w-4 text-charts-text-secondary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-charts-text-primary font-medium">{item.headline}</p>
                    <span className="text-xs text-charts-text-secondary">{item.source} - {item.timestamp}</span>
                  </div>
                </li>
              ))
            )}
          </ul>
        </TabsContent>
        <TabsContent value="signals" className="flex-grow p-4 overflow-y-auto custom-scrollbar mt-0">
          <ul className="space-y-3">
            {signals.length === 0 ? (
              <p className="text-charts-text-secondary text-sm">No trading signals available.</p>
            ) : (
              signals.map((signal) => (
                <li key={signal.id} className="flex items-start space-x-3 text-sm">
                  {signal.type === 'buy' && <TrendingUp className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />}
                  {signal.type === 'sell' && <TrendingDown className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />}
                  {signal.type === 'hold' && <Signal className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />}
                  <div>
                    <p className="text-charts-text-primary"><span className="font-bold">{signal.stock} ({signal.type.toUpperCase()}):</span> {signal.reason}</p>
                    <span className="text-xs text-charts-text-secondary">Strength: {signal.strength}% - {signal.timestamp}</span>
                  </div>
                </li>
              ))
            )}
          </ul>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIInsightsAndNewsPanel;