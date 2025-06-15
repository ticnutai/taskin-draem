import { useState, useMemo, useEffect } from 'react';
import { Task } from '@/types/Task';
import { Column } from '@/types/Column';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useProjectData() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [newTask, setNewTask] = useState<Omit<Task, 'id'>>({
    clientName: '',
    taskName: '',
    dueDate: '',
    status: 'pending',
    assignee: '',
    notes: ''
  });

  const [columns, setColumns] = useState<Column[]>([]);

  const clients = useMemo(() => {
    const uniqueClients = [...new Set(tasks.map(task => task.clientName).filter(name => name && name.trim() !== ''))];
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

  // Load data from Supabase on mount
  useEffect(() => {
    loadTasks();
    loadColumns();
  }, []);

  const loadTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedTasks: Task[] = data.map(task => {
        const baseTask: Task = {
          id: task.id,
          clientName: task.client_name,
          taskName: task.task_name,
          dueDate: task.due_date || '',
          status: task.status as Task['status'],
          assignee: task.assignee || '',
          notes: task.notes || ''
        };
        
        // Add custom data if it exists and is an object
        if (task.custom_data && typeof task.custom_data === 'object') {
          Object.assign(baseTask, task.custom_data);
        }
        
        return baseTask;
      });

      setTasks(formattedTasks);
    } catch (error: any) {
      toast({
        title: "שגיאה בטעינת משימות",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadColumns = async () => {
    try {
      const { data, error } = await supabase
        .from('columns')
        .select('*')
        .order('column_order', { ascending: true });

      if (error) throw error;

      const formattedColumns: Column[] = data.map(col => ({
        id: col.id,
        label: col.label,
        visible: col.visible,
        order: col.column_order,
        required: col.required
      }));

      // Add actions column if not exists
      if (!formattedColumns.find(col => col.id === 'actions')) {
        formattedColumns.push({
          id: 'actions',
          label: 'פעולות',
          visible: true,
          order: formattedColumns.length,
          required: true
        });
      }

      setColumns(formattedColumns);
    } catch (error: any) {
      toast({
        title: "שגיאה בטעינת עמודות",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const addTask = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          client_name: newTask.clientName || '',
          task_name: newTask.taskName || '',
          due_date: newTask.dueDate || null,
          status: 'pending',
          assignee: newTask.assignee || '',
          notes: newTask.notes || ''
        })
        .select()
        .single();

      if (error) throw error;

      const formattedTask: Task = {
        id: data.id,
        clientName: data.client_name,
        taskName: data.task_name,
        dueDate: data.due_date || '',
        status: data.status as Task['status'],
        assignee: data.assignee || '',
        notes: data.notes || ''
      };

      setTasks([formattedTask, ...tasks]);
      setNewTask({
        clientName: '',
        taskName: '',
        dueDate: '',
        status: 'pending',
        assignee: '',
        notes: ''
      });

      toast({
        title: "משימה נוספה",
        description: "המשימה נשמרה בהצלחה"
      });
    } catch (error: any) {
      toast({
        title: "שגיאה בהוספת משימה",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const updateTaskField = async (taskId: string, field: keyof Task, value: string) => {
    console.log('updateTaskField called:', { taskId, field, value });
    try {
      const updateData: any = {};
      
      // Handle built-in fields
      const builtInFields = ['clientName', 'taskName', 'dueDate', 'status', 'assignee', 'notes'];
      
      if (builtInFields.includes(field as string)) {
        console.log('Updating built-in field:', field);
        // Map field names to database column names
        switch (field) {
          case 'clientName':
            updateData.client_name = value;
            break;
          case 'taskName':
            updateData.task_name = value;
            break;
          case 'dueDate':
            updateData.due_date = value || null;
            break;
          case 'assignee':
            updateData.assignee = value;
            break;
          case 'notes':
            updateData.notes = value;
            break;
          case 'status':
            updateData.status = value;
            break;
        }
      } else {
        console.log('Updating custom field:', field);
        // Handle custom fields - update them in custom_data jsonb column
        const task = tasks.find(t => t.id === taskId);
        const currentCustomData = task ? Object.keys(task)
          .filter(key => !builtInFields.includes(key) && key !== 'id')
          .reduce((acc, key) => ({ ...acc, [key]: task[key as keyof Task] }), {}) : {};
        
        updateData.custom_data = {
          ...currentCustomData,
          [field]: value
        };
        console.log('Custom data update:', updateData.custom_data);
      }

      console.log('Sending update to Supabase:', updateData);
      const { error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', taskId);

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      console.log('Supabase update successful, updating local state');
      // Update local state
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, [field]: value } : task
      ));
    } catch (error: any) {
      toast({
        title: "שגיאה בעדכון משימה",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const updateTaskStatus = async (taskId: string, status: Task['status']) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', taskId);

      if (error) throw error;

      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status } : task
      ));
    } catch (error: any) {
      toast({
        title: "שגיאה בעדכון סטטוס",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleImport = async (newTasks: Task[]) => {
    try {
      const tasksToInsert = newTasks.map(task => ({
        client_name: task.clientName,
        task_name: task.taskName,
        due_date: task.dueDate || null,
        status: task.status,
        assignee: task.assignee || '',
        notes: task.notes || ''
      }));

      const { data, error } = await supabase
        .from('tasks')
        .insert(tasksToInsert)
        .select();

      if (error) throw error;

      const formattedTasks: Task[] = data.map(task => ({
        id: task.id,
        clientName: task.client_name,
        taskName: task.task_name,
        dueDate: task.due_date || '',
        status: task.status as Task['status'],
        assignee: task.assignee || '',
        notes: task.notes || ''
      }));

      setTasks([...formattedTasks, ...tasks]);

      toast({
        title: "ייבוא הושלם",
        description: `${newTasks.length} משימות יובאו בהצלחה`
      });
    } catch (error: any) {
      toast({
        title: "שגיאה בייבוא",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const addColumn = async () => {
    try {
      const newColumn: Column = {
        id: `custom_${Date.now()}`,
        label: `עמודה חדשה ${columns.length}`,
        visible: true,
        order: columns.length,
        required: false
      };

      const { error } = await supabase
        .from('columns')
        .insert({
          id: newColumn.id,
          label: newColumn.label,
          visible: newColumn.visible,
          column_order: newColumn.order,
          required: newColumn.required
        });

      if (error) throw error;

      setColumns([...columns, newColumn]);

      toast({
        title: "עמודה נוספה",
        description: "העמודה נשמרה בהצלחה"
      });
    } catch (error: any) {
      toast({
        title: "שגיאה בהוספת עמודה",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      setTasks(tasks.filter(task => task.id !== taskId));

      toast({
        title: "משימה נמחקה",
        description: "המשימה נמחקה בהצלחה"
      });
    } catch (error: any) {
      toast({
        title: "שגיאה במחיקת משימה",
        description: error.message,
        variant: "destructive"
      });
    }
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
    addColumn,
    deleteTask,
    loading
  };
}