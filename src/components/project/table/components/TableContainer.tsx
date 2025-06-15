import React, { useRef } from 'react';

interface TableContainerProps {
  children: React.ReactNode;
  isResizing: boolean;
}

export function TableContainer({ children, isResizing }: TableContainerProps) {
  const tableRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={tableRef}
      className="relative overflow-auto max-h-[600px] max-w-full rounded-2xl border border-slate-200 shadow-2xl"
      style={{ cursor: isResizing ? 'col-resize' : 'default' }}
    >
      <table className="w-max min-w-full border-separate border-spacing-0 rounded-2xl overflow-hidden shadow-inner">
        {children}
      </table>
    </div>
  );
}