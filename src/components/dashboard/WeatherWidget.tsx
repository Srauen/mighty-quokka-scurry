"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, MapPin, Thermometer, Clock } from 'lucide-react';
import { WidgetData } from '@/types/dashboard';

interface WeatherWidgetProps {
  widgetData: WidgetData;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ widgetData }) => {
  return (
    <Card className="bg-card border border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Local Weather</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-3">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <p className="text-foreground">{widgetData.location}</p>
        </div>
        <div className="flex items-center space-x-3">
          <Thermometer className="h-5 w-5 text-muted-foreground" />
          <p className="text-foreground">{widgetData.temperature} - {widgetData.weather}</p>
        </div>
        <div className="flex items-center space-x-3">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <p className="text-foreground">{widgetData.timezone}</p>
        </div>
        <p className="text-sm text-muted-foreground">{widgetData.date}</p>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;