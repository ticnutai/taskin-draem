import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Task, statusOptions } from '@/types/Task';

interface TaskFormProps {
  newTask: Omit<Task, 'id'>;
  setNewTask: (task: Omit<Task, 'id'>) => void;
}

export function TaskForm({ newTask, setNewTask }: TaskFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 p-4 border rounded-lg bg-muted/50">
      <Input
        placeholder="שם הלקוח"
        value={newTask.clientName}
        onChange={(e) => setNewTask({ ...newTask, clientName: e.target.value })}
      />
      <Input
        placeholder="שם המשימה"
        value={newTask.taskName}
        onChange={(e) => setNewTask({ ...newTask, taskName: e.target.value })}
      />
      <Input
        type="date"
        value={newTask.dueDate}
        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
      />
      <Select value={newTask.status} onValueChange={(value: Task['status']) => setNewTask({ ...newTask, status: value })}>
        <SelectTrigger>
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
      <Input
        placeholder="שם האחראי"
        value={newTask.assignee}
        onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
      />
      <Textarea
        placeholder="הערות נוספות"
        value={newTask.notes}
        onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
        className="md:col-span-2 lg:col-span-1"
      />
    </div>
  );
}