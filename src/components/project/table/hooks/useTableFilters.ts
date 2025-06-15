import { useState } from 'react';

export const useTableFilters = () => {
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});

  const updateFilter = (columnId: string, value: string) => {
    setColumnFilters(prev => ({ ...prev, [columnId]: value }));
  };

  const clearFilter = (columnId: string) => {
    setColumnFilters(prev => ({ ...prev, [columnId]: '' }));
  };

  const clearAllFilters = () => {
    setColumnFilters({});
  };

  return {
    columnFilters,
    updateFilter,
    clearFilter,
    clearAllFilters
  };
};