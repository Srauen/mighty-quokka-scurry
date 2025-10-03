"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Clock, CalendarDays, TrendingUp } from 'lucide-react'; // Updated icons
import { WidgetData } from '@/types/dashboard';

interface MarketStatusWidgetProps {
  widgetData: WidgetData;
}

const MarketStatusWidget: React.FC<MarketStatusWidgetProps> = ({ widgetData }) => {
  return (
    <Card className="bg-card border border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Global Market Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-3">
          <Globe className="h-5 w-5 text-muted-foreground" />
          <p className="text-foreground">{widgetData.location}</p>
        </div>
        <div className="flex items-center space-x-3">
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
          <p className="text-foreground">{widgetData.weather}</p> {/* Now displays market status */}
        </div>
        <div className="flex items-center space-x-3">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <p className="text-foreground">{widgetData.timezone}</p>
        </div>
        <div className="flex items-center space-x-3">
          <CalendarDays className="h-5 w-5 text-muted-foreground" />
          <p className="text-foreground">{widgetData.date}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketStatusWidget;