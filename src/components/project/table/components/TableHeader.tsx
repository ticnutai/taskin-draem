import React from 'react';
import { Column } from '@/types/Column';
import { TableHeaderCell } from './TableHeaderCell';

interface TableHeaderProps {
  columns: Column[];
  editingHeader: string | null;
  setEditingHeader: (id: string | null) => void;
  columnHeaders: Record<string, string>;
  updateHeader: (field: string, value: string) => void;
  highlightedColumns: Set<string>;
  toggleColumnHighlight: (columnId: string) => void;
  columnWidths: Record<string, number>;
  copyToClipboard: (text: string) => void;
  onDeleteColumn: (columnId: string) => void;
  themeColors: any;
  columnFilters: Record<string, string>;
  onFilterChange: (columnId: string, value: string) => void;
  onClearFilter: (columnId: string) => void;
}

export function TableHeader({
  columns,
  editingHeader,
  setEditingHeader,
  columnHeaders,
  updateHeader,
  highlightedColumns,
  toggleColumnHighlight,
  columnWidths,
  copyToClipboard,
  onDeleteColumn,
  themeColors,
  columnFilters,
  onFilterChange,
  onClearFilter
}: TableHeaderProps) {
  const visibleColumns = columns
    .filter(col => col.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <thead>
      <tr>
        {visibleColumns.map((column, index) => (
          <TableHeaderCell
            key={column.id}
            column={column}
            index={index}
            totalColumns={visibleColumns.length}
            isEditing={editingHeader === column.id}
            headerValue={columnHeaders[column.id] || column.label}
            isHighlighted={highlightedColumns.has(column.id)}
            columnWidth={columnWidths[column.id] || 200}
            onEdit={() => setEditingHeader(column.id)}
            onHeaderChange={(value) => updateHeader(column.id, value)}
            onEditEnd={() => setEditingHeader(null)}
            onHighlightToggle={() => toggleColumnHighlight(column.id)}
            onCopy={copyToClipboard}
            onDelete={!column.required ? () => onDeleteColumn(column.id) : undefined}
            themeColors={themeColors}
            columnFilters={columnFilters}
            onFilterChange={onFilterChange}
            onClearFilter={onClearFilter}
          />
        ))}
      </tr>
    </thead>
  );
}