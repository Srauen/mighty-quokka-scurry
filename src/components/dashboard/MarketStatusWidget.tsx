"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';

interface MarketStatusWidgetProps {
  status: 'open' | 'closed';
  marketIndex: string;
  indexValue: number;
  indexChange: number;
}

const MarketStatusWidget: React.FC<MarketStatusWidgetProps> = ({ status, marketIndex, indexValue, indexChange }) => {
  const isMarketOpen = status === 'open';
  const isPositiveChange = indexChange >= 0;

  return (
    <Card className="bg-gray-800 border border-gray-700 text-white shadow-lg">
      <CardHeader className="p-4 border-b border-gray-700">
        <CardTitle className="text-lg font-semibold text-green-400">Market Status</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center space-x-2">
          {isMarketOpen ? (
            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-green-500" />
          ) : (
            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-red-500" />
          )}
          <p className={`text-sm font-medium ${isMarketOpen ? 'text-green-500' : 'text-red-500'}`}>
            Market is {isMarketOpen ? 'Open' : 'Closed'}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-gray-400">{marketIndex}</p>
          <div className="flex items-center space-x-1">
            <span className="text-lg font-bold text-green-400">${indexValue.toFixed(2)}</span>
            {isPositiveChange ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={`${isPositiveChange ? 'text-green-500' : 'text-red-500'} text-sm`}>
              {indexChange.toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-gray-500 text-xs">
          <Clock className="h-3 w-3" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketStatusWidget;