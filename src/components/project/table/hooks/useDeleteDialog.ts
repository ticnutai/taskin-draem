import { useState } from 'react';
import { Task } from '@/types/Task';
import { Column } from '@/types/Column';

interface DeleteDialogState {
  open: boolean;
  type: 'row' | 'column';
  id: string;
  title: string;
  description: string;
}

export const useDeleteDialog = (
  tasks: Task[],
  columns: Column[],
  onDeleteTask: (taskId: string) => void,
  setColumns: (columns: Column[]) => void
) => {
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    open: false,
    type: 'row',
    id: '',
    title: '',
    description: ''
  });

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

  const closeDialog = () => {
    setDeleteDialog(prev => ({ ...prev, open: false }));
  };

  return {
    deleteDialog,
    handleDeleteColumn,
    handleDeleteRow,
    confirmDelete,
    closeDialog
  };
};