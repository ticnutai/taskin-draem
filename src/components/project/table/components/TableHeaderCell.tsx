import React from 'react';
import { Column } from '@/types/Column';

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
  themeColors: any;
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
  themeColors
}: TableHeaderCellProps) {
  return (
    <th 
      key={column.id}
      className={`group relative sticky top-0 z-20 text-right font-bold py-5 px-8 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
        column.id === 'clientName' 
          ? `${themeColors.header} ${themeColors.headerText} sticky right-0 z-30 shadow-xl border-r ${themeColors.border}` 
          : isHighlighted
            ? 'bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-100 text-amber-900 shadow-lg border-amber-200'
            : `${themeColors.header} ${themeColors.headerText} hover:shadow-md`
      } ${index === 0 ? 'rounded-tl-2xl' : ''} ${index === totalColumns - 1 ? 'rounded-tr-2xl' : ''}`}
      style={{ 
        width: columnWidth,
        minWidth: columnWidth,
        borderBottom: `3px solid rgba(148, 163, 184, 0.3)`
      }}
      onDoubleClick={() => onCopy(headerValue)}
      onClick={onEdit}
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
        <div className="flex items-center justify-end gap-2">
          <span className="animate-fade-in">{headerValue}</span>
          {isHighlighted && (
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
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