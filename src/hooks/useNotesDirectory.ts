import { useState, useEffect } from 'react';
import { SelectedRange } from './useCalendar';

export type NoteEntry = {
  key: string;
  label: string;
  preview: string;
  range: SelectedRange;
};

export function useNotesDirectory(currentMonth: Date) {
  const [directory, setDirectory] = useState<NoteEntry[]>([]);

  useEffect(() => {
    const loadDirectory = () => {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const entries: NoteEntry[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || !key.startsWith('kalendar_notes_')) continue;

        const rawVal = localStorage.getItem(key) || '';
        if (!rawVal.trim()) continue; 

        const strippedKey = key.replace('kalendar_notes_', '');
        
        let label = '';
        let range: SelectedRange = { start: null, end: null };
        let isValidForMonth = false;

        if (strippedKey.startsWith('single_')) {
          const time = parseInt(strippedKey.split('_')[1], 10);
          const date = new Date(time);
          if (date.getFullYear() === year && date.getMonth() === month) {
            isValidForMonth = true;
            range = { start: date, end: null };
            label = `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
          }
        } else if (strippedKey.startsWith('range_')) {
          const parts = strippedKey.split('_');
          const start = new Date(parseInt(parts[1], 10));
          const end = new Date(parseInt(parts[2], 10));
  
          if ((start.getFullYear() === year && start.getMonth() === month) || 
              (end.getFullYear() === year && end.getMonth() === month)) {
            isValidForMonth = true;
            range = { start, end };
            label = `${start.getDate()} - ${end.getDate()} ${start.toLocaleString('en-US', { month: 'short'})}`;
          }
        }

        if (isValidForMonth) {
          entries.push({
            key,
            label,
            preview: rawVal.length > 40 ? rawVal.substring(0, 40) + '...' : rawVal,
            range
          });
        }
      }

      entries.sort((a, b) => {
        if (!a.range.start || !b.range.start) return 0;
        return a.range.start.getTime() - b.range.start.getTime();
      });

      setDirectory(entries);
    };

    loadDirectory();
    
    window.addEventListener('storage', loadDirectory);
    window.addEventListener('kalendar-note-saved', loadDirectory);
    return () => {
      window.removeEventListener('storage', loadDirectory);
      window.removeEventListener('kalendar-note-saved', loadDirectory);
    };
  }, [currentMonth]);

  return directory;
}
