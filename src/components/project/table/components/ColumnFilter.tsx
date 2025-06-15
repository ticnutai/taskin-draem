import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Filter, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ColumnFilterProps {
  columnId: string;
  columnType: 'text' | 'date' | 'status';
  filterValue: string;
  onFilterChange: (columnId: string, value: string) => void;
  onClearFilter: (columnId: string) => void;
  options?: ReadonlyArray<{ readonly value: string; readonly label: string; readonly color?: string }>;
}

export function ColumnFilter({
  columnId,
  columnType,
  filterValue,
  onFilterChange,
  onClearFilter,
  options
}: ColumnFilterProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    filterValue ? new Date(filterValue) : undefined
  );

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      onFilterChange(columnId, date.toISOString().split('T')[0]);
    } else {
      onFilterChange(columnId, '');
    }
    setIsOpen(false);
  };

  const renderFilter = () => {
    switch (columnType) {
      case 'date':
        return (
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-6 text-xs justify-start text-right font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-1 h-3 w-3" />
                {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "סנן תאריך"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        );

      case 'status':
        return (
          <Select value={filterValue} onValueChange={(value) => onFilterChange(columnId, value)}>
            <SelectTrigger className="h-6 text-xs w-24">
              <SelectValue placeholder="סנן" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">הכל</SelectItem>
              {options?.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default:
        return (
          <Input
            placeholder="סנן..."
            value={filterValue}
            onChange={(e) => onFilterChange(columnId, e.target.value)}
            className="h-6 text-xs text-right"
          />
        );
    }
  };

  return (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <Filter className="h-3 w-3 text-muted-foreground" />
      {renderFilter()}
      {filterValue && (
        <Button
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
          onClick={() => {
            onClearFilter(columnId);
            setSelectedDate(undefined);
          }}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}