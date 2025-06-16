import React from 'react';
import { Task } from '@/types/Task';
import { Column } from '@/types/Column';
import { TableCell } from './TableCell';

interface TableRowProps {
  task: Task;
  columns: Column[];
  editingCell: {taskId: string, field: string} | null;
  setEditingCell: (cell: {taskId: string, field: string} | null) => void;
  updateTaskField: (taskId: string, field: keyof Task, value: string) => void;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  copyToClipboard: (text: string) => void;
  getStatusColor: (status: string) => string;
  getRowColor: (status: string) => string;
  setReminderTask: (task: string) => void;
  setReminderDialogOpen: (open: boolean) => void;
}

export function TableRow({
  task,
  columns,
  editingCell,
  setEditingCell,
  updateTaskField,
  updateTaskStatus,
  copyToClipboard,
  getStatusColor,
  getRowColor,
  setReminderTask,
  setReminderDialogOpen
}: TableRowProps) {
  const visibleColumns = columns
    .filter(col => col.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <tr className={`${getRowColor(task.status)} border-b-2 border-slate-200 hover:shadow-md transition-all duration-200`}>
      {visibleColumns.map((column, colIndex) => (
        <TableCell
          key={`${task.id}-${column.id}`}
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
      ))}
    </tr>
  );
}