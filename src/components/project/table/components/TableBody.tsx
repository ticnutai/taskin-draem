import React from 'react';
import { Task } from '@/types/Task';
import { Column } from '@/types/Column';
import { TableDataRow } from './TableDataRow';

interface TableBodyProps {
  tasks: Task[];
  columns: Column[];
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
  rowHeights: Record<string, number>;
  rowColors: Record<string, string>;
  onRowColorChange: (taskId: string, color: string) => void;
  onDeleteRow: (taskId: string) => void;
  themeColors: any;
}

export function TableBody({
  tasks,
  columns,
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
  rowHeights,
  rowColors,
  onRowColorChange,
  onDeleteRow,
  themeColors
}: TableBodyProps) {
  return (
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
          onRowColorChange={onRowColorChange}
          onDeleteRow={() => onDeleteRow(task.id)}
          themeColors={themeColors}
        />
      ))}
    </tbody>
  );
}