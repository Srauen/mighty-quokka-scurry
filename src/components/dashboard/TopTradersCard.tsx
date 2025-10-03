"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { Trader } from '@/types/dashboard';

interface TopTradersCardProps {
  traders: Trader[];
}

const TopTradersCard: React.FC<TopTradersCardProps> = ({ traders }) => {
  return (
    <Card className="bg-gray-800 border border-gray-700 text-white shadow-lg">
      <CardHeader className="p-4 border-b border-gray-700">
        <CardTitle className="text-lg font-semibold text-green-400">Top Traders</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ul className="space-y-3">
          {traders.map((trader) => (
            <li key={trader.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={trader.avatar} alt={trader.name} />
                  <AvatarFallback><User className="h-4 w-4 text-gray-400" /></AvatarFallback>
                </Avatar>
                <span className="text-gray-300">{trader.name}</span>
              </div>
              <span className="text-green-500 font-medium">${trader.profit.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default TopTradersCard;