import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const themeOptions = [
  {
    name: 'ברירת מחדל',
    value: 'default',
    colors: {
      header: 'bg-gradient-to-br from-slate-100 via-white to-slate-50',
      headerText: 'text-slate-700',
      body: 'bg-white/60',
      border: 'border-slate-200'
    }
  },
  {
    name: 'כחול מקצועי',
    value: 'blue',
    colors: {
      header: 'bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100',
      headerText: 'text-blue-900',
      body: 'bg-blue-50/60',
      border: 'border-blue-200'
    }
  },
  {
    name: 'ירוק טבעי',
    value: 'green',
    colors: {
      header: 'bg-gradient-to-br from-green-100 via-green-50 to-emerald-100',
      headerText: 'text-green-900',
      body: 'bg-green-50/60',
      border: 'border-green-200'
    }
  },
  {
    name: 'סגול יצירתי',
    value: 'purple',
    colors: {
      header: 'bg-gradient-to-br from-purple-100 via-purple-50 to-violet-100',
      headerText: 'text-purple-900',
      body: 'bg-purple-50/60',
      border: 'border-purple-200'
    }
  }
];

interface TableThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

export function TableThemeSelector({ currentTheme, onThemeChange }: TableThemeSelectorProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          title="הגדרות נושא"
        >
          <Settings className="h-4 w-4" />
          נושא
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" side="left">
        <div className="space-y-4">
          <Label className="text-sm font-medium">בחר נושא לטבלה</Label>
          <Select value={currentTheme} onValueChange={onThemeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {themeOptions.map(theme => (
                <SelectItem key={theme.value} value={theme.value}>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded ${theme.colors.header.split(' ')[0]} border`} />
                    {theme.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="text-xs text-muted-foreground">
            הנושא יוחל על כל הטבלה
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export { themeOptions };