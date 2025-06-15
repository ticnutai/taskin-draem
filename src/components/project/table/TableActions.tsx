import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Edit } from 'lucide-react';

interface TableActionsProps {
  onAddRow: () => void;
  onAddColumn: () => void;
  onColumnToggle: () => void;
}

export function TableActions({
  onAddRow,
  onAddColumn,
  onColumnToggle
}: TableActionsProps) {
  return (
    <div className="flex gap-2 mb-4 justify-start">
      <Button
        onClick={onAddRow}
        className="bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 border-green-300 text-green-800"
        variant="outline"
      >
        <Plus className="w-4 h-4 ml-2" />
        הוספת שורה
      </Button>
      
      <Button
        onClick={onAddColumn}
        className="bg-gradient-to-r from-blue-100 to-cyan-100 hover:from-blue-200 hover:to-cyan-200 border-blue-300 text-blue-800"
        variant="outline"
      >
        <Plus className="w-4 h-4 ml-2" />
        הוספת עמודה
      </Button>
      
      <Button
        onClick={onColumnToggle}
        className="bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 border-purple-300 text-purple-800"
        variant="outline"
      >
        <Edit className="w-4 h-4 ml-2" />
        ניהול עמודות
      </Button>
    </div>
  );
}