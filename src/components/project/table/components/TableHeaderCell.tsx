import React from 'react';
import { Column } from '@/types/Column';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { ColumnFilter } from './ColumnFilter';
import { statusOptions } from '@/types/Task';

interface TableHeaderCellProps {
  column: Column;
  index: number;
  totalColumns: number;
  isEditing: boolean;
  headerValue: string;
  isHighlighted: boolean;
  columnWidth: number;
  onEdit: () => void;
  onHeaderChange: (value: string) => void;
  onEditEnd: () => void;
  onHighlightToggle: () => void;
  onCopy: (text: string) => void;
  onResize: (e: React.MouseEvent) => void;
  onDelete?: () => void;
  themeColors: any;
  columnFilters: Record<string, string>;
  onFilterChange: (columnId: string, value: string) => void;
  onClearFilter: (columnId: string) => void;
}

export function TableHeaderCell({
  column,
  index,
  totalColumns,
  isEditing,
  headerValue,
  isHighlighted,
  columnWidth,
  onEdit,
  onHeaderChange,
  onEditEnd,
  onHighlightToggle,
  onCopy,
  onResize,
  onDelete,
  themeColors,
  columnFilters,
  onFilterChange,
  onClearFilter
}: TableHeaderCellProps) {
  const getColumnType = () => {
    if (column.id === 'status') return 'status';
    if (column.id === 'dueDate') return 'date';
    return 'text';
  };

  return (
    <th 
      key={column.id}
      className={`group relative sticky top-0 text-right font-bold py-5 px-8 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
        column.id === 'clientName' 
          ? 'sticky left-0 z-50 bg-gradient-to-r from-blue-200 via-blue-50 to-blue-200 shadow-2xl border-l-4 border-r-4 border-blue-400 text-blue-900 font-extrabold' 
          : isHighlighted
            ? 'bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-100 text-amber-900 shadow-lg border-amber-200 z-20'
            : `${themeColors.header} ${themeColors.headerText} hover:shadow-md z-20`
      } ${index === 0 ? 'rounded-tr-2xl' : ''} ${index === totalColumns - 1 ? 'rounded-tl-2xl' : ''}`}
      style={{ 
        width: columnWidth,
        minWidth: columnWidth,
        borderBottom: `3px solid rgba(148, 163, 184, 0.3)`
      }}
      onDoubleClick={() => onCopy(headerValue)}
      onContextMenu={(e) => {
        e.preventDefault();
        onHighlightToggle();
      }}
    >
      {isEditing ? (
        <input
          value={headerValue}
          onChange={(e) => onHeaderChange(e.target.value)}
          onBlur={onEditEnd}
          onKeyDown={(e) => e.key === 'Enter' && onEditEnd()}
          autoFocus
          className="w-full h-8 text-right font-bold bg-transparent border-none outline-none text-inherit"
          style={{ direction: 'rtl' }}
        />
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              {onDelete && !column.required && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6 hover:bg-red-100 hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <span className="animate-fade-in">{headerValue}</span>
              {isHighlighted && (
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
              )}
            </div>
          </div>
          
          {/* Column Filter */}
          {column.id !== 'actions' && (
            <div className="flex justify-end">
              <ColumnFilter
                columnId={column.id}
                columnType={getColumnType()}
                filterValue={columnFilters[column.id] || ''}
                onFilterChange={onFilterChange}
                onClearFilter={onClearFilter}
                options={column.id === 'status' ? statusOptions.map(option => ({
                  value: option.value,
                  label: option.label
                })) : undefined}
              />
            </div>
          )}
        </div>
      )}
      
      {/* Column Resizer */}
      <div
        className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-blue-300 to-blue-500 hover:from-blue-400 hover:to-blue-600 cursor-col-resize opacity-0 group-hover:opacity-70 hover:opacity-100 transition-all duration-200"
        onMouseDown={onResize}
      />
    </th>
  );
}