"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RebelRanking } from '@/types/dashboard';
import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RebelsRankingCardProps {
  ranking: RebelRanking[];
}

const RebelsRankingCard: React.FC<RebelsRankingCardProps> = ({ ranking }) => {
  return (
    <Card className="bg-card border border-border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-foreground">Rebels Ranking</CardTitle>
        <Trophy className="h-5 w-5 text-yellow-500" />
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[50px]">Rank</TableHead>
              <TableHead>Rebel</TableHead>
              <TableHead className="text-right">Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ranking.map((rebel, index) => (
              <TableRow key={rebel.id} className={cn(
                "hover:bg-muted/50",
                rebel.featured && "bg-accent/20 hover:bg-accent/30"
              )}>
                <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={rebel.avatar} alt={rebel.name} />
                      <AvatarFallback>{rebel.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">{rebel.name}</p>
                      <p className="text-xs text-muted-foreground">{rebel.handle}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span className="font-bold text-primary">{rebel.points}</span>
                  {rebel.streak && <span className="ml-2 text-xs text-yellow-500">{rebel.streak}</span>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RebelsRankingCard;