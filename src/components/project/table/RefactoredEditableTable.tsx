import React, { useRef, useState } from 'react';
import { Task } from '@/types/Task';
import { Column } from '@/types/Column';
import { TableControls } from './TableControls';
import { TableHeaderCell } from './components/TableHeaderCell';
import { TableDataRow } from './components/TableDataRow';
import { TableThemeSelector, themeOptions } from './components/TableThemeSelector';
import { useTableState } from './hooks/useTableState';
import { useTableResize } from './hooks/useTableResize';
import { DeleteConfirmDialog } from '../DeleteConfirmDialog';

interface RefactoredEditableTableProps {
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

export function RefactoredEditableTable({
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
}: RefactoredEditableTableProps) {
  const tableRef = useRef<HTMLDivElement>(null);
  const [currentTheme, setCurrentTheme] = useState('default');
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: 'row' | 'column';
    id: string;
    title: string;
    description: string;
  }>({
    open: false,
    type: 'row',
    id: '',
    title: '',
    description: ''
  });

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

  const handleRowColorChange = (taskId: string, color: string) => {
    setRowColors(prev => ({ ...prev, [taskId]: color }));
  };

  const handleDeleteColumn = (columnId: string) => {
    const column = columns.find(col => col.id === columnId);
    if (!column) return;
    
    setDeleteDialog({
      open: true,
      type: 'column',
      id: columnId,
      title: 'מחיקת עמודה',
      description: `האם אתה בטוח שברצונך למחוק את העמודה "${column.label}"? פעולה זו לא ניתנת לביטול.`
    });
  };

  const handleDeleteRow = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    setDeleteDialog({
      open: true,
      type: 'row',
      id: taskId,
      title: 'מחיקת משימה',
      description: `האם אתה בטוח שברצונך למחוק את המשימה "${task.taskName}" עבור "${task.clientName}"? פעולה זו לא ניתנת לביטול.`
    });
  };

  const confirmDelete = () => {
    if (deleteDialog.type === 'column') {
      const newColumns = columns.filter(col => col.id !== deleteDialog.id);
      setColumns(newColumns);
    } else if (deleteDialog.type === 'row') {
      onDeleteTask(deleteDialog.id);
    }
    
    setDeleteDialog({
      open: false,
      type: 'row',
      id: '',
      title: '',
      description: ''
    });
  };

  const currentThemeColors = themeOptions.find(theme => theme.value === currentTheme)?.colors || themeOptions[0].colors;

  const visibleColumns = columns
    .filter(col => col.visible)
    .sort((a, b) => a.order - b.order);

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

      <div 
        ref={tableRef}
        className="relative overflow-auto max-h-[600px] max-w-full rounded-2xl border border-slate-200 shadow-2xl bg-gradient-to-br from-white via-slate-50 to-blue-50 backdrop-blur-sm"
        style={{ cursor: isResizing ? 'col-resize' : 'default' }}
      >
        <table className="w-max min-w-full border-separate border-spacing-0 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-inner">
          <thead>
            <tr>
              {visibleColumns.map((column, index) => (
                <TableHeaderCell
                  key={column.id}
                  column={column}
                  index={index}
                  totalColumns={visibleColumns.length}
                  isEditing={editingHeader === column.id}
                  headerValue={columnHeaders[column.id] || column.label}
                  isHighlighted={highlightedColumns.has(column.id)}
                  columnWidth={columnWidths[column.id] || 200}
                  onEdit={() => setEditingHeader(column.id)}
                  onHeaderChange={(value) => updateHeader(column.id, value)}
                  onEditEnd={() => setEditingHeader(null)}
                  onHighlightToggle={() => toggleColumnHighlight(column.id)}
                  onCopy={copyToClipboard}
                  onResize={(e) => handleMouseDown(e, 'column', column.id)}
                  onDelete={!column.required ? () => handleDeleteColumn(column.id) : undefined}
                  themeColors={currentThemeColors}
                  columnFilters={columnFilters}
                  onFilterChange={(columnId, value) => setColumnFilters(prev => ({ ...prev, [columnId]: value }))}
                  onClearFilter={(columnId) => setColumnFilters(prev => ({ ...prev, [columnId]: '' }))}
                />
              ))}
            </tr>
          </thead>
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
                onRowColorChange={handleRowColorChange}
                onRowResize={(e) => handleMouseDown(e, 'row', task.id)}
                onDeleteRow={() => handleDeleteRow(task.id)}
                themeColors={currentThemeColors}
              />
            ))}
          </tbody>
        </table>
      </div>

      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog(prev => ({ ...prev, open }))}
        title={deleteDialog.title}
        description={deleteDialog.description}
        onConfirm={confirmDelete}
      />
    </div>
  );
}