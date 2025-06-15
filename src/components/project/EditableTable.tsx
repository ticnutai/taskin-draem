import React, { useState } from 'react';
import { ResizablePanelGroup } from '@/components/ui/resizable';
import { Task } from '@/types/Task';
import { Column } from '@/types/Column';
import { TableControls } from './table/TableControls';
import { TableHeader } from './table/TableHeader';
import { TableRow } from './table/TableRow';

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

  return (
    <div className="relative">
      <TableControls
        onColumnToggle={onColumnToggle}
        onAddRow={onAddRow}
        onAddColumn={onAddColumn}
      />

      <div className="relative overflow-x-auto overflow-y-auto max-h-[600px] max-w-full rounded-lg border-2 border-slate-300 shadow-lg bg-white">
        <table className="w-max min-w-full border-separate border-spacing-0">
          <TableHeader
            columns={columns}
            editingHeader={editingHeader}
            setEditingHeader={setEditingHeader}
            columnHeaders={columnHeaders}
            updateHeader={updateHeader}
            copyToClipboard={copyToClipboard}
          />
          <tbody>
            {tasks.map((task) => (
              <TableRow
                key={task.id}
                task={task}
                columns={columns}
                editingCell={editingCell}
                setEditingCell={setEditingCell}
                updateTaskField={updateTaskField}
                updateTaskStatus={updateTaskStatus}
                copyToClipboard={copyToClipboard}
                getStatusColor={getStatusColor}
                getRowColor={getRowColor}
                setReminderTask={setReminderTask}
                setReminderDialogOpen={setReminderDialogOpen}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}