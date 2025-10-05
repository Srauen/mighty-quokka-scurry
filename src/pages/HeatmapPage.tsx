"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, LayoutGrid } from 'lucide-react';
import MarketHeatmap from '@/components/dashboard/MarketHeatmap'; // Import the new component

const HeatmapPage: React.FC = () => {
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
            <LayoutGrid className="h-7 w-7 text-teal" />
            <span>Market Heatmap</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow p-0">
          <MarketHeatmap />
        </CardContent>
      </Card>
    </div>
  );
};

export default HeatmapPage;