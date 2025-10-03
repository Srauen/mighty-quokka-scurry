"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

interface SecurityStatusCardProps {
  status: 'secure' | 'warning';
  message: string;
}

const SecurityStatusCard: React.FC<SecurityStatusCardProps> = ({ status, message }) => {
  const isSecure = status === 'secure';
  return (
    <Card className={`bg-gray-800 border ${isSecure ? 'border-green-700' : 'border-yellow-600'} text-white shadow-lg`}>
      <CardHeader className="p-4 border-b border-gray-700">
        <CardTitle className="text-lg font-semibold text-green-400">Security Status</CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex items-center space-x-3">
        {isSecure ? (
          <ShieldCheck className="h-6 w-6 text-green-500" />
        ) : (
          <AlertTriangle className="h-6 w-6 text-yellow-500" />
        )}
        <p className="text-gray-300">{message}</p>
      </CardContent>
    </Card>
  );
};

export default SecurityStatusCard;