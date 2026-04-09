"use client";

import { CalendarDay, SelectedRange } from "@/hooks/useCalendar";
import { motion } from "framer-motion";

type CalendarGridProps = {
  daysInMonth: CalendarDay[];
  selectedRange: SelectedRange;
  hoverDate: Date | null;
  onDateClick: (date: Date) => void;
  onDateHover: (date: Date) => void;
};

const DAYS_OF_WEEK = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export default function CalendarGrid({
  daysInMonth,
  selectedRange,
  hoverDate,
  onDateClick,
  onDateHover,
}: CalendarGridProps) {
  
  const isWeekend = (index: number) => index === 5 || index === 6;

  const isSelected = (date: Date) => {
    if (!selectedRange.start) return false;
    if (selectedRange.end && date.toDateString() === selectedRange.end.toDateString()) return true;
    return date.toDateString() === selectedRange.start.toDateString();
  };

  const isInRange = (date: Date) => {
    if (!selectedRange.start) return false;
    const targetTime = date.getTime();
    const startTime = selectedRange.start.getTime();

    if (selectedRange.end) {
      const endTime = selectedRange.end.getTime();
      return targetTime > startTime && targetTime < endTime;
    }
    
    if (hoverDate) {
      const hoverTime = hoverDate.getTime();
      if (hoverTime > startTime) {
        return targetTime > startTime && targetTime <= hoverTime;
      }
    }
    return false;
  };


  const hasEvent = (date: Date) => {
    const d = date.getDate();
    return d === 14 || d === 20; 
  };

  return (
    <div style={{ flex: '2', minWidth: '350px' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        marginBottom: '20px',
        textAlign: 'center',
        fontSize: '0.8rem',
        fontWeight: 800,
        letterSpacing: '0.05em'
      }}>
        {DAYS_OF_WEEK.map((day, index) => (
          <div 
            key={day} 
            style={{ 
              color: isWeekend(index) ? 'var(--color-brand-blue)' : 'var(--color-text-main)' 
            }}
          >
            {day}
          </div>
        ))}
      </div>

      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          rowGap: '12px',
        }}
        onMouseLeave={() => onDateHover(null as any)}
      >
        {daysInMonth.map((dayObj, index) => {
          const weekend = isWeekend(index % 7);
          const selected = isSelected(dayObj.date);
          const inRange = isInRange(dayObj.date);
          const eventMarker = hasEvent(dayObj.date);
          
          let textColor = 'var(--color-text-main)';
          if (!dayObj.isCurrentMonth) {
            textColor = 'var(--color-text-faded)';
          } else if (weekend) {
            textColor = 'var(--color-brand-dark)';
          }

          if (selected) {
            textColor = 'white';
          }

          const isStartDate = selectedRange.start && dayObj.date.toDateString() === selectedRange.start.toDateString();
          const isEndDate = selectedRange.end && dayObj.date.toDateString() === selectedRange.end.toDateString();

          const cellStyle: React.CSSProperties = {
            position: 'relative',
            height: '45px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 600,
            background: inRange && !selected ? 'var(--color-selection)' : 'transparent',
            ...(isStartDate && (selectedRange.end || hoverDate) && dayObj.date < (selectedRange.end || hoverDate as Date) ? {
              background: `linear-gradient(to right, transparent 50%, var(--color-selection) 50%)`
            } : {}),
            ...(isEndDate ? {
              background: `linear-gradient(to left, transparent 50%, var(--color-selection) 50%)`
            } : {})
          };

          return (
            <div 
              key={`${dayObj.date.toISOString()}-${index}`}
              style={cellStyle}
              onClick={() => onDateClick(dayObj.date)}
              onMouseEnter={() => onDateHover(dayObj.date)}
            >
              <motion.div 
                whileHover={!selected && !inRange ? { scale: 1.1, backgroundColor: 'var(--color-weekend-hover)' } : {}}
                whileTap={{ scale: 0.9 }}
                style={{
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: selected ? '50%' : '12px',
                  backgroundColor: selected ? 'var(--color-brand-blue)' : 'transparent',
                  color: textColor,
                  transition: 'background-color 0.1s ease',
                  zIndex: 2,
                  boxShadow: selected ? '0 4px 10px rgba(29, 161, 242, 0.4)' : 'none'
                }}
              >
                {dayObj.date.getDate()}
              </motion.div>

              {eventMarker && dayObj.isCurrentMonth && !selected && (
                <div style={{
                  position: 'absolute',
                  bottom: '2px',
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-brand-blue)',
                  zIndex: 3
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
