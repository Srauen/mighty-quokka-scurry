"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BellRing } from 'lucide-react';
import { Notification } from '@/types/dashboard';

interface NotificationsCardProps {
  notifications: Notification[];
}

const NotificationsCard: React.FC<NotificationsCardProps> = ({ notifications }) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card className="bg-gray-800 border border-gray-700 text-white shadow-lg">
      <CardHeader className="p-4 border-b border-gray-700 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-green-400">Notifications</CardTitle>
        {unreadCount > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {unreadCount} New
          </span>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <ul className="space-y-3 max-h-40 overflow-y-auto custom-scrollbar">
          {notifications.length === 0 ? (
            <p className="text-gray-400 text-sm">No new notifications.</p>
          ) : (
            notifications.map((notification) => (
              <li key={notification.id} className={`flex items-start space-x-3 ${notification.read ? 'text-gray-500' : 'text-gray-300'}`}>
                <BellRing className={`h-4 w-4 ${notification.read ? 'text-gray-500' : 'text-blue-400'} flex-shrink-0 mt-1`} />
                <div>
                  <p className="text-sm">{notification.message}</p>
                  <span className="text-xs text-gray-500">{notification.timestamp}</span>
                </div>
              </li>
            ))
          )}
        </ul>
      </CardContent>
    </Card>
  );
};

export default NotificationsCard;