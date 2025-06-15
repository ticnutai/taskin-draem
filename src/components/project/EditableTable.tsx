import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Settings } from 'lucide-react';
import { Task, statusOptions } from '@/types/Task';

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
  onColumnToggle
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

  return (
    <div className="relative">
      {/* Column Settings Button */}
      <div className="flex justify-start mb-4">
        <Button
          variant="outline"
          onClick={onColumnToggle}
          className="bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 border-blue-300"
        >
          <Settings className="w-4 h-4 ml-2" />
          ניהול עמודות
        </Button>
      </div>

      {/* Scrollable Container */}
      <div className="relative overflow-auto max-h-[600px] rounded-lg border-2 border-slate-300 shadow-lg bg-white">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr>
              {renderHeaderCell('clientName')}
              {renderHeaderCell('taskName')}
              {renderHeaderCell('dueDate')}
              {renderHeaderCell('status')}
              {renderHeaderCell('assignee')}
              {renderHeaderCell('notes')}
              {renderHeaderCell('actions', 'border-l-0')}
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={task.id} className={`${getRowColor(task.status)} border-b-2 border-slate-200 hover:shadow-md transition-all duration-200`}>
                {/* Client Name - Sticky First Column */}
                <td 
                  className="sticky right-0 z-10 bg-white text-right font-medium border-l-2 border-slate-200 py-4 px-6 cursor-pointer hover:bg-blue-50 transition-colors shadow-sm"
                  onDoubleClick={() => copyToClipboard(task.clientName)}
                  onClick={() => setEditingCell({taskId: task.id, field: 'clientName'})}
                >
                  {editingCell?.taskId === task.id && editingCell?.field === 'clientName' ? (
                    <Input
                      value={task.clientName}
                      onChange={(e) => updateTaskField(task.id, 'clientName', e.target.value)}
                      onBlur={() => setEditingCell(null)}
                      onKeyDown={(e) => e.key === 'Enter' && setEditingCell(null)}
                      autoFocus
                      className="h-8 text-right"
                    />
                  ) : (
                    task.clientName
                  )}
                </td>
                
                {/* Task Name */}
                <td 
                  className="text-right border-l-2 border-slate-200 py-4 px-6 cursor-pointer hover:bg-blue-50 transition-colors"
                  onDoubleClick={() => copyToClipboard(task.taskName)}
                  onClick={() => setEditingCell({taskId: task.id, field: 'taskName'})}
                >
                  {editingCell?.taskId === task.id && editingCell?.field === 'taskName' ? (
                    <Input
                      value={task.taskName}
                      onChange={(e) => updateTaskField(task.id, 'taskName', e.target.value)}
                      onBlur={() => setEditingCell(null)}
                      onKeyDown={(e) => e.key === 'Enter' && setEditingCell(null)}
                      autoFocus
                      className="h-8 text-right"
                    />
                  ) : (
                    task.taskName
                  )}
                </td>
                
                {/* Due Date */}
                <td 
                  className="text-right border-l-2 border-slate-200 py-4 px-6 cursor-pointer hover:bg-blue-50 transition-colors"
                  onDoubleClick={() => copyToClipboard(task.dueDate)}
                  onClick={() => setEditingCell({taskId: task.id, field: 'dueDate'})}
                >
                  {editingCell?.taskId === task.id && editingCell?.field === 'dueDate' ? (
                    <Input
                      type="date"
                      value={task.dueDate}
                      onChange={(e) => updateTaskField(task.id, 'dueDate', e.target.value)}
                      onBlur={() => setEditingCell(null)}
                      onKeyDown={(e) => e.key === 'Enter' && setEditingCell(null)}
                      autoFocus
                      className="h-8 text-right"
                    />
                  ) : (
                    new Date(task.dueDate).toLocaleDateString('he-IL')
                  )}
                </td>
                
                {/* Status */}
                <td className="text-right border-l-2 border-slate-200 py-4 px-6">
                  <Badge className={`${getStatusColor(task.status)} shadow-sm`}>
                    {statusOptions.find(opt => opt.value === task.status)?.label}
                  </Badge>
                </td>
                
                {/* Assignee */}
                <td 
                  className="text-right border-l-2 border-slate-200 py-4 px-6 cursor-pointer hover:bg-blue-50 transition-colors"
                  onDoubleClick={() => copyToClipboard(task.assignee)}
                  onClick={() => setEditingCell({taskId: task.id, field: 'assignee'})}
                >
                  {editingCell?.taskId === task.id && editingCell?.field === 'assignee' ? (
                    <Input
                      value={task.assignee}
                      onChange={(e) => updateTaskField(task.id, 'assignee', e.target.value)}
                      onBlur={() => setEditingCell(null)}
                      onKeyDown={(e) => e.key === 'Enter' && setEditingCell(null)}
                      autoFocus
                      className="h-8 text-right"
                    />
                  ) : (
                    task.assignee
                  )}
                </td>
                
                {/* Notes */}
                <td 
                  className="text-right border-l-2 border-slate-200 py-4 px-6 cursor-pointer hover:bg-blue-50 transition-colors max-w-xs"
                  onDoubleClick={() => copyToClipboard(task.notes)}
                  onClick={() => setEditingCell({taskId: task.id, field: 'notes'})}
                >
                  {editingCell?.taskId === task.id && editingCell?.field === 'notes' ? (
                    <Textarea
                      value={task.notes}
                      onChange={(e) => updateTaskField(task.id, 'notes', e.target.value)}
                      onBlur={() => setEditingCell(null)}
                      autoFocus
                      className="h-16 text-right resize-none"
                    />
                  ) : (
                    <div className="truncate" title={task.notes}>{task.notes}</div>
                  )}
                </td>
                
                {/* Actions */}
                <td className="text-right py-4 px-6">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}