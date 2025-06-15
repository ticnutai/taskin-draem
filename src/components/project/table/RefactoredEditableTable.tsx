import React, { useRef, useState } from 'react';
import { Task } from '@/types/Task';
import { Column } from '@/types/Column';
import { TableControls } from './TableControls';
import { TableHeaderCell } from './components/TableHeaderCell';
import { TableDataRow } from './components/TableDataRow';
import { TableThemeSelector, themeOptions } from './components/TableThemeSelector';
import { useTableState } from './hooks/useTableState';
import { useTableResize } from './hooks/useTableResize';

interface RefactoredEditableTableProps {
  tasks: Task[];
  editingCell: {taskId: string, field: string} | null;
  setEditingCell: (cell: {taskId: string, field: string} | null) => void;
  updateTaskField: (taskId: string, field: keyof Task, value: string) => void;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  copyToClipboard: (text: string) => void;
  getStatusColor: (status: string) => string;
  getRowColor: (status: string) => string;
  setReminderTask: (task: string) => void;
  setReminderDialogOpen: (open: boolean) => void;
  onColumnToggle: () => void;
  columns: Column[];
  onAddRow: () => void;
  onAddColumn: () => void;
}

export function RefactoredEditableTable({
  tasks,
  editingCell,
  setEditingCell,
  updateTaskField,
  updateTaskStatus,
  copyToClipboard,
  getStatusColor,
  getRowColor,
  setReminderTask,
  setReminderDialogOpen,
  onColumnToggle,
  columns,
  onAddRow,
  onAddColumn
}: RefactoredEditableTableProps) {
  const tableRef = useRef<HTMLDivElement>(null);
  const [currentTheme, setCurrentTheme] = useState('default');

  const {
    editingHeader,
    setEditingHeader,
    columnWidths,
    setColumnWidths,
    rowHeights,
    setRowHeights,
    rowColors,
    setRowColors,
    highlightedColumns,
    isResizing,
    setIsResizing,
    columnHeaders,
    updateHeader,
    toggleColumnHighlight
  } = useTableState();

  const { handleMouseDown } = useTableResize({
    columnWidths,
    rowHeights,
    setColumnWidths,
    setRowHeights,
    setIsResizing
  });

  const handleRowColorChange = (taskId: string, color: string) => {
    setRowColors(prev => ({ ...prev, [taskId]: color }));
  };

  const currentThemeColors = themeOptions.find(theme => theme.value === currentTheme)?.colors || themeOptions[0].colors;

  const visibleColumns = columns
    .filter(col => col.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <TableControls
          onColumnToggle={onColumnToggle}
          onAddRow={onAddRow}
          onAddColumn={onAddColumn}
        />
        
        <TableThemeSelector
          currentTheme={currentTheme}
          onThemeChange={setCurrentTheme}
        />
      </div>

      <div 
        ref={tableRef}
        className="relative overflow-auto max-h-[600px] max-w-full rounded-2xl border border-slate-200 shadow-2xl bg-gradient-to-br from-white via-slate-50 to-blue-50 backdrop-blur-sm"
        style={{ cursor: isResizing ? 'col-resize' : 'default' }}
      >
        <table className="w-max min-w-full border-separate border-spacing-0 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-inner">
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
                  onResize={(e) => handleMouseDown(e, 'column', column.id)}
                  themeColors={currentThemeColors}
                />
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, taskIndex) => (
              <TableDataRow
                key={task.id}
                task={task}
                columns={columns}
                taskIndex={taskIndex}
                totalTasks={tasks.length}
                editingCell={editingCell}
                setEditingCell={setEditingCell}
                updateTaskField={updateTaskField}
                updateTaskStatus={updateTaskStatus}
                copyToClipboard={copyToClipboard}
                getStatusColor={getStatusColor}
                setReminderTask={setReminderTask}
                setReminderDialogOpen={setReminderDialogOpen}
                highlightedColumns={highlightedColumns}
                columnWidths={columnWidths}
                rowHeight={rowHeights[task.id]}
                rowColor={rowColors[task.id] || ''}
                onRowColorChange={handleRowColorChange}
                onRowResize={(e) => handleMouseDown(e, 'row', task.id)}
                themeColors={currentThemeColors}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}