import React, { useState } from 'react';
import { Task } from '@/types/Task';
import { Column } from '@/types/Column';
import { TableControls } from './TableControls';
import { TableContainer } from './components/TableContainer';
import { TableHeader } from './components/TableHeader';
import { TableBody } from './components/TableBody';
import { TableThemeSelector, themeOptions } from './components/TableThemeSelector';
import { useTableState } from './hooks/useTableState';
import { useTableResize } from './hooks/useTableResize';
import { useTableFilters } from './hooks/useTableFilters';
import { useDeleteDialog } from './hooks/useDeleteDialog';
import { DeleteConfirmDialog } from '../DeleteConfirmDialog';

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
  getRowColor,
  setReminderTask,
  setReminderDialogOpen,
  onColumnToggle,
  columns,
  setColumns,
  onAddRow,
  onAddColumn,
  onDeleteTask
}: EditableTableProps) {
  const [currentTheme, setCurrentTheme] = useState('default');

  const {
    editingHeader,
    setEditingHeader,
    columnWidths,
    setColumnWidths,
    rowHeights,
    setRowHeights,
    rowColors,
    setRowColors,
    highlightedColumns,
    isResizing,
    setIsResizing,
    columnHeaders,
    updateHeader,
    toggleColumnHighlight
  } = useTableState();

  const { handleMouseDown } = useTableResize({
    columnWidths,
    rowHeights,
    setColumnWidths,
    setRowHeights,
    setIsResizing
  });

  const {
    columnFilters,
    updateFilter,
    clearFilter
  } = useTableFilters();

  const {
    deleteDialog,
    handleDeleteColumn,
    handleDeleteRow,
    confirmDelete,
    closeDialog
  } = useDeleteDialog(tasks, columns, onDeleteTask, setColumns);

  const handleRowColorChange = (taskId: string, color: string) => {
    setRowColors(prev => ({ ...prev, [taskId]: color }));
  };

  const currentThemeColors = themeOptions.find(theme => theme.value === currentTheme)?.colors || themeOptions[0].colors;

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <TableControls
          onColumnToggle={onColumnToggle}
          onAddRow={onAddRow}
          onAddColumn={onAddColumn}
        />
        
        <TableThemeSelector
          currentTheme={currentTheme}
          onThemeChange={setCurrentTheme}
        />
      </div>

      <TableContainer isResizing={isResizing}>
        <TableHeader
          columns={columns}
          editingHeader={editingHeader}
          setEditingHeader={setEditingHeader}
          columnHeaders={columnHeaders}
          updateHeader={updateHeader}
          highlightedColumns={highlightedColumns}
          toggleColumnHighlight={toggleColumnHighlight}
          columnWidths={columnWidths}
          copyToClipboard={copyToClipboard}
          onDeleteColumn={handleDeleteColumn}
          themeColors={currentThemeColors}
          columnFilters={columnFilters}
          onFilterChange={updateFilter}
          onClearFilter={clearFilter}
        />
        
        <TableBody
          tasks={tasks}
          columns={columns}
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
          rowHeights={rowHeights}
          rowColors={rowColors}
          onRowColorChange={handleRowColorChange}
          onDeleteRow={handleDeleteRow}
          themeColors={currentThemeColors}
        />
      </TableContainer>

      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={closeDialog}
        title={deleteDialog.title}
        description={deleteDialog.description}
        onConfirm={confirmDelete}
      />
    </div>
  );
}