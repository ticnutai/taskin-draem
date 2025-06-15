import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Bell, Settings, Plus, Rows, Columns } from 'lucide-react';
import { Task, statusOptions } from '@/types/Task';
import { Column } from '@/types/Column';

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
  onAddRow: () => void;
  onAddColumn: () => void;
}

interface ColumnConfig {
  key: string;
  label: string;
  visible: boolean;
  order: number;
}

export function EditableTable({
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
}: EditableTableProps) {
  const [editingHeader, setEditingHeader] = useState<string | null>(null);
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

  const renderHeaderCell = (field: string, className?: string) => (
    <th 
      className={`sticky top-0 z-20 bg-gradient-to-r from-blue-50 to-purple-50 text-right border-l-2 border-slate-200 font-bold text-slate-700 py-4 px-6 cursor-pointer hover:bg-blue-100 transition-colors ${className || ''}`}
      onDoubleClick={() => copyToClipboard(columnHeaders[field as keyof typeof columnHeaders])}
      onClick={() => setEditingHeader(field)}
    >
      {editingHeader === field ? (
        <Input
          value={columnHeaders[field as keyof typeof columnHeaders]}
          onChange={(e) => updateHeader(field, e.target.value)}
          onBlur={() => setEditingHeader(null)}
          onKeyDown={(e) => e.key === 'Enter' && setEditingHeader(null)}
          autoFocus
          className="h-8 text-right font-bold"
        />
      ) : (
        columnHeaders[field as keyof typeof columnHeaders]
      )}
    </th>
  );

  const visibleColumns = columns
    .filter(col => col.visible)
    .sort((a, b) => a.order - b.order);

  const renderColumnContent = (task: Task, column: Column) => {
    const isEditing = editingCell?.taskId === task.id && editingCell?.field === column.id;
    
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
    <div className="relative">
      {/* Control Buttons */}
      <div className="flex justify-start gap-2 mb-4">
        <Button
          variant="outline"
          onClick={onColumnToggle}
          className="bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 border-blue-300"
        >
          <Settings className="w-4 h-4 ml-2" />
          ניהול עמודות
        </Button>
        <Button
          variant="outline"
          onClick={onAddRow}
          className="bg-gradient-to-r from-green-100 to-blue-100 hover:from-green-200 hover:to-blue-200 border-green-300"
        >
          <Plus className="w-4 h-4 ml-2" />
          הוסף שורה
        </Button>
        <Button
          variant="outline"
          onClick={onAddColumn}
          className="bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 border-purple-300"
        >
          <Plus className="w-4 h-4 ml-2" />
          הוסף עמודה
        </Button>
      </div>

      {/* Resizable Table Container */}
      <div className="relative overflow-auto max-h-[600px] rounded-lg border-2 border-slate-300 shadow-lg bg-white">
        <ResizablePanelGroup direction="horizontal" className="min-h-[400px]">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr>
                {visibleColumns.map((column, index) => (
                  <th 
                    key={column.id}
                    className={`sticky top-0 z-20 bg-gradient-to-r from-blue-50 to-purple-50 text-right border-l-2 border-slate-200 font-bold text-slate-700 py-4 px-6 cursor-pointer hover:bg-blue-100 transition-colors ${
                      index === 0 ? 'sticky right-0 z-30 shadow-sm' : ''
                    } ${index === visibleColumns.length - 1 ? 'border-l-0' : ''}`}
                    onDoubleClick={() => copyToClipboard(column.label)}
                    onClick={() => setEditingHeader(column.id)}
                  >
                    {editingHeader === column.id ? (
                      <Input
                        value={columnHeaders[column.id as keyof typeof columnHeaders] || column.label}
                        onChange={(e) => updateHeader(column.id, e.target.value)}
                        onBlur={() => setEditingHeader(null)}
                        onKeyDown={(e) => e.key === 'Enter' && setEditingHeader(null)}
                        autoFocus
                        className="h-8 text-right font-bold"
                      />
                    ) : (
                      columnHeaders[column.id as keyof typeof columnHeaders] || column.label
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr key={task.id} className={`${getRowColor(task.status)} border-b-2 border-slate-200 hover:shadow-md transition-all duration-200`}>
                  {visibleColumns.map((column, colIndex) => (
                    <td 
                      key={`${task.id}-${column.id}`}
                      className={`text-right border-l-2 border-slate-200 py-4 px-6 cursor-pointer hover:bg-blue-50 transition-colors ${
                        colIndex === 0 ? 'sticky right-0 z-10 bg-white font-medium shadow-sm' : ''
                      } ${column.id === 'notes' ? 'max-w-xs' : ''} ${
                        colIndex === visibleColumns.length - 1 ? 'border-l-0' : ''
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
                      {renderColumnContent(task, column)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}