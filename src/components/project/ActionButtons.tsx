import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Bell, Download, Upload, Filter } from 'lucide-react';
import { exportToCSV, exportToExcel, importFromFile } from '@/utils/fileOperations';
import { Task } from '@/types/Task';

interface ActionButtonsProps {
  onAddTask: () => void;
  tasks: Task[];
  onImport: (tasks: Task[]) => void;
  onClearFilters: () => void;
  reminderDialogOpen: boolean;
  setReminderDialogOpen: (open: boolean) => void;
  children: React.ReactNode;
}

export function ActionButtons({ 
  onAddTask, 
  tasks, 
  onImport, 
  onClearFilters,
  reminderDialogOpen,
  setReminderDialogOpen,
  children 
}: ActionButtonsProps) {
  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    importFromFile(file, onImport);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      <Button
        onClick={onAddTask}
        className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white font-medium py-3 px-6 rounded-2xl transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <Plus className="w-4 h-4 ml-2" />
        הוסף משימה
      </Button>
      
      <Dialog open={reminderDialogOpen} onOpenChange={setReminderDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 hover:from-pink-600 hover:via-rose-600 hover:to-orange-600 text-white font-medium py-3 px-6 rounded-2xl transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
            <Bell className="w-4 h-4 ml-2" />
            הוסף תזכורת
          </Button>
        </DialogTrigger>
        {children}
      </Dialog>

      <Button
        onClick={() => exportToCSV(tasks)}
        className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 hover:from-cyan-600 hover:via-blue-600 hover:to-indigo-600 text-white font-medium py-3 px-6 rounded-2xl transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <Download className="w-4 h-4 ml-2" />
        יצוא CSV
      </Button>

      <Button
        onClick={() => exportToExcel(tasks)}
        className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white font-medium py-3 px-6 rounded-2xl transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <Download className="w-4 h-4 ml-2" />
        יצוא Excel
      </Button>

      <label className="bg-gradient-to-r from-orange-500 via-yellow-500 to-green-500 hover:from-orange-600 hover:via-yellow-600 hover:to-green-600 text-white font-medium py-3 px-6 rounded-2xl transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer flex items-center justify-center">
        <Upload className="w-4 h-4 ml-2" />
        יבוא קובץ
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileImport}
          className="hidden"
        />
      </label>

      <Button
        variant="outline"
        onClick={onClearFilters}
        className="bg-gradient-to-r from-green-500 via-teal-500 to-cyan-500 hover:from-green-600 hover:via-teal-600 hover:to-cyan-600 text-white font-medium py-3 px-6 rounded-2xl transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl border-none"
      >
        <Filter className="w-4 h-4 ml-2" />
        נקה סינון
      </Button>
    </div>
  );
}