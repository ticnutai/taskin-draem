import React from 'react';
import { Task } from '@/types/Task';
import { Column } from '@/types/Column';
import { TableCell } from '../TableCell';
import { RowColorPicker, colorOptions } from './RowColorPicker';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface TableDataRowProps {
  task: Task;
  columns: Column[];
  taskIndex: number;
  totalTasks: number;
  editingCell: {taskId: string, field: string} | null;
  setEditingCell: (cell: {taskId: string, field: string} | null) => void;
  updateTaskField: (taskId: string, field: keyof Task, value: string) => void;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  copyToClipboard: (text: string) => void;
  getStatusColor: (status: string) => string;
  setReminderTask: (task: string) => void;
  setReminderDialogOpen: (open: boolean) => void;
  highlightedColumns: Set<string>;
  columnWidths: Record<string, number>;
  rowHeight: number;
  rowColor: string;
  onRowColorChange: (taskId: string, color: string) => void;
  
  onDeleteRow?: () => void;
  themeColors: any;
}

export function TableDataRow({
  task,
  columns,
  taskIndex,
  totalTasks,
  editingCell,
  setEditingCell,
  updateTaskField,
  updateTaskStatus,
  copyToClipboard,
  getStatusColor,
  setReminderTask,
  setReminderDialogOpen,
  highlightedColumns,
  columnWidths,
  rowHeight,
  rowColor,
  onRowColorChange,
  onDeleteRow,
  themeColors
}: TableDataRowProps) {
  const getRowColorClasses = () => {
    if (rowColor && rowColor !== '') {
      const colorOption = colorOptions.find(opt => opt.value === rowColor);
      return colorOption ? `${colorOption.bg} ${colorOption.text} ${colorOption.border || ''}` : '';
    }
    return '';
  };

  const visibleColumns = columns
    .filter(col => col.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <tr 
      className={`group relative ${getRowColorClasses()} hover:shadow-xl hover:scale-[1.01] transition-all duration-300 animate-fade-in`}
      style={{ 
        height: rowHeight || 'auto',
        animationDelay: `${taskIndex * 50}ms`
      }}
    >
      {visibleColumns.map((column, colIndex) => (
        <td
          key={`${task.id}-${column.id}`}
          className={`relative py-4 px-8 text-right transition-colors duration-200 group-hover:bg-muted/50 ${
            column.id === 'clientName' 
              ? 'sticky left-0 z-50 bg-white dark:bg-slate-900 border-r-2 border-slate-300 dark:border-slate-600 shadow-lg font-semibold text-slate-800 dark:text-slate-200' 
              : highlightedColumns.has(column.id)
                ? 'bg-amber-50'
                : ''
          } ${taskIndex === totalTasks - 1 && colIndex === 0 ? 'rounded-br-2xl' : ''} ${taskIndex === totalTasks - 1 && colIndex === visibleColumns.length - 1 ? 'rounded-bl-2xl' : ''}`}
          style={{ 
            width: columnWidths[column.id] || 200,
            minWidth: columnWidths[column.id] || 200,
            borderBottom: taskIndex === totalTasks - 1 ? 'none' : '1px solid rgba(148, 163, 184, 0.2)'
          }}
        >
          {/* Row Controls - only in first column and on the left */}
          {colIndex === 0 && (
            <span className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute left-2 top-1/2 transform -translate-y-1/2 z-10">
              <RowColorPicker
                taskId={task.id}
                currentColor={rowColor}
                onColorChange={onRowColorChange}
              />
              {onDeleteRow && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="p-1 h-6 w-6 hover:bg-red-100 hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteRow();
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </span>
          )}
          
          <TableCell
            task={task}
            column={column}
            colIndex={colIndex}
            totalColumns={visibleColumns.length}
            editingCell={editingCell}
            setEditingCell={setEditingCell}
            updateTaskField={updateTaskField}
            updateTaskStatus={updateTaskStatus}
            copyToClipboard={copyToClipboard}
            getStatusColor={getStatusColor}
            setReminderTask={setReminderTask}
            setReminderDialogOpen={setReminderDialogOpen}
          />
        </td>
      ))}
    </tr>
  );
}