import React from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell } from 'lucide-react';
import { Task, statusOptions } from '@/types/Task';
import { Column } from '@/types/Column';

interface TableCellProps {
  task: Task;
  column: Column;
  colIndex: number;
  totalColumns: number;
  editingCell: {taskId: string, field: string} | null;
  setEditingCell: (cell: {taskId: string, field: string} | null) => void;
  updateTaskField: (taskId: string, field: keyof Task, value: string) => void;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  copyToClipboard: (text: string) => void;
  getStatusColor: (status: string) => string;
  setReminderTask: (task: string) => void;
  setReminderDialogOpen: (open: boolean) => void;
}

export function TableCell({
  task,
  column,
  colIndex,
  totalColumns,
  editingCell,
  setEditingCell,
  updateTaskField,
  updateTaskStatus,
  copyToClipboard,
  getStatusColor,
  setReminderTask,
  setReminderDialogOpen
}: TableCellProps) {
  const isEditing = editingCell?.taskId === task.id && editingCell?.field === column.id;

  // Get value from task - handle custom fields
  const getCellValue = () => {
    const builtInFields = ['clientName', 'taskName', 'dueDate', 'status', 'assignee', 'notes'];
    if (builtInFields.includes(column.id)) {
      return task[column.id as keyof Task] as string;
    }
    // For custom fields, check if they exist directly or in custom_data
    return task[column.id as keyof Task] || '';
  };

  console.log('TableCell render:', { taskId: task.id, columnId: column.id, value: getCellValue() });

  const renderCellContent = () => {
    switch (column.id) {
      case 'status':
        return (
          <Badge className={`${getStatusColor(task.status)} shadow-sm`}>
            {statusOptions.find(opt => opt.value === task.status)?.label}
          </Badge>
        );
      case 'actions':
        return (
          <div className="flex gap-2 justify-start">
            <Select value={task.status} onValueChange={(value: Task['status']) => updateTaskStatus(task.id, value)}>
              <SelectTrigger className="w-32 text-right">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setReminderTask(`תזכורת למשימה: ${task.taskName} עבור ${task.clientName}`);
                setReminderDialogOpen(true);
              }}
              className="px-2 bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 border-blue-300"
            >
              <Bell className="w-4 h-4" />
            </Button>
          </div>
        );
      case 'dueDate':
        return isEditing ? (
          <Input
            type="date"
            value={getCellValue() || ''}
            onChange={(e) => {
              console.log('Date field update:', { taskId: task.id, field: column.id, value: e.target.value });
              updateTaskField(task.id, column.id as keyof Task, e.target.value);
            }}
            onBlur={() => setEditingCell(null)}
            onKeyDown={(e) => e.key === 'Enter' && setEditingCell(null)}
            autoFocus
            className="h-8 text-right"
          />
        ) : (
          <div className="cursor-text min-h-[20px]">
            {task.dueDate ? new Date(task.dueDate).toLocaleDateString('he-IL') : 'לחץ להוספת תאריך'}
          </div>
        );
      case 'notes':
        return isEditing ? (
          <Textarea
            value={getCellValue() || ''}
            onChange={(e) => {
              console.log('Notes field update:', { taskId: task.id, field: column.id, value: e.target.value });
              updateTaskField(task.id, column.id as keyof Task, e.target.value);
            }}
            onBlur={() => setEditingCell(null)}
            autoFocus
            className="h-16 text-right resize-none"
          />
        ) : (
          <div className="cursor-text min-h-[20px] truncate" title={getCellValue()}>
            {getCellValue() || 'לחץ להוספת הערות'}
          </div>
        );
      default:
        return isEditing ? (
          <Input
            value={getCellValue() || ''}
            onChange={(e) => {
              console.log('Custom field update:', { taskId: task.id, field: column.id, value: e.target.value });
              updateTaskField(task.id, column.id as keyof Task, e.target.value);
            }}
            onBlur={() => setEditingCell(null)}
            onKeyDown={(e) => e.key === 'Enter' && setEditingCell(null)}
            autoFocus
            className="h-8 text-right"
          />
        ) : (
          <div className="cursor-text min-h-[20px]">
            {getCellValue() || 'לחץ להוספת טקסט'}
          </div>
        );
    }
  };

  return (
    <div 
      className="w-full cursor-pointer" 
      onClick={() => {
        if (column.id !== 'status' && column.id !== 'actions') {
          setEditingCell({taskId: task.id, field: column.id});
        }
      }}
    >
      {renderCellContent()}
    </div>
  );
}