"use client";

import { useState, useEffect } from "react";
import { useCalendar } from "@/hooks/useCalendar";
import CalendarHero from "./CalendarHero";
import NotesSection from "./NotesSection";
import CalendarGrid from "./CalendarGrid";
import { motion, AnimatePresence } from "framer-motion";

export default function CalendarWall() {
  const {
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
  } = useCalendar(new Date(2022, 0, 1)); 

  const [mobileScale, setMobileScale] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 860) {
        setMobileScale((window.innerWidth - 80) / 860);
      } else {
        setMobileScale(1);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const pageVariants = {
    initial: (direction: number) => ({
      rotateX: direction > 0 ? 0 : -180,
      zIndex: direction > 0 ? 1 : 10,
      filter: direction > 0 ? 'brightness(0.6)' : 'brightness(1)',
      opacity: direction > 0 ? 1 : 0,
    }),
    in: {
      rotateX: 0,
      zIndex: 5,
      filter: 'brightness(1)',
      opacity: 1, 
    },
    out: (direction: number) => ({
      rotateX: direction > 0 ? -180 : 0, 
      zIndex: direction > 0 ? 10 : 1,
      filter: direction > 0 ? 'brightness(1)' : 'brightness(0.6)',
      opacity: direction > 0 ? 0 : 1, 
    })
  };

  return (
    <div style={{
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      overflow: 'hidden',
      paddingTop: '100px',
      ...(mobileScale !== null ? { 
         paddingBottom: mobileScale < 1 ? `calc(-750px * ${1 - mobileScale})` : '60px' 
      } : {})
    }}>
      <div 
        className="wall-shadow calendar-wall-outer mobile-ssr-fallback"
        style={{
          width: '860px',
          minWidth: '860px',
          transformOrigin: 'top center',
          margin: 0,
          borderRadius: '12px',
          ...(mobileScale !== null ? { 
             transform: mobileScale < 1 ? `scale(${mobileScale})` : 'none' 
          } : {})
        }}
      >
      <div className="hook-wrapper" style={{
        position: 'absolute',
        left: '50%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 5
      }}>

        <div style={{
          position: 'absolute',
          top: '-5px',
          width: '14px',
          height: '14px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, #555, #000)',
          boxShadow: '1px 3px 5px rgba(0,0,0,0.6)',
          zIndex: 20
        }} />
    
        <div style={{
          width: '60px',
          height: '50px',
          border: '5px solid #222',
          borderRadius: '50% 50% 0 0',
          borderBottom: 'none',
          boxShadow: 'inset 0 3px 4px rgba(255,255,255,0.2), 0 4px 8px rgba(0,0,0,0.3)',
          position: 'relative'
        }}>
      
          <div style={{ position: 'absolute', bottom: '-15px', left: '-5px', width: '5px', height: '15px', background: 'linear-gradient(to right, #111, #444, #111)', boxShadow: '2px 0 3px rgba(0,0,0,0.1)' }} />
          <div style={{ position: 'absolute', bottom: '-15px', right: '-5px', width: '5px', height: '15px', background: 'linear-gradient(to left, #111, #444, #111)', boxShadow: '-2px 0 3px rgba(0,0,0,0.1)' }} />
        </div>
      </div>

      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '20px', display: 'flex', justifyContent: 'space-evenly', zIndex: 10 }}>
         {Array.from({length: 18}).map((_, i) => (
           <div key={i} style={{ position: 'relative' }} className={i % 2 !== 0 ? 'mobile-hide-ring' : ''}>
             <div className="calendar-ring-hole" style={{ left: '-7px' }} />
             <div className="calendar-ring" style={{ left: '-5px' }} />
           </div>
         ))}
      </div>

      <div style={{ perspective: '3000px', flex: 1, zIndex: 2, display: 'grid', gridTemplateAreas: '"overlap"' }}>
        <AnimatePresence custom={direction} initial={false}>
          <motion.div
            key={currentMonth.getTime()}
            custom={direction}
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={{
              type: "spring",
              stiffness: 60,
              damping: 18,
              mass: 1.2
            }}
            style={{ 
              gridArea: 'overlap',
              transformOrigin: 'top center',
              backgroundColor: 'white',
              borderRadius: '8px 8px 0 0',
              boxShadow: '0 40px 60px rgba(0,0,0,0.15)',
            }}
          >
       
            <CalendarHero currentMonth={currentMonth} />

            <div className="calendar-wall-inner">
              <div className="notes-container">
                <NotesSection 
                  currentMonth={currentMonth} 
                  selectedRange={selectedRange} 
                  onSelectNoteRange={setSelectedRange} 
                />
              </div>
              
              <div className="grid-container">
                <CalendarGrid 
                  daysInMonth={daysInMonth}
                  selectedRange={selectedRange}
                  hoverDate={hoverDate}
                  onDateClick={onDateClick}
                  onDateHover={onDateHover}
                />
              </div>
            </div>

            <div className="nav-buttons" style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-faded)', paddingBottom: '30px', zIndex: 15, position: 'relative' }}>
              <button 
                onClick={(e) => { e.stopPropagation(); prevMonth(); }} 
                style={{ cursor: 'pointer', background: 'none', border: 'none', fontSize: '1rem', fontWeight: 500, color: 'var(--color-brand-blue)', transition: 'color 0.2s', padding: '10px 20px', backgroundColor: 'rgba(29, 161, 242, 0.05)', borderRadius: '8px' }}
              >
                ← Previous
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); nextMonth(); }} 
                style={{ cursor: 'pointer', background: 'none', border: 'none', fontSize: '1rem', fontWeight: 500, color: 'var(--color-brand-blue)', transition: 'color 0.2s', padding: '10px 20px', backgroundColor: 'rgba(29, 161, 242, 0.05)', borderRadius: '8px' }}
              >
                Next →
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
    </div>
  );
}
