import { useState, useMemo } from 'react';

export type SelectedRange = {
  start: Date | null;
  end: Date | null;
};

export type CalendarDay = {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
};

export function useCalendar(initialDate: Date = new Date()) {
  const [currentMonth, setCurrentMonth] = useState(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
  const [selectedRange, setSelectedRange] = useState<SelectedRange>({ start: null, end: null });
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [direction, setDirection] = useState(0);

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
  
    const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    
    const prevMonthDays = new Date(year, month, 0).getDate();
    
    const days: CalendarDay[] = [];
    
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false,
        isToday: false,
      });
    }
    
    const today = new Date();
    
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
      });
    }

    const totalDays = days.length;
    let nextMonthDay = 1;
    while (days.length < 42) {
      days.push({
        date: new Date(year, month + 1, nextMonthDay++),
        isCurrentMonth: false,
        isToday: false,
      });
    }
    
    return days;
  }, [currentMonth]);

  const onDateClick = (date: Date) => {
    if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
      setSelectedRange({ start: date, end: null });
    } else {
      if (date < selectedRange.start) {
        setSelectedRange({ start: date, end: selectedRange.start });
      } else {
        setSelectedRange({ start: selectedRange.start, end: date });
      }
    }
  };
  
  const onDateHover = (date: Date) => {
    if (selectedRange.start && !selectedRange.end) {
      setHoverDate(date);
    } else {
      setHoverDate(null);
    }
  };

  const nextMonth = () => {
    setDirection(1);
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  const prevMonth = () => {
    setDirection(-1);
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  return {
    currentMonth,
    daysInMonth,
    selectedRange,
    setSelectedRange,
    hoverDate,
    direction,
    onDateClick,
    onDateHover,
    nextMonth,
    prevMonth,
  };
}
