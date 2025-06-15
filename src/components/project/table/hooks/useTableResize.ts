import { useCallback } from 'react';

interface UseTableResizeProps {
  columnWidths: Record<string, number>;
  rowHeights: Record<string, number>;
  setColumnWidths: (widths: Record<string, number> | ((prev: Record<string, number>) => Record<string, number>)) => void;
  setRowHeights: (heights: Record<string, number> | ((prev: Record<string, number>) => Record<string, number>)) => void;
  setIsResizing: (resizing: boolean) => void;
}

export const useTableResize = ({
  columnWidths,
  rowHeights,
  setColumnWidths,
  setRowHeights,
  setIsResizing
}: UseTableResizeProps) => {
  const handleMouseDown = useCallback((e: React.MouseEvent, type: 'column' | 'row', id: string) => {
    e.preventDefault();
    setIsResizing(true);
    
    const startPos = type === 'column' ? e.clientX : e.clientY;
    const startSize = type === 'column' 
      ? columnWidths[id] || 200 
      : rowHeights[id] || 50;

    const handleMouseMove = (e: MouseEvent) => {
      const currentPos = type === 'column' ? e.clientX : e.clientY;
      const diff = currentPos - startPos;
      const newSize = Math.max(50, startSize + diff);
      
      if (type === 'column') {
        setColumnWidths(prev => ({ ...prev, [id]: newSize }));
      } else {
        setRowHeights(prev => ({ ...prev, [id]: newSize }));
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [columnWidths, rowHeights, setColumnWidths, setRowHeights, setIsResizing]);

  return { handleMouseDown };
};