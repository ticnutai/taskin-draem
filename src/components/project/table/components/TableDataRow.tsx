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
  onRowResize: (e: React.MouseEvent) => void;
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
  onRowResize,
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
          className={`relative py-4 px-8 text-right transition-all duration-300 hover:bg-white/50 ${
            column.id === 'clientName' 
              ? `${themeColors.header} ${themeColors.headerText} font-semibold sticky right-0 z-10 shadow-lg border-r ${themeColors.border}` 
              : highlightedColumns.has(column.id)
                ? 'bg-gradient-to-br from-amber-50/80 to-yellow-50/80 text-amber-900 shadow-md'
                : `${themeColors.body} backdrop-blur-sm`
          } ${taskIndex === totalTasks - 1 && colIndex === 0 ? 'rounded-bl-2xl' : ''} ${taskIndex === totalTasks - 1 && colIndex === visibleColumns.length - 1 ? 'rounded-br-2xl' : ''}`}
          style={{ 
            width: columnWidths[column.id] || 200,
            minWidth: columnWidths[column.id] || 200,
            borderBottom: taskIndex === totalTasks - 1 ? 'none' : '1px solid rgba(148, 163, 184, 0.2)'
          }}
        >
          <div className="flex items-center justify-between gap-2 w-full">
            {/* Row Controls - only in first column and on the left */}
            {colIndex === 0 && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
              </div>
            )}
            
            <div className="flex-1">
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
            </div>
          </div>
        </td>
      ))}
      
      {/* Row Resizer */}
      <div
        className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-blue-300 to-blue-500 hover:from-blue-400 hover:to-blue-600 cursor-row-resize opacity-0 group-hover:opacity-70 hover:opacity-100 transition-all duration-200"
        onMouseDown={onRowResize}
      />
    </tr>
  );
}