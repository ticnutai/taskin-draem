import { Task, statusOptions } from '@/types/Task';

export const exportToCSV = (tasks: Task[]) => {
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

export const exportToExcel = (tasks: Task[]) => {
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

export const importFromFile = (file: File, onImport: (tasks: Task[]) => void) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target?.result as string;
    try {
      const lines = text.split('\n');
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
      
      onImport(newTasks);
    } catch (error) {
      console.error('Error parsing file:', error);
    }
  };
  reader.readAsText(file);
};