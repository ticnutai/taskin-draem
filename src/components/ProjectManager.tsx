import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Filter, Bell, Download, Upload, Calendar, Clock } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export interface Task {
  id: string;
  clientName: string;
  taskName: string;
  dueDate: string;
  status: 'completed' | 'in-progress' | 'pending';
  assignee: string;
  notes: string;
}

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

  const statusOptions = [
    { value: 'completed', label: 'הושלם', color: 'bg-green-50 text-green-700 border-green-200' },
    { value: 'in-progress', label: 'בטיפול', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    { value: 'pending', label: 'ממתין', color: 'bg-red-50 text-red-700 border-red-200' }
  ];

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

  const exportToCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "שם הלקוח,שם המשימה,תאריך יעד,סטטוס,אחראי,הערות\n"
      + tasks.map(task => 
          `"${task.clientName}","${task.taskName}","${task.dueDate}","${statusOptions.find(opt => opt.value === task.status)?.label}","${task.assignee}","${task.notes}"`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "משימות_לקוחות.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    const jsonData = tasks.map(task => ({
      "שם הלקוח": task.clientName,
      "שם המשימה": task.taskName,
      "תאריך יעד": task.dueDate,
      "סטטוס": statusOptions.find(opt => opt.value === task.status)?.label,
      "אחראי": task.assignee,
      "הערות": task.notes
    }));
    
    const worksheet = JSON.stringify(jsonData);
    const csvContent = "data:application/vnd.ms-excel," + encodeURIComponent(worksheet);
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", "משימות_לקוחות.xls");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const importFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        // Simple CSV parsing for demo
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        const newTasks: Task[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',');
          if (values.length >= 6) {
            newTasks.push({
              id: Date.now().toString() + i,
              clientName: values[0]?.replace(/"/g, '') || '',
              taskName: values[1]?.replace(/"/g, '') || '',
              dueDate: values[2]?.replace(/"/g, '') || '',
              status: 'pending' as Task['status'],
              assignee: values[4]?.replace(/"/g, '') || '',
              notes: values[5]?.replace(/"/g, '') || ''
            });
          }
        }
        
        setTasks([...tasks, ...newTasks]);
      } catch (error) {
        console.error('Error parsing file:', error);
      }
    };
    reader.readAsText(file);
  };

  const setReminder = () => {
    if (reminderTask && reminderTime) {
      // In a real app, this would integrate with browser notifications or a backend service
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
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">ניהול פרויקטים לפי לקוח</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Action Buttons - Gradient Style */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <Button
              onClick={addTask}
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white font-medium py-3 px-6 rounded-2xl transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-4 h-4 ml-2" />
              הוסף משימה
            </Button>
            
            <Dialog open={reminderDialogOpen} onOpenChange={setReminderDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 hover:from-pink-600 hover:via-rose-600 hover:to-orange-600 text-white font-medium py-3 px-6 rounded-2xl transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                  <Bell className="w-4 h-4 ml-2" />
                  הוסף תזכורת
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>הוספת תזכורת חדשה</DialogTitle>
                  <DialogDescription>
                    הוסף תזכורת למשימה או פרויקט
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Input
                      placeholder="תיאור התזכורת"
                      value={reminderTask}
                      onChange={(e) => setReminderTask(e.target.value)}
                      className="col-span-4"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Input
                      type="datetime-local"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      className="col-span-4"
                    />
                  </div>
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
            </Dialog>

            <Button
              onClick={exportToCSV}
              className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 hover:from-cyan-600 hover:via-blue-600 hover:to-indigo-600 text-white font-medium py-3 px-6 rounded-2xl transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Download className="w-4 h-4 ml-2" />
              יצוא CSV
            </Button>

            <Button
              onClick={exportToExcel}
              className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white font-medium py-3 px-6 rounded-2xl transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Download className="w-4 h-4 ml-2" />
              יצוא Excel
            </Button>

            <label className="bg-gradient-to-r from-orange-500 via-yellow-500 to-green-500 hover:from-orange-600 hover:via-yellow-600 hover:to-green-600 text-white font-medium py-3 px-6 rounded-2xl transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer flex items-center justify-center">
              <Upload className="w-4 h-4 ml-2" />
              יבוא קובץ
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={importFromFile}
                className="hidden"
              />
            </label>

            <Button
              variant="outline"
              onClick={() => {
                setFilterClient('all');
                setFilterStatus('all');
              }}
              className="bg-gradient-to-r from-green-500 via-teal-500 to-cyan-500 hover:from-green-600 hover:via-teal-600 hover:to-cyan-600 text-white font-medium py-3 px-6 rounded-2xl transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl border-none"
            >
              <Filter className="w-4 h-4 ml-2" />
              נקה סינון
            </Button>
          </div>
          {/* Add New Task Form */}
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

          {/* Filters */}
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
            <Button 
              variant="outline" 
              onClick={() => {
                setFilterClient('all');
                setFilterStatus('all');
              }}
            >
              נקה סינון
            </Button>
          </div>

          {/* Progress Summary */}
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

          {/* Tasks Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>שם הלקוח</TableHead>
                  <TableHead>שם המשימה</TableHead>
                  <TableHead>תאריך יעד</TableHead>
                  <TableHead>סטטוס</TableHead>
                  <TableHead>אחראי</TableHead>
                  <TableHead>הערות</TableHead>
                  <TableHead>פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow key={task.id} className={getRowColor(task.status)}>
                    <TableCell className="font-medium">{task.clientName}</TableCell>
                    <TableCell>{task.taskName}</TableCell>
                    <TableCell>{new Date(task.dueDate).toLocaleDateString('he-IL')}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(task.status)}>
                        {statusOptions.find(opt => opt.value === task.status)?.label}
                      </Badge>
                    </TableCell>
                    <TableCell>{task.assignee}</TableCell>
                    <TableCell className="max-w-xs truncate">{task.notes}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Select value={task.status} onValueChange={(value: Task['status']) => updateTaskStatus(task.id, value)}>
                          <SelectTrigger className="w-32">
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
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setReminderTask(`תזכורת למשימה: ${task.taskName} עבור ${task.clientName}`);
                            setReminderDialogOpen(true);
                          }}
                          className="px-2"
                        >
                          <Bell className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

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