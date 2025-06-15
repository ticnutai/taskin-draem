export interface Task {
  id: string;
  clientName: string;
  taskName: string;
  dueDate: string;
  status: 'completed' | 'in-progress' | 'pending';
  assignee: string;
  notes: string;
  [key: string]: any; // Allow dynamic columns
}

export const statusOptions = [
  { value: 'completed', label: 'הושלם', color: 'bg-green-50 text-green-700 border-green-200' },
  { value: 'in-progress', label: 'בטיפול', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  { value: 'pending', label: 'ממתין', color: 'bg-red-50 text-red-700 border-red-200' }
] as const;