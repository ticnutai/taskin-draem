import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActionButtons } from './project/ActionButtons';
import { RefactoredEditableTable } from './project/table/RefactoredEditableTable';
import { ColumnManager } from './project/ColumnManager';
import { TaskForm } from './project/TaskForm';
import { FilterControls } from './project/FilterControls';
import { ProgressCards } from './project/ProgressCards';
import { ReminderDialog } from './project/ReminderDialog';
import { useProjectData } from '@/hooks/useProjectData';
import { useFilters } from '@/hooks/useFilters';
import { useReminders } from '@/hooks/useReminders';
import { statusOptions } from '@/types/Task';

const ProjectManager = () => {
  const {
    tasks,
    newTask,
    setNewTask,
    columns,
    setColumns,
    clients,
    projectProgress,
    addTask,
    updateTaskField,
    updateTaskStatus,
    handleImport,
    addColumn,
    deleteTask
  } = useProjectData();

  const {
    filterClient,
    setFilterClient,
    filterStatus,
    setFilterStatus,
    filteredTasks,
    clearFilters
  } = useFilters(tasks);

  const {
    reminderDialogOpen,
    setReminderDialogOpen,
    reminderTask,
    setReminderTask,
    reminderTime,
    setReminderTime,
    setReminder
  } = useReminders();

  const [editingCell, setEditingCell] = useState<{taskId: string, field: string} | null>(null);
  const [columnManagerOpen, setColumnManagerOpen] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('הועתק ללוח');
    });
  };

  const getStatusColor = (status: string) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option?.color || '';
  };

  const getRowColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 hover:bg-green-100';
      case 'in-progress':
        return 'bg-yellow-50 hover:bg-yellow-100';
      case 'pending':
        return 'bg-red-50 hover:bg-red-100';
      default:
        return '';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 direction-rtl" dir="rtl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">ניהול פרויקטים לפי לקוח</CardTitle>
        </CardHeader>
        <CardContent>
          <ActionButtons
            onAddTask={addTask}
            tasks={tasks}
            onImport={handleImport}
            onClearFilters={clearFilters}
            reminderDialogOpen={reminderDialogOpen}
            setReminderDialogOpen={setReminderDialogOpen}
          >
            <ReminderDialog
              reminderTask={reminderTask}
              setReminderTask={setReminderTask}
              reminderTime={reminderTime}
              setReminderTime={setReminderTime}
              setReminderDialogOpen={setReminderDialogOpen}
              onSetReminder={setReminder}
            />
          </ActionButtons>

          <TaskForm newTask={newTask} setNewTask={setNewTask} />

          <FilterControls
            filterClient={filterClient}
            setFilterClient={setFilterClient}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            clients={clients}
          />

          <ProgressCards projectProgress={projectProgress} clients={clients} />

          <RefactoredEditableTable
            tasks={filteredTasks}
            editingCell={editingCell}
            setEditingCell={setEditingCell}
            updateTaskField={updateTaskField}
            updateTaskStatus={updateTaskStatus}
            copyToClipboard={copyToClipboard}
            getStatusColor={getStatusColor}
            getRowColor={getRowColor}
            setReminderTask={setReminderTask}
            setReminderDialogOpen={setReminderDialogOpen}
            onColumnToggle={() => setColumnManagerOpen(true)}
            columns={columns}
            setColumns={setColumns}
            onAddRow={addTask}
            onAddColumn={addColumn}
            onDeleteTask={deleteTask}
          />

          <ColumnManager
            open={columnManagerOpen}
            onOpenChange={setColumnManagerOpen}
            columns={columns}
            onColumnsChange={(newColumns) => setColumns(newColumns)}
          />

          {filteredTasks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              לא נמצאו משימות התואמות לסינון
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectManager;