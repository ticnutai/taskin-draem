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
  const [rowColors, setRowColors] = useState<Record<string, string>>({});
  const [highlightedColumns, setHighlightedColumns] = useState<Set<string>>(new Set());
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

  const colorOptions = [
    { name: 'ברירת מחדל', value: '', bg: 'bg-white', text: 'text-slate-900' },
    { name: 'אדום עדין', value: 'red', bg: 'bg-red-50', text: 'text-red-900', border: 'border-red-200' },
    { name: 'ירוק עדין', value: 'green', bg: 'bg-green-50', text: 'text-green-900', border: 'border-green-200' },
    { name: 'כחול עדין', value: 'blue', bg: 'bg-blue-50', text: 'text-blue-900', border: 'border-blue-200' },
    { name: 'צהוב עדין', value: 'yellow', bg: 'bg-yellow-50', text: 'text-yellow-900', border: 'border-yellow-200' },
    { name: 'סגול עדין', value: 'purple', bg: 'bg-purple-50', text: 'text-purple-900', border: 'border-purple-200' },
    { name: 'ורוד עדין', value: 'pink', bg: 'bg-pink-50', text: 'text-pink-900', border: 'border-pink-200' },
  ];

  const getRowColorClasses = (taskId: string, status: string) => {
    const customColor = rowColors[taskId];
    if (customColor && customColor !== '') {
      const colorOption = colorOptions.find(opt => opt.value === customColor);
      return colorOption ? `${colorOption.bg} ${colorOption.text} ${colorOption.border || ''}` : getRowColor(status);
    }
    return getRowColor(status);
  };

  const toggleColumnHighlight = (columnId: string) => {
    setHighlightedColumns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(columnId)) {
        newSet.delete(columnId);
      } else {
        newSet.add(columnId);
      }
      return newSet;
    });
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
        className="relative overflow-auto max-h-[600px] max-w-full rounded-2xl border border-slate-200 shadow-2xl bg-gradient-to-br from-white via-slate-50 to-blue-50 backdrop-blur-sm"
        style={{ cursor: isResizing ? 'col-resize' : 'default' }}
      >
        <table className="w-max min-w-full border-separate border-spacing-0 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-inner">
          <thead>
            <tr>
              {columns
                .filter(col => col.visible)
                .sort((a, b) => a.order - b.order)
                .map((column, index) => (
                  <th 
                    key={column.id}
                    className={`group relative sticky top-0 z-20 text-right font-bold py-5 px-8 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                      column.id === 'clientName' 
                        ? 'bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 text-blue-900 sticky right-0 z-30 shadow-xl border-r border-blue-200' 
                        : highlightedColumns.has(column.id)
                          ? 'bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-100 text-amber-900 shadow-lg border-amber-200'
                          : 'bg-gradient-to-br from-slate-100 via-white to-slate-50 text-slate-700 hover:bg-gradient-to-br hover:from-slate-200 hover:via-slate-100 hover:to-slate-50'
                    } ${index === 0 ? 'rounded-tl-2xl' : ''} ${index === columns.filter(col => col.visible).length - 1 ? 'rounded-tr-2xl' : ''}`}
                    style={{ 
                      width: columnWidths[column.id] || 200,
                      minWidth: columnWidths[column.id] || 200,
                      borderBottom: '3px solid rgba(148, 163, 184, 0.3)'
                    }}
                    onDoubleClick={() => copyToClipboard(column.label)}
                    onClick={() => setEditingHeader(column.id)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      toggleColumnHighlight(column.id);
                    }}
                  >
                    {editingHeader === column.id ? (
                      <input
                        value={columnHeaders[column.id] || column.label}
                        onChange={(e) => updateHeader(column.id, e.target.value)}
                        onBlur={() => setEditingHeader(null)}
                        onKeyDown={(e) => e.key === 'Enter' && setEditingHeader(null)}
                        autoFocus
                        className="w-full h-8 text-right font-bold bg-transparent border-none outline-none text-inherit"
                      />
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <span className="animate-fade-in">{columnHeaders[column.id] || column.label}</span>
                        {highlightedColumns.has(column.id) && (
                          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                        )}
                      </div>
                    )}
                    
                    {/* Column Resizer */}
                    <div
                      className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-blue-300 to-blue-500 hover:from-blue-400 hover:to-blue-600 cursor-col-resize opacity-0 group-hover:opacity-70 hover:opacity-100 transition-all duration-200"
                      onMouseDown={(e) => handleMouseDown(e, 'column', column.id)}
                    />
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, taskIndex) => (
              <tr 
                key={task.id}
                className={`group relative ${getRowColorClasses(task.id, task.status)} hover:shadow-xl hover:scale-[1.01] transition-all duration-300 animate-fade-in`}
                style={{ 
                  height: rowHeights[task.id] || 'auto',
                  animationDelay: `${taskIndex * 50}ms`
                }}
              >
                {columns
                  .filter(col => col.visible)
                  .sort((a, b) => a.order - b.order)
                  .map((column, colIndex) => (
                    <td
                      key={`${task.id}-${column.id}`}
                      className={`relative py-4 px-8 text-right transition-all duration-300 hover:bg-white/50 ${
                        column.id === 'clientName' 
                          ? 'bg-gradient-to-br from-blue-50/80 to-blue-100/80 text-blue-900 font-semibold sticky right-0 z-10 shadow-lg border-r border-blue-200/50' 
                          : highlightedColumns.has(column.id)
                            ? 'bg-gradient-to-br from-amber-50/80 to-yellow-50/80 text-amber-900 shadow-md'
                            : 'bg-white/60 backdrop-blur-sm'
                      } ${taskIndex === tasks.length - 1 && colIndex === 0 ? 'rounded-bl-2xl' : ''} ${taskIndex === tasks.length - 1 && colIndex === columns.filter(col => col.visible).length - 1 ? 'rounded-br-2xl' : ''}`}
                      style={{ 
                        width: columnWidths[column.id] || 200,
                        minWidth: columnWidths[column.id] || 200,
                        borderBottom: taskIndex === tasks.length - 1 ? 'none' : '1px solid rgba(148, 163, 184, 0.2)'
                      }}
                    >
                      <div className="flex items-center justify-between gap-2">
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
                        
                        {/* Color Picker for Row */}
                        {colIndex === 0 && (
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <select
                              value={rowColors[task.id] || ''}
                              onChange={(e) => setRowColors(prev => ({ ...prev, [task.id]: e.target.value }))}
                              className="w-6 h-6 rounded-full border-none bg-transparent cursor-pointer text-xs appearance-none"
                              title="בחר צבע לשורה"
                            >
                              {colorOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.name.charAt(0)}
                                </option>
                              ))}
                            </select>
                            <div className="grid grid-cols-4 gap-1 absolute top-full left-0 bg-white p-2 rounded-lg shadow-lg border opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50">
                              {colorOptions.map(option => (
                                <button
                                  key={option.value}
                                  onClick={() => setRowColors(prev => ({ ...prev, [task.id]: option.value }))}
                                  className={`w-6 h-6 rounded-full border-2 hover:scale-110 transition-transform ${option.bg} ${option.border || 'border-gray-200'}`}
                                  title={option.name}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  ))}
                
                {/* Row Resizer */}
                <div
                  className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-blue-300 to-blue-500 hover:from-blue-400 hover:to-blue-600 cursor-row-resize opacity-0 group-hover:opacity-70 hover:opacity-100 transition-all duration-200"
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