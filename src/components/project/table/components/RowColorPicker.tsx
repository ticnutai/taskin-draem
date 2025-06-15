import React from 'react';
import { Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export const colorOptions = [
  { name: 'ברירת מחדל', value: '', bg: 'bg-white', text: 'text-slate-900' },
  { name: 'אדום עדין', value: 'red', bg: 'bg-red-50', text: 'text-red-900', border: 'border-red-200' },
  { name: 'ירוק עדין', value: 'green', bg: 'bg-green-50', text: 'text-green-900', border: 'border-green-200' },
  { name: 'כחול עדין', value: 'blue', bg: 'bg-blue-50', text: 'text-blue-900', border: 'border-blue-200' },
  { name: 'צהוב עדין', value: 'yellow', bg: 'bg-yellow-50', text: 'text-yellow-900', border: 'border-yellow-200' },
  { name: 'סגול עדין', value: 'purple', bg: 'bg-purple-50', text: 'text-purple-900', border: 'border-purple-200' },
  { name: 'ורוד עדין', value: 'pink', bg: 'bg-pink-50', text: 'text-pink-900', border: 'border-pink-200' },
];

interface RowColorPickerProps {
  taskId: string;
  currentColor: string;
  onColorChange: (taskId: string, color: string) => void;
}

export function RowColorPicker({ taskId, currentColor, onColorChange }: RowColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
          title="שנה צבע שורה"
        >
          <Palette className="h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" side="left">
        <div className="grid grid-cols-4 gap-1">
          {colorOptions.map(option => (
            <Button
              key={option.value}
              onClick={() => onColorChange(taskId, option.value)}
              className={`w-6 h-6 p-0 rounded-full border-2 hover:scale-110 transition-transform ${option.bg} ${option.border || 'border-gray-200'} ${
                currentColor === option.value ? 'ring-2 ring-blue-500' : ''
              }`}
              title={option.name}
              variant="ghost"
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}