import { useState, useEffect } from 'react';

export function useNotes(contextKey: string) {
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    const savedNotes = localStorage.getItem(`kalendar_notes_${contextKey}`);
    if (savedNotes) {
      setNotes(savedNotes);
    } else {
      setNotes('');
    }
  }, [contextKey]);

  const saveNotes = (newNotes: string) => {
    setNotes(newNotes);
    localStorage.setItem(`kalendar_notes_${contextKey}`, newNotes);
    window.dispatchEvent(new Event('kalendar-note-saved'));
  };

  return {
    notes,
    saveNotes,
  };
}
