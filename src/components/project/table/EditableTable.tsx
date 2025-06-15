import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Edit, Bell } from 'lucide-react';
import { Task, statusOptions } from '@/types/Task';
import { Column } from '@/types/Column';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface EditableTableProps {
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
  setColumns: (columns: Column[]) => void;
  onAddRow: () => void;
  onAddColumn: () => void;
  onDeleteTask: (taskId: string) => void;
}

export function EditableTable({
  tasks,
  editingCell,
  setEditingCell,
  updateTaskField,
  updateTaskStatus,
  copyToClipboard,
  getStatusColor,
  setReminderTask,
  setReminderDialogOpen,
  onColumnToggle,
  columns,
  setColumns,
  onAddRow,
  onAddColumn,
  onDeleteTask
}: EditableTableProps) {
  const [editingHeader, setEditingHeader] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{type: 'row' | 'column', id: string, name: string} | null>(null);

  const visibleColumns = columns.filter(col => col.visible).sort((a, b) => a.order - b.order);

  const handleDeleteRow = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setDeleteTarget({ type: 'row', id: taskId, name: task.taskName });
      setDeleteConfirmOpen(true);
    }
  };

  const confirmDelete = () => {
    if (deleteTarget?.type === 'row') {
      onDeleteTask(deleteTarget.id);
    }
    setDeleteConfirmOpen(false);
    setDeleteTarget(null);
  };

  const renderCell = (task: Task, column: Column) => {
    const isEditing = editingCell?.taskId === task.id && editingCell?.field === column.id;
    const value = task[column.id as keyof Task] as string;

    if (column.id === 'status') {
      return (
        <Badge className={`${getStatusColor(task.status)} shadow-sm`}>
          {statusOptions.find(opt => opt.value === task.status)?.label}
        </Badge>
      );
    }

    if (column.id === 'actions') {
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
            className="px-2"
          >
            <Bell className="w-4 h-4" />
          </Button>
        </div>
      );
    }

    if (isEditing) {
      if (column.id === 'notes') {
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => updateTaskField(task.id, column.id as keyof Task, e.target.value)}
            onBlur={() => setEditingCell(null)}
            autoFocus
            className="h-16 text-right resize-none"
          />
        );
      }
      return (
        <Input
          type={column.id === 'dueDate' ? 'date' : 'text'}
          value={value || ''}
          onChange={(e) => updateTaskField(task.id, column.id as keyof Task, e.target.value)}
          onBlur={() => setEditingCell(null)}
          onKeyDown={(e) => e.key === 'Enter' && setEditingCell(null)}
          autoFocus
          className="h-8 text-right"
        />
      );
    }

    return (
      <div
        className="cursor-text min-h-[20px]"
        onClick={() => setEditingCell({taskId: task.id, field: column.id})}
        onDoubleClick={() => copyToClipboard(value || '')}
      >
        {column.id === 'dueDate' && value 
          ? new Date(value).toLocaleDateString('he-IL')
          : value || 'לחץ להוספת טקסט'
        }
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex gap-2 mb-4">
        <Button onClick={onAddRow} variant="outline" className="text-green-700 border-green-300">
          <Plus className="w-4 h-4 ml-2" />
          הוספת שורה
        </Button>
        <Button onClick={onAddColumn} variant="outline" className="text-blue-700 border-blue-300">
          <Plus className="w-4 h-4 ml-2" />
          הוספת עמודה
        </Button>
        <Button onClick={onColumnToggle} variant="outline" className="text-purple-700 border-purple-300">
          <Edit className="w-4 h-4 ml-2" />
          ניהול עמודות
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-auto max-h-[600px] border rounded-lg">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr>
              {visibleColumns.map((column) => (
                <th
                  key={column.id}
                  className={`sticky top-0 bg-slate-100 dark:bg-slate-800 text-right border-b py-4 px-6 font-bold ${
                    column.id === 'clientName' ? 'sticky left-0 z-10 border-r shadow-lg' : ''
                  }`}
                  onDoubleClick={() => copyToClipboard(column.label)}
                >
                  {editingHeader === column.id ? (
                    <Input
                      value={column.label}
                      onChange={(e) => setColumns(columns.map(col => 
                        col.id === column.id ? { ...col, label: e.target.value } : col
                      ))}
                      onBlur={() => setEditingHeader(null)}
                      onKeyDown={(e) => e.key === 'Enter' && setEditingHeader(null)}
                      autoFocus
                      className="h-8 text-right font-bold"
                    />
                  ) : (
                    <div className="flex items-center justify-between">
                      <span onClick={() => setEditingHeader(column.id)} className="cursor-pointer">
                        {column.label}
                      </span>
                      {!column.required && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="opacity-0 group-hover:opacity-100 p-1 h-6 w-6"
                          onClick={() => setColumns(columns.filter(col => col.id !== column.id))}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={task.id} className="group border-b hover:bg-muted/50">
                {visibleColumns.map((column, colIndex) => (
                  <td
                    key={`${task.id}-${column.id}`}
                    className={`py-4 px-6 text-right ${
                      column.id === 'clientName' ? 'sticky left-0 bg-white dark:bg-slate-900 border-r shadow-lg font-semibold' : ''
                    }`}
                  >
                    {colIndex === 0 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 absolute left-2 top-1/2 transform -translate-y-1/2 p-1 h-6 w-6"
                        onClick={() => handleDeleteRow(task.id)}
                      >
                        <Trash2 className="h-3 w-3 text-red-600" />
                      </Button>
                    )}
                    {renderCell(task, column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation */}
      {deleteConfirmOpen && deleteTarget && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription>
            <div className="space-y-4">
              <p>האם אתה בטוח שברצונך למחוק את השורה "{deleteTarget.name}"?</p>
              <div className="flex gap-2">
                <Button onClick={confirmDelete} variant="destructive" size="sm">מחק</Button>
                <Button onClick={() => setDeleteConfirmOpen(false)} variant="outline" size="sm">ביטול</Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}