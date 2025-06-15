import { useState } from 'react';

export function useReminders() {
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [reminderTask, setReminderTask] = useState<string>('');
  const [reminderTime, setReminderTime] = useState<string>('');

  const setReminder = () => {
    if (reminderTask && reminderTime) {
      const reminderDate = new Date(reminderTime);
      const now = new Date();
      const timeDiff = reminderDate.getTime() - now.getTime();
      
      if (timeDiff > 0) {
        setTimeout(() => {
          alert(`תזכורת: ${reminderTask}`);
        }, timeDiff);
        
        setReminderDialogOpen(false);
        setReminderTask('');
        setReminderTime('');
      }
    }
  };

  return {
    reminderDialogOpen,
    setReminderDialogOpen,
    reminderTask,
    setReminderTask,
    reminderTime,
    setReminderTime,
    setReminder
  };
}