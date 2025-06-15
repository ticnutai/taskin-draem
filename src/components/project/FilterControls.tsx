import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';
import { statusOptions } from '@/types/Task';

interface FilterControlsProps {
  filterClient: string;
  setFilterClient: (client: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  clients: string[];
}

export function FilterControls({
  filterClient,
  setFilterClient,
  filterStatus,
  setFilterStatus,
  clients
}: FilterControlsProps) {
  return (
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
  );
}