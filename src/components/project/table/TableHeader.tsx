import React from 'react';
import { Input } from '@/components/ui/input';
import { Column } from '@/types/Column';

interface TableHeaderProps {
  columns: Column[];
  editingHeader: string | null;
  setEditingHeader: (field: string | null) => void;
  columnHeaders: Record<string, string>;
  updateHeader: (field: string, value: string) => void;
  copyToClipboard: (text: string) => void;
}

export function TableHeader({
  columns,
  editingHeader,
  setEditingHeader,
  columnHeaders,
  updateHeader,
  copyToClipboard
}: TableHeaderProps) {
  const visibleColumns = columns
    .filter(col => col.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <thead>
      <tr>
        {visibleColumns.map((column, index) => (
          <th 
            key={column.id}
            className={`sticky top-0 z-20 bg-gradient-to-r from-blue-50 to-purple-50 text-right border-l-2 border-slate-200 font-bold text-slate-700 py-4 px-6 cursor-pointer hover:bg-blue-100 transition-colors ${
              index === 0 ? 'sticky right-0 z-30 shadow-sm' : ''
            } ${index === visibleColumns.length - 1 ? 'border-l-0' : ''}`}
            onDoubleClick={() => copyToClipboard(column.label)}
            onClick={() => setEditingHeader(column.id)}
          >
            {editingHeader === column.id ? (
              <Input
                value={columnHeaders[column.id] || column.label}
                onChange={(e) => updateHeader(column.id, e.target.value)}
                onBlur={() => setEditingHeader(null)}
                onKeyDown={(e) => e.key === 'Enter' && setEditingHeader(null)}
                autoFocus
                className="h-8 text-right font-bold"
              />
            ) : (
              columnHeaders[column.id] || column.label
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
}