"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { StatCardProps } from '@/types/dashboard';

interface DashboardStatsProps {
  stats: StatCardProps[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-gray-800 border border-gray-700 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">{stat.title}</CardTitle>
            {stat.changeType === 'positive' ? (
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            ) : stat.changeType === 'negative' ? (
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            ) : null}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{stat.value}</div>
            <p className={`text-xs ${stat.changeType === 'positive' ? 'text-green-500' : stat.changeType === 'negative' ? 'text-red-500' : 'text-gray-400'}`}>
              {stat.change} from yesterday
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;