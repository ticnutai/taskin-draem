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
            value={task[column.id as keyof Task] as string}
            onChange={(e) => updateTaskField(task.id, column.id as keyof Task, e.target.value)}
            onBlur={() => setEditingCell(null)}
            onKeyDown={(e) => e.key === 'Enter' && setEditingCell(null)}
            autoFocus
            className="h-8 text-right"
          />
        ) : (
          new Date(task.dueDate).toLocaleDateString('he-IL')
        );
      case 'notes':
        return isEditing ? (
          <Textarea
            value={task[column.id as keyof Task] as string}
            onChange={(e) => updateTaskField(task.id, column.id as keyof Task, e.target.value)}
            onBlur={() => setEditingCell(null)}
            autoFocus
            className="h-16 text-right resize-none"
          />
        ) : (
          <div className="truncate" title={task[column.id as keyof Task] as string}>
            {task[column.id as keyof Task] as string}
          </div>
        );
      default:
        return isEditing ? (
          <Input
            value={task[column.id as keyof Task] as string || ''}
            onChange={(e) => updateTaskField(task.id, column.id as keyof Task, e.target.value)}
            onBlur={() => setEditingCell(null)}
            onKeyDown={(e) => e.key === 'Enter' && setEditingCell(null)}
            autoFocus
            className="h-8 text-right"
          />
        ) : (
          task[column.id as keyof Task] as string || ''
        );
    }
  };

  return (
    <td 
      className={`text-right border-l-2 border-slate-200 py-4 px-6 cursor-pointer hover:bg-blue-50 transition-colors ${
        colIndex === 0 ? 'sticky right-0 z-10 bg-white font-medium shadow-sm' : ''
      } ${column.id === 'notes' ? 'max-w-xs' : ''} ${
        colIndex === totalColumns - 1 ? 'border-l-0' : ''
      }`}
      onDoubleClick={() => {
        if (column.id !== 'status' && column.id !== 'actions') {
          copyToClipboard(task[column.id as keyof Task] as string || '');
        }
      }}
      onClick={() => {
        if (column.id !== 'status' && column.id !== 'actions') {
          setEditingCell({taskId: task.id, field: column.id});
        }
      }}
    >
      {renderCellContent()}
    </td>
  );
}