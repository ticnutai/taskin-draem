import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ProgressCardsProps {
  projectProgress: { [key: string]: { total: number; completed: number } };
  clients: string[];
}

export function ProgressCards({ projectProgress, clients }: ProgressCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {clients.map(client => {
        const stats = projectProgress[client];
        const percentage = stats ? Math.round((stats.completed / stats.total) * 100) : 0;
        return (
          <Card key={client}>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">{client}</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>התקדמות</span>
                  <span>{percentage}%</span>
                </div>
                <Progress value={percentage} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  {stats?.completed || 0} מתוך {stats?.total || 0} משימות הושלמו
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}