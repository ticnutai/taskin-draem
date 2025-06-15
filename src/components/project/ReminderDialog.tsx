import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ReminderDialogProps {
  reminderTask: string;
  setReminderTask: (task: string) => void;
  reminderTime: string;
  setReminderTime: (time: string) => void;
  setReminderDialogOpen: (open: boolean) => void;
  onSetReminder: () => void;
}

export function ReminderDialog({
  reminderTask,
  setReminderTask,
  reminderTime,
  setReminderTime,
  setReminderDialogOpen,
  onSetReminder
}: ReminderDialogProps) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>הוספת תזכורת חדשה</DialogTitle>
        <DialogDescription>
          הוסף תזכורת למשימה או פרויקט
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <Input
          placeholder="תיאור התזכורת"
          value={reminderTask}
          onChange={(e) => setReminderTask(e.target.value)}
        />
        <Input
          type="datetime-local"
          value={reminderTime}
          onChange={(e) => setReminderTime(e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setReminderDialogOpen(false)}>
          ביטול
        </Button>
        <Button onClick={onSetReminder}>
          הוסף תזכורת
        </Button>
      </div>
    </DialogContent>
  );
}