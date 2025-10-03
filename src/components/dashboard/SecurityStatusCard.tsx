"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';
import { SecurityStatus } from '@/types/dashboard';
import { cn } from '@/lib/utils';

interface SecurityStatusCardProps {
  statusData: SecurityStatus[];
}

const iconMap: { [key: string]: React.ElementType } = {
  success: ShieldCheck,
  warning: ShieldAlert,
  destructive: ShieldX,
};

const SecurityStatusCard: React.FC<SecurityStatusCardProps> = ({ statusData }) => {
  return (
    <Card className="bg-card border border-border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-foreground">Security Status</CardTitle>
        <ShieldCheck className="h-5 w-5 text-green-500" />
      </CardHeader>
      <CardContent className="space-y-4">
        {statusData.map((item, index) => {
          const IconComponent = iconMap[item.variant] || ShieldCheck;
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <IconComponent className={cn(
                  "h-5 w-5",
                  item.variant === "success" && "text-green-500",
                  item.variant === "warning" && "text-yellow-500",
                  item.variant === "destructive" && "text-red-500"
                )} />
                <div>
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.value}</p>
                </div>
              </div>
              <Badge
                className={cn(
                  "text-xs font-semibold",
                  item.variant === "success" && "bg-green-500/20 text-green-500",
                  item.variant === "warning" && "bg-yellow-500/20 text-yellow-500",
                  item.variant === "destructive" && "bg-red-500/20 text-red-500"
                )}
              >
                {item.status}
              </Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default SecurityStatusCard;