"use client";

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Bell, TrendingUp, TrendingDown } from 'lucide-react';

interface AlertItem {
  id: string;
  message: string;
  type: 'info' | 'positive' | 'negative';
}

const mockAlerts: AlertItem[] = [
  { id: 'a1', message: 'TSLA crosses $250 🚨', type: 'positive' },
  { id: 'a2', message: 'AAPL hits 3-month high 📢', type: 'positive' },
  { id: 'a3', message: 'Market volatility alert issued ⚠️', type: 'negative' },
  { id: 'a4', message: 'NVDA: High momentum detected 🚀', type: 'info' },
  { id: 'a5', message: 'GOOGL: Earnings report due next week 📅', type: 'info' },
  { id: 'a6', message: 'MSFT: Oversold conditions detected 📉', type: 'negative' },
  { id: 'a7', message: 'AMZN: Increased trading volume 📊', type: 'info' },
];

const AlertsBar: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>(mockAlerts);

  useEffect(() => {
    // Simulate new alerts appearing
    const interval = setInterval(() => {
      setAlerts(prev => {
        const newAlert: AlertItem = {
          id: Date.now().toString(),
          message: `New alert: ${['Stock X up', 'Stock Y down', 'Market news'][Math.floor(Math.random() * 3)]} ${Math.floor(Math.random() * 100)}%`,
          type: ['info', 'positive', 'negative'][Math.floor(Math.random() * 3)] as any,
        };
        return [...prev, newAlert].slice(-10); // Keep last 10 alerts
      });
    }, 20000); // Every 20 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-10 bg-gray-900/80 backdrop-blur-md border-t border-gray-700 flex items-center overflow-hidden z-40 shadow-lg">
      <div className="flex animate-marquee-horizontal whitespace-nowrap">
        {/* Duplicate alerts to create a seamless loop */}
        {[...alerts, ...alerts].map((alert, index) => (
          <div key={alert.id + '-' + index} className="inline-flex items-center mx-6 text-sm font-medium flex-shrink-0">
            <Bell className="h-4 w-4 text-electric-blue mr-2 animate-pulse-orb" />
            <span className={cn(
              "text-soft-white",
              alert.type === 'positive' && "text-teal",
              alert.type === 'negative' && "text-red-500"
            )}>
              {alert.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsBar;