import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MoveVertical, Eye, EyeOff } from 'lucide-react';
import { Column } from '@/types/Column';


interface ColumnManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columns: Column[];
  onColumnsChange: (columns: Column[]) => void;
}

export function ColumnManager({ open, onOpenChange, columns, onColumnsChange }: ColumnManagerProps) {
  const [localColumns, setLocalColumns] = useState(columns);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    const newColumns = [...localColumns];
    const draggedColumn = newColumns[draggedIndex];
    
    // Remove dragged item
    newColumns.splice(draggedIndex, 1);
    
    // Insert at new position
    newColumns.splice(dropIndex, 0, draggedColumn);
    
    // Update order numbers
    const updatedColumns = newColumns.map((col, index) => ({
      ...col,
      order: index
    }));

    setLocalColumns(updatedColumns);
    setDraggedIndex(null);
  };

  const toggleColumn = (columnId: string) => {
    const updatedColumns = localColumns.map(col =>
      col.id === columnId ? { ...col, visible: !col.visible } : col
    );
    setLocalColumns(updatedColumns);
  };

  const saveChanges = () => {
    onColumnsChange(localColumns);
    onOpenChange(false);
  };

  const resetToDefault = () => {
    const defaultColumns: Column[] = [
      { id: 'clientName', label: 'שם הלקוח', visible: true, order: 0, required: true },
      { id: 'taskName', label: 'שם המשימה', visible: true, order: 1, required: true },
      { id: 'dueDate', label: 'תאריך יעד', visible: true, order: 2 },
      { id: 'status', label: 'סטטוס', visible: true, order: 3 },
      { id: 'assignee', label: 'אחראי', visible: true, order: 4 },
      { id: 'notes', label: 'הערות', visible: true, order: 5 },
      { id: 'actions', label: 'פעולות', visible: true, order: 6, required: true }
    ];
    setLocalColumns(defaultColumns);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right">ניהול עמודות וסדר תצוגה</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 overflow-y-auto max-h-[60vh] pl-2">
          <div className="text-sm text-muted-foreground text-right mb-4">
            גרור ושחרר כדי לשנות סדר • הפעל/כבה כדי להציג/להסתיר עמודות
          </div>
          
          {localColumns
            .sort((a, b) => a.order - b.order)
            .map((column, index) => (
              <Card 
                key={column.id}
                className={`cursor-move border-2 transition-all duration-200 ${
                  draggedIndex === index ? 'opacity-50 border-blue-400' : 'hover:border-blue-300'
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MoveVertical className="w-4 h-4 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span className="font-medium">{column.label}</span>
                        <span className="text-xs text-muted-foreground">סדר: {column.order + 1}</span>
                      </div>
                      {column.required && (
                        <Badge variant="secondary" className="text-xs">
                          חובה
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {column.visible ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )}
                      <Switch
                        checked={column.visible}
                        onCheckedChange={() => toggleColumn(column.id)}
                        disabled={column.required}
                        className="data-[state=checked]:bg-green-500"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
        
        <div className="flex justify-between gap-2 pt-4 border-t">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              ביטול
            </Button>
            <Button onClick={saveChanges} className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
              שמור שינויים
            </Button>
          </div>
          <Button variant="ghost" onClick={resetToDefault} className="text-muted-foreground">
            איפוס לברירת מחדל
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}