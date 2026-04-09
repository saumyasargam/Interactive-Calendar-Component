"use client";

import { useNotes } from "@/hooks/useNotes";
import { useNotesDirectory } from "@/hooks/useNotesDirectory";
import { SelectedRange } from "@/hooks/useCalendar";
import { motion, AnimatePresence } from "framer-motion";
import { PenLine, Calendar as CalendarIcon, BookOpen } from "lucide-react";

type NotesSectionProps = {
  currentMonth: Date;
  selectedRange: SelectedRange;
  onSelectNoteRange: (range: SelectedRange) => void;
};

export default function NotesSection({ currentMonth, selectedRange, onSelectNoteRange }: NotesSectionProps) {
  
  const directory = useNotesDirectory(currentMonth);

  let contextKey = `${currentMonth.getFullYear()}-${currentMonth.getMonth()}`;
  let contextLabel = "Memos for the Month";
  let ContextIcon = CalendarIcon;
  const isDefaultView = !selectedRange.start;

  if (!isDefaultView) {
    if (selectedRange.end) {
      contextKey = `range_${selectedRange.start!.getTime()}_${selectedRange.end.getTime()}`;
      contextLabel = `Notes: ${selectedRange.start!.getDate()} - ${selectedRange.end.getDate()}`;
    } else {
      contextKey = `single_${selectedRange.start!.getTime()}`;
      contextLabel = `Notes for ${selectedRange.start!.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
    ContextIcon = PenLine;
  }

  const { notes, saveNotes } = useNotes(contextKey);

  return (
    <div style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ContextIcon size={18} color="var(--color-brand-blue)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-main)', margin: 0 }}>
            {contextLabel}
          </h3>
        </div>
        {!isDefaultView && (
          <button 
            onClick={() => onSelectNoteRange({ start: null, end: null })}
            style={{ 
              background: 'rgba(29, 161, 242, 0.1)', 
              color: 'var(--color-brand-blue)', 
              border: 'none', 
              padding: '6px 12px', 
              borderRadius: '20px', 
              fontSize: '0.8rem', 
              fontWeight: 600, 
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(29, 161, 242, 0.2)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(29, 161, 242, 0.1)'}
          >
            ✕ Close
          </button>
        )}
      </div>

      <div style={{ position: 'relative', height: isDefaultView ? '160px' : '280px', overflow: 'hidden', transition: 'height 0.3s ease' }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'repeating-linear-gradient(transparent, transparent 38px, var(--color-lines) 38px, var(--color-lines) 39px)',
          backgroundSize: '100% 39px',
          pointerEvents: 'none',
          zIndex: 0
        }} />
        
        <AnimatePresence mode="wait">
          <motion.textarea
            key={contextKey}
            initial={{ opacity: 0, x: -10, rotateX: 10 }}
            animate={{ opacity: 1, x: 0, rotateX: 0 }}
            exit={{ opacity: 0, x: 10, rotateX: -10 }}
            transition={{ duration: 0.2, type: "spring", stiffness: 200, damping: 20 }}
            value={notes}
            onChange={(e) => saveNotes(e.target.value)}
            style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%',
              height: '100%',
              background: 'transparent',
              border: 'none',
              resize: 'none',
              outline: 'none',
              lineHeight: '39px',
              fontSize: '1rem',
              padding: '0',
              margin: '0',
              color: 'var(--color-text-main)',
              zIndex: 1,
              boxSizing: 'border-box'
            }}
            placeholder={!isDefaultView ? "✍️ Log details for this date range..." : "✍️ Jot down general month memos..."}
          />
        </AnimatePresence>
      </div>

      {isDefaultView && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginTop: '20px', borderTop: '1px solid var(--color-lines)', paddingTop: '15px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', color: 'var(--color-text-faded)' }}>
            <BookOpen size={14} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Directory Index
            </span>
          </div>

          {directory.length === 0 ? (
            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-faded)', fontStyle: 'italic' }}>
              No date-specific notes saved.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '150px', overflowY: 'auto' }}>
              {directory.map((entry) => (
                <div 
                  key={entry.key}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: 'white',
                    border: '1px solid var(--color-lines)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--color-brand-blue)'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--color-lines)'}
                  onClick={() => onSelectNoteRange(entry.range)}
                >
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-brand-dark)', marginBottom: '2px' }}>
                    {entry.label}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {entry.preview}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

    </div>
  );
}
