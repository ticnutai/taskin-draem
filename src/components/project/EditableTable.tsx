import React, { useState, useRef, useCallback } from 'react';
import { Task } from '@/types/Task';
import { Column } from '@/types/Column';
import { TableControls } from './table/TableControls';
import { TableHeader } from './table/TableHeader';
import { TableRow } from './table/TableRow';
import { TableCell } from './table/TableCell';

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
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [rowHeights, setRowHeights] = useState<Record<string, number>>({});
  const [isResizing, setIsResizing] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);
  
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

  const handleMouseDown = useCallback((e: React.MouseEvent, type: 'column' | 'row', id: string) => {
    e.preventDefault();
    setIsResizing(true);
    
    const startPos = type === 'column' ? e.clientX : e.clientY;
    const startSize = type === 'column' 
      ? columnWidths[id] || 200 
      : rowHeights[id] || 50;

    const handleMouseMove = (e: MouseEvent) => {
      const currentPos = type === 'column' ? e.clientX : e.clientY;
      const diff = currentPos - startPos;
      const newSize = Math.max(50, startSize + diff);
      
      if (type === 'column') {
        setColumnWidths(prev => ({ ...prev, [id]: newSize }));
      } else {
        setRowHeights(prev => ({ ...prev, [id]: newSize }));
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [columnWidths, rowHeights]);

  return (
    <div className="relative">
      <TableControls
        onColumnToggle={onColumnToggle}
        onAddRow={onAddRow}
        onAddColumn={onAddColumn}
      />

      <div 
        ref={tableRef}
        className="relative overflow-auto max-h-[600px] max-w-full rounded-xl border-2 border-slate-300 shadow-lg bg-white"
        style={{ cursor: isResizing ? 'col-resize' : 'default' }}
      >
        <table className="w-max min-w-full border-separate border-spacing-0">
          <thead>
            <tr>
              {columns
                .filter(col => col.visible)
                .sort((a, b) => a.order - b.order)
                .map((column, index) => (
                  <th 
                    key={column.id}
                    className={`relative sticky top-0 z-20 text-right border-l-2 border-slate-200 font-bold text-slate-700 py-4 px-6 cursor-pointer hover:bg-blue-100 transition-colors ${
                      column.id === 'clientName' 
                        ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 sticky right-0 z-30 shadow-lg' 
                        : 'bg-gradient-to-r from-slate-50 to-slate-100'
                    } ${index === columns.filter(col => col.visible).length - 1 ? 'border-l-0 rounded-tr-xl' : ''} ${index === 0 ? 'rounded-tl-xl' : ''}`}
                    style={{ 
                      width: columnWidths[column.id] || 200,
                      minWidth: columnWidths[column.id] || 200
                    }}
                    onDoubleClick={() => copyToClipboard(column.label)}
                    onClick={() => setEditingHeader(column.id)}
                  >
                    {editingHeader === column.id ? (
                      <input
                        value={columnHeaders[column.id] || column.label}
                        onChange={(e) => updateHeader(column.id, e.target.value)}
                        onBlur={() => setEditingHeader(null)}
                        onKeyDown={(e) => e.key === 'Enter' && setEditingHeader(null)}
                        autoFocus
                        className="w-full h-8 text-right font-bold bg-transparent border-none outline-none"
                      />
                    ) : (
                      columnHeaders[column.id] || column.label
                    )}
                    
                    {/* Column Resizer */}
                    <div
                      className="absolute top-0 right-0 w-1 h-full bg-slate-300 hover:bg-blue-500 cursor-col-resize opacity-0 hover:opacity-100 transition-opacity"
                      onMouseDown={(e) => handleMouseDown(e, 'column', column.id)}
                    />
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr 
                key={task.id}
                className={`relative ${getRowColor(task.status)} border-b-2 border-slate-200 hover:shadow-md transition-all duration-200`}
                style={{ height: rowHeights[task.id] || 'auto' }}
              >
                {columns
                  .filter(col => col.visible)
                  .sort((a, b) => a.order - b.order)
                  .map((column, colIndex) => (
                    <td
                      key={`${task.id}-${column.id}`}
                      className={`relative border-l-2 border-slate-200 py-3 px-6 text-right transition-colors ${
                        column.id === 'clientName' 
                          ? 'bg-gradient-to-r from-blue-25 to-blue-50 text-blue-900 font-medium sticky right-0 z-10 shadow-sm' 
                          : 'bg-white hover:bg-slate-50'
                      } ${colIndex === columns.filter(col => col.visible).length - 1 ? 'border-l-0' : ''}`}
                      style={{ 
                        width: columnWidths[column.id] || 200,
                        minWidth: columnWidths[column.id] || 200
                      }}
                    >
                      <TableCell
                        task={task}
                        column={column}
                        colIndex={colIndex}
                        totalColumns={columns.filter(col => col.visible).length}
                        editingCell={editingCell}
                        setEditingCell={setEditingCell}
                        updateTaskField={updateTaskField}
                        updateTaskStatus={updateTaskStatus}
                        copyToClipboard={copyToClipboard}
                        getStatusColor={getStatusColor}
                        setReminderTask={setReminderTask}
                        setReminderDialogOpen={setReminderDialogOpen}
                      />
                    </td>
                  ))}
                
                {/* Row Resizer */}
                <div
                  className="absolute bottom-0 left-0 w-full h-1 bg-slate-300 hover:bg-blue-500 cursor-row-resize opacity-0 hover:opacity-100 transition-opacity"
                  onMouseDown={(e) => handleMouseDown(e, 'row', task.id)}
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}