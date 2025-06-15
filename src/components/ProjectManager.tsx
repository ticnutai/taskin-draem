import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Filter, Bell } from 'lucide-react';
import { ActionButtons } from './project/ActionButtons';
import { EditableTable } from './project/EditableTable';
import { ColumnManager } from './project/ColumnManager';
import { Task, statusOptions } from '@/types/Task';
import { Column } from '@/types/Column';

const ProjectManager = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      clientName: 'חברת טכנולוגיה א',
      taskName: 'פיתוח אתר אינטרנט',
      dueDate: '2024-12-25',
      status: 'in-progress',
      assignee: 'יונתן כהן',
      notes: 'צריך לסיים את עמוד הבית'
    },
    {
      id: '2',
      clientName: 'חברת טכנולוגיה א',
      taskName: 'בדיקות איכות',
      dueDate: '2024-12-30',
      status: 'pending',
      assignee: 'שרה לוי',
      notes: 'ממתין לסיום הפיתוח'
    },
    {
      id: '3',
      clientName: 'חברת שיווק ב',
      taskName: 'עיצוב לוגו',
      dueDate: '2024-12-20',
      status: 'completed',
      assignee: 'דן אברהם',
      notes: 'הושלם בהצלחה'
    }
  ]);

  const [newTask, setNewTask] = useState<Omit<Task, 'id'>>({
    clientName: '',
    taskName: '',
    dueDate: '',
    status: 'pending',
    assignee: '',
    notes: ''
  });

  const [filterClient, setFilterClient] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [reminderTask, setReminderTask] = useState<string>('');
  const [reminderTime, setReminderTime] = useState<string>('');
  const [editingCell, setEditingCell] = useState<{taskId: string, field: string} | null>(null);
  const [columnManagerOpen, setColumnManagerOpen] = useState(false);
  const [columns, setColumns] = useState<Column[]>([
    { id: 'clientName', label: 'שם הלקוח', visible: true, order: 0, required: true },
    { id: 'taskName', label: 'שם המשימה', visible: true, order: 1, required: true },
    { id: 'dueDate', label: 'תאריך יעד', visible: true, order: 2, required: false },
    { id: 'status', label: 'סטטוס', visible: true, order: 3, required: false },
    { id: 'assignee', label: 'אחראי', visible: true, order: 4, required: false },
    { id: 'notes', label: 'הערות', visible: true, order: 5, required: false },
    { id: 'actions', label: 'פעולות', visible: true, order: 6, required: true }
  ]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('הועתק ללוח');
    });
  };

  const updateTaskField = (taskId: string, field: keyof Task, value: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, [field]: value } : task
    ));
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

  const clients = useMemo(() => {
    const uniqueClients = [...new Set(tasks.map(task => task.clientName))];
    return uniqueClients;
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const clientMatch = !filterClient || filterClient === 'all' || task.clientName === filterClient;
      const statusMatch = !filterStatus || filterStatus === 'all' || task.status === filterStatus;
      return clientMatch && statusMatch;
    });
  }, [tasks, filterClient, filterStatus]);

  const projectProgress = useMemo(() => {
    const clientStats: { [key: string]: { total: number; completed: number } } = {};
    
    tasks.forEach(task => {
      if (!clientStats[task.clientName]) {
        clientStats[task.clientName] = { total: 0, completed: 0 };
      }
      clientStats[task.clientName].total++;
      if (task.status === 'completed') {
        clientStats[task.clientName].completed++;
      }
    });

    return clientStats;
  }, [tasks]);

  const addTask = () => {
    if (newTask.clientName && newTask.taskName) {
      const task: Task = {
        ...newTask,
        id: Date.now().toString()
      };
      setTasks([...tasks, task]);
      setNewTask({
        clientName: '',
        taskName: '',
        dueDate: '',
        status: 'pending',
        assignee: '',
        notes: ''
      });
    }
  };

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status } : task
    ));
  };

  const handleImport = (newTasks: Task[]) => {
    setTasks([...tasks, ...newTasks]);
  };

  const clearFilters = () => {
    setFilterClient('all');
    setFilterStatus('all');
  };

  const setReminder = () => {
    if (reminderTask && reminderTime) {
      const reminderDate = new Date(reminderTime);
      const now = new Date();
      const timeDiff = reminderDate.getTime() - now.getTime();
      
      if (timeDiff > 0) {
        setTimeout(() => {
          alert(`תזכורת: ${reminderTask}`);
        }, timeDiff);
        
        setReminderDialogOpen(false);
        setReminderTask('');
        setReminderTime('');
      }
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
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>הוספת תזכורת חדשה</DialogTitle>
                <DialogDescription>
                  הוסף תזכורת למשימה או פרויקט
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input
                  placeholder="תיאור התזכורת"
                  value={reminderTask}
                  onChange={(e) => setReminderTask(e.target.value)}
                />
                <Input
                  type="datetime-local"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setReminderDialogOpen(false)}>
                  ביטול
                </Button>
                <Button onClick={setReminder}>
                  הוסף תזכורת
                </Button>
              </div>
            </DialogContent>
          </ActionButtons>

          {/* ... keep existing code (task form, filters, progress, table) */}
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

          <div className="flex flex-wrap gap-4 mb-6 p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span className="font-medium">סינון:</span>
            </div>
            <Select value={filterClient} onValueChange={setFilterClient}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="בחר לקוח" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל הלקוחות</SelectItem>
                {clients.map(client => (
                  <SelectItem key={client} value={client}>
                    {client}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="בחר סטטוס" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל הסטטוסים</SelectItem>
                <SelectItem value="pending">משימות שלא בוצעו</SelectItem>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {clients.map(client => {
              const stats = projectProgress[client];
              const percentage = stats ? Math.round((stats.completed / stats.total) * 100) : 0;
              return (
                <Card key={client}>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{client}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>התקדמות</span>
                        <span>{percentage}%</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {stats?.completed || 0} מתוך {stats?.total || 0} משימות הושלמו
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <EditableTable
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