import { useState, useMemo } from 'react';
import { Task } from '@/types/Task';

export function useFilters(tasks: Task[]) {
  const [filterClient, setFilterClient] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const clientMatch = !filterClient || filterClient === 'all' || task.clientName === filterClient;
      const statusMatch = !filterStatus || filterStatus === 'all' || task.status === filterStatus;
      return clientMatch && statusMatch;
    });
  }, [tasks, filterClient, filterStatus]);

  const clearFilters = () => {
    setFilterClient('all');
    setFilterStatus('all');
  };

  return {
    filterClient,
    setFilterClient,
    filterStatus,
    setFilterStatus,
    filteredTasks,
    clearFilters
  };
}