"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RebelRanking } from '@/types/dashboard';
import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopTradersCardProps {
  ranking: RebelRanking[];
}

const TopTradersCard: React.FC<TopTradersCardProps> = ({ ranking }) => {
  return (
    <Card className="bg-card border border-border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-foreground">Top Traders Leaderboard</CardTitle>
        <Trophy className="h-5 w-5 text-yellow-500" />
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[50px]">Rank</TableHead>
              <TableHead>Trader</TableHead>
              <TableHead className="text-right">Profit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ranking.map((trader, index) => (
              <TableRow key={trader.id} className={cn(
                "hover:bg-muted/50",
                trader.featured && "bg-accent/20 hover:bg-accent/30"
              )}>
                <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={trader.avatar} alt={trader.name} />
                      <AvatarFallback>{trader.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground font-mono">{trader.name}</p> {/* Apply font-mono */}
                      <p className="text-xs text-muted-foreground font-mono">{trader.handle}</p> {/* Apply font-mono */}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span className="font-bold text-primary font-mono">${trader.points.toLocaleString()}</span> {/* Apply font-mono */}
                  {trader.streak && <span className="ml-2 text-xs text-yellow-500 font-mono">{trader.streak}</span>} {/* Apply font-mono */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TopTradersCard;