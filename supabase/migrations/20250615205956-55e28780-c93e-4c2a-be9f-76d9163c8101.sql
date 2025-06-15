-- Create tasks table for storing project management data
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  task_name TEXT NOT NULL,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('completed', 'in-progress', 'pending')),
  assignee TEXT,
  notes TEXT,
  custom_data JSONB DEFAULT '{}', -- For storing dynamic column data
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create columns table for storing custom column definitions
CREATE TABLE public.columns (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  visible BOOLEAN NOT NULL DEFAULT true,
  column_order INTEGER NOT NULL DEFAULT 0,
  required BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default columns
INSERT INTO public.columns (id, label, visible, column_order, required) VALUES
('clientName', 'שם לקוח', true, 0, true),
('taskName', 'שם המשימה', true, 1, true),
('dueDate', 'תאריך יעד', true, 2, false),
('status', 'סטטוס', true, 3, true),
('assignee', 'מבצע', true, 4, false),
('notes', 'הערות', true, 5, false);

-- Enable Row Level Security
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.columns ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since no authentication is implemented yet)
CREATE POLICY "Public can view all tasks" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Public can insert tasks" ON public.tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update tasks" ON public.tasks FOR UPDATE USING (true);
CREATE POLICY "Public can delete tasks" ON public.tasks FOR DELETE USING (true);

CREATE POLICY "Public can view all columns" ON public.columns FOR SELECT USING (true);
CREATE POLICY "Public can insert columns" ON public.columns FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update columns" ON public.columns FOR UPDATE USING (true);
CREATE POLICY "Public can delete columns" ON public.columns FOR DELETE USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_columns_updated_at
  BEFORE UPDATE ON public.columns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();