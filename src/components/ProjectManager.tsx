import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Plus, Filter } from 'lucide-react';
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

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">ניהול פרויקטים לפי לקוח</CardTitle>
        </CardHeader>
        <CardContent>
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
            <Button onClick={addTask} className="md:col-span-2 lg:col-span-3">
              <Plus className="w-4 h-4 ml-2" />
              הוסף משימה
            </Button>
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