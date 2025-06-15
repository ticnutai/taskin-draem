import { useState } from 'react';

export const useTableState = () => {
  const [editingHeader, setEditingHeader] = useState<string | null>(null);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [rowHeights, setRowHeights] = useState<Record<string, number>>({});
  const [rowColors, setRowColors] = useState<Record<string, string>>({});
  const [highlightedColumns, setHighlightedColumns] = useState<Set<string>>(new Set());
  const [isResizing, setIsResizing] = useState(false);

  const [columnHeaders, setColumnHeaders] = useState({
    clientName: 'שם הלקוח',
    taskName: 'שם המשימה',
    dueDate: 'תאריך יעד',
    status: 'סטטוס',
    assignee: 'אחראי',
    notes: 'הערות',
    actions: 'פעולות'
  });

  const updateHeader = (field: string, value: string) => {
    setColumnHeaders(prev => ({ ...prev, [field]: value }));
  };

  const toggleColumnHighlight = (columnId: string) => {
    setHighlightedColumns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(columnId)) {
        newSet.delete(columnId);
      } else {
        newSet.add(columnId);
      }
      return newSet;
    });
  };

  return {
    editingHeader,
    setEditingHeader,
    columnWidths,
    setColumnWidths,
    rowHeights,
    setRowHeights,
    rowColors,
    setRowColors,
    highlightedColumns,
    setHighlightedColumns,
    isResizing,
    setIsResizing,
    columnHeaders,
    updateHeader,
    toggleColumnHighlight
  };
};