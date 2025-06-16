import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export const TestConnection = () => {
  const [status, setStatus] = useState<string>('Testing connection...');

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      const { data, error } = await supabase.from('tasks').select('*').limit(1);
      
      if (error) throw error;
      
      setStatus('Connected to Supabase successfully! ✅');
    } catch (error) {
      setStatus(`Connection error: ${error.message} ❌`);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-bold mb-2">Supabase Connection Status</h2>
      <p className={status.includes('error') ? 'text-red-500' : 'text-green-500'}>
        {status}
      </p>
    </div>
  );
};