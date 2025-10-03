"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Notification } from '@/types/dashboard';
import { cn } from '@/lib/utils';
import { formatDistanceToNowStrict } from 'date-fns';

interface NotificationsCardProps {
  notifications: Notification[];
}

const iconMap: { [key: string]: React.ElementType } = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
  error: XCircle,
};

const NotificationsCard: React.FC<NotificationsCardProps> = ({ notifications }) => {
  return (
    <Card className="bg-card border border-border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-foreground">Trading Alerts</CardTitle>
        <Bell className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          <div className="p-4 space-y-4">
            {notifications.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center">No new notifications.</p>
            ) : (
              notifications.map((notif) => {
                const IconComponent = iconMap[notif.type] || Info;
                return (
                  <div
                    key={notif.id}
                    className={cn(
                      "flex items-start space-x-3 p-3 rounded-md transition-colors",
                      !notif.read ? "bg-accent/20 hover:bg-accent/30" : "hover:bg-muted/50"
                    )}
                  >
                    <IconComponent
                      className={cn(
                        "h-5 w-5 flex-shrink-0",
                        notif.type === "info" && "text-blue-500",
                        notif.type === "warning" && "text-yellow-500",
                        notif.type === "success" && "text-green-500",
                        notif.type === "error" && "text-red-500"
                      )}
                    />
                    <div className="flex-grow">
                      <p className="font-medium text-foreground">{notif.title}</p>
                      <p className="text-sm text-muted-foreground">{notif.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNowStrict(new Date(notif.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default NotificationsCard;