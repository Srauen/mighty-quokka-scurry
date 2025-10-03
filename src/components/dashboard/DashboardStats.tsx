"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp, LineChart, TrendingUp, Briefcase } from 'lucide-react'; // Updated icons
import { DashboardStat } from '@/types/dashboard';
import { cn } from '@/lib/utils';

interface DashboardStatsProps {
  stats: DashboardStat[];
}

const iconMap: { [key: string]: React.ElementType } = {
  LineChart, // New icon
  TrendingUp, // New icon
  Briefcase, // New icon
};

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => {
        const IconComponent = iconMap[stat.icon] || LineChart; // Default to LineChart
        return (
          <Card key={index} className="bg-card border border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase">
                {stat.label}
              </CardTitle>
              <IconComponent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className={cn(
                "text-xs",
                stat.intent === "positive" && "text-green-500",
                stat.intent === "negative" && "text-red-500",
                stat.intent === "neutral" && "text-muted-foreground"
              )}>
                {stat.description}
                {stat.tag && <span className="ml-2 px-2 py-0.5 bg-accent text-accent-foreground rounded-full text-xs">{stat.tag}</span>}
              </p>
              {stat.direction && (
                <div className="flex items-center text-xs mt-1">
                  {stat.direction === "up" ? (
                    <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={cn(
                    stat.direction === "up" && "text-green-500",
                    stat.direction === "down" && "text-red-500"
                  )}>
                    {stat.value} {stat.direction === "up" ? "increase" : "decrease"}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStats;