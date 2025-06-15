import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Plus } from 'lucide-react';

interface TableControlsProps {
  onColumnToggle: () => void;
  onAddRow: () => void;
  onAddColumn: () => void;
}

export function TableControls({
  onColumnToggle,
  onAddRow,
  onAddColumn
}: TableControlsProps) {
  return (
    <div className="flex justify-start gap-2 mb-4">
      <Button
        variant="outline"
        onClick={onColumnToggle}
        className="bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 border-blue-300"
      >
        <Settings className="w-4 h-4 ml-2" />
        ניהול עמודות
      </Button>
      <Button
        variant="outline"
        onClick={onAddRow}
        className="bg-gradient-to-r from-green-100 to-blue-100 hover:from-green-200 hover:to-blue-200 border-green-300"
      >
        <Plus className="w-4 h-4 ml-2" />
        הוסף שורה
      </Button>
      <Button
        variant="outline"
        onClick={onAddColumn}
        className="bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 border-purple-300"
      >
        <Plus className="w-4 h-4 ml-2" />
        הוסף עמודה
      </Button>
    </div>
  );
}