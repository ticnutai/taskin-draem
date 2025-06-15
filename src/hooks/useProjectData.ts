import { useState, useMemo } from 'react';
import { Task } from '@/types/Task';
import { Column } from '@/types/Column';

export function useProjectData() {
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

  const [columns, setColumns] = useState<Column[]>([
    { id: 'clientName', label: 'שם הלקוח', visible: true, order: 0, required: true },
    { id: 'taskName', label: 'שם המשימה', visible: true, order: 1, required: true },
    { id: 'dueDate', label: 'תאריך יעד', visible: true, order: 2, required: false },
    { id: 'status', label: 'סטטוס', visible: true, order: 3, required: false },
    { id: 'assignee', label: 'אחראי', visible: true, order: 4, required: false },
    { id: 'notes', label: 'הערות', visible: true, order: 5, required: false },
    { id: 'actions', label: 'פעולות', visible: true, order: 6, required: true }
  ]);

  const clients = useMemo(() => {
    const uniqueClients = [...new Set(tasks.map(task => task.clientName))];
    return uniqueClients;
  }, [tasks]);

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
    const task: Task = {
      id: Date.now().toString(),
      clientName: newTask.clientName || '',
      taskName: newTask.taskName || '',
      dueDate: newTask.dueDate || '',
      status: 'pending',
      assignee: newTask.assignee || '',
      notes: newTask.notes || ''
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
  };

  const updateTaskField = (taskId: string, field: keyof Task, value: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, [field]: value } : task
    ));
  };

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status } : task
    ));
  };

  const handleImport = (newTasks: Task[]) => {
    setTasks([...tasks, ...newTasks]);
  };

  const addColumn = () => {
    const newColumn: Column = {
      id: `custom_${Date.now()}`,
      label: `עמודה חדשה ${columns.length + 1}`,
      visible: true,
      order: columns.length,
      required: false
    };
    setColumns([...columns, newColumn]);
  };

  return {
    tasks,
    setTasks,
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
    addColumn
  };
}