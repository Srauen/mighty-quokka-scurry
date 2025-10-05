"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronLeft, Bell, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { mockNotifications } from '@/lib/mockData'; // Reusing mock notifications
import { cn } from '@/lib/utils';

// Extend mockNotifications for more variety on the dedicated page
const extendedMockAlerts = [
  ...mockNotifications,
  { id: "5", message: "TSLA: Price target updated to $280 by analyst.", timestamp: "1 hour ago", read: false, type: 'info' },
  { id: "6", message: "MSFT: Unusual options activity detected.", timestamp: "2 hours ago", read: true, type: 'info' },
  { id: "7", message: "GOOGL: Earnings beat expectations, stock up 5%.", timestamp: "3 hours ago", read: false, type: 'positive' },
  { id: "8", message: "AMZN: Supply chain disruption warning.", timestamp: "4 hours ago", read: true, type: 'negative' },
  { id: "9", message: "NVDA: New AI chip announced, pre-orders strong.", timestamp: "5 hours ago", read: false, type: 'positive' },
  { id: "10", message: "Market-wide: Increased volatility due to geopolitical tensions.", timestamp: "6 hours ago", read: false, type: 'negative' },
];

const AlertsPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#0B0B0B] text-soft-white p-6 font-mono">
      <div className="w-full max-w-6xl mx-auto mb-6 flex items-center justify-between">
        <Link to="/dashboard">
          <Button variant="ghost" className="text-gray-400 hover:text-electric-blue">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </Link>
      </div>

      <Card className="w-full max-w-6xl mx-auto glassmorphic-card flex flex-col flex-grow">
        <CardHeader className="p-6 border-b border-gray-700">
          <CardTitle className="text-3xl font-bold text-electric-blue flex items-center space-x-3">
            <Bell className="h-7 w-7 text-teal" />
            <span>All Alerts & Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow p-6 overflow-y-auto custom-scrollbar">
          {extendedMockAlerts.length === 0 ? (
            <p className="text-gray-400 text-lg text-center py-10">No alerts to display.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Message</TableHead>
                  <TableHead className="text-right text-gray-400">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {extendedMockAlerts.map((alert) => (
                  <TableRow key={alert.id} className={cn(
                    "border-gray-800 hover:bg-gray-700",
                    alert.read ? "text-gray-500" : "text-soft-white"
                  )}>
                    <TableCell>
                      {alert.type === 'positive' && <TrendingUp className="h-5 w-5 text-teal" />}
                      {alert.type === 'negative' && <TrendingDown className="h-5 w-5 text-red-500" />}
                      {alert.type === 'info' && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                      {!alert.read && <span className="ml-2 text-xs font-bold text-electric-blue">NEW</span>}
                    </TableCell>
                    <TableCell>{alert.message}</TableCell>
                    <TableCell className="text-right text-gray-500">{alert.timestamp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertsPage;