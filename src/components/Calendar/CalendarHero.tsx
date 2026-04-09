"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

type CalendarHeroProps = {
  currentMonth: Date;
};

const mulberry32 = (a: number) => {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

export default function CalendarHero({ currentMonth }: CalendarHeroProps) {
  const monthName = currentMonth.toLocaleString("default", { month: "long" }).toUpperCase();
  const yearName = currentMonth.getFullYear();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 100, damping: 25 });
  const mouseY = useSpring(y, { stiffness: 100, damping: 25 });

  const rotateX = useTransform(mouseY, [-230, 230], [25, -25]);
  const rotateY = useTransform(mouseX, [-450, 450], [-25, 25]);

  const glareX = useTransform(mouseX, [-450, 450], [-50, 150]);
  const glareY = useTransform(mouseY, [-230, 230], [-50, 150]);
  const glareOpacity = useTransform(mouseX, [-450, 450], [0.1, 0.4]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  const rand = mulberry32(12345);
  const snowflakes = Array.from({ length: 45 }).map((_, i) => ({
    id: i,
    left: `${rand() * 100}%`,
    duration: 5 + rand() * 8, 
    delay: - (rand() * 15), 
    size: 2 + rand() * 4,
    opacity: 0.2 + rand() * 0.7
  }));

  return (
    <div 
      className="hero-wrapper"
      style={{ 
        position: "relative", width: "100%", backgroundColor: "#fff", 
        borderRadius: '8px 8px 0 0', overflow: "hidden", perspective: "1500px" 
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      

      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        background: 'linear-gradient(135deg, #0c4eb5 0%, var(--color-brand-blue) 100%)',
        zIndex: 1
      }} />

      <div style={{
        position: 'absolute', bottom: '-50px', left: '10%', width: '300px', height: '300px',
        background: 'rgba(255,255,255,0.05)', borderRadius: '50%', zIndex: 1
      }} />

      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        clipPath: 'polygon(0 0, 100% 0, 100% 85%, 35% 100%, 0 70%)',
        zIndex: 2,
      }}>
        <Image
          src="/hero-image.png"
          alt="Ice Climber on Glacier"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
          priority
        />
        
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%)'
        }} />

        {isMounted && snowflakes.map(flake => (
          <motion.div
            key={flake.id}
            initial={{ y: -50, x: 0 }}
            animate={{ 
              y: 500, 
              x: Math.sin(flake.id) * 30 
            }} 
            transition={{
              y: {
                duration: flake.duration,
                repeat: Infinity,
                ease: "linear",
                delay: flake.delay
              },
              x: {
                duration: flake.duration * 0.7,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: flake.left,
              width: flake.size,
              height: flake.size,
              backgroundColor: 'white',
              borderRadius: '50%',
              opacity: flake.opacity,
              filter: `blur(${flake.size > 4 ? 2 : 0}px)`,
              pointerEvents: 'none'
            }}
          />
        ))}

      </div>

      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '40px',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)',
        zIndex: 3,
        pointerEvents: 'none'
      }} />


      <motion.div 
        className="glass-badge"
        style={{
          position: 'absolute',
          zIndex: 10,
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(16px)',
          borderRadius: '4px 24px 4px 24px', 
          boxShadow: '0 30px 60px -15px rgba(0,0,0,0.6)',
          border: '1px solid rgba(255,255,255,0.6)',
          borderLeft: '8px solid var(--color-brand-blue)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          transformStyle: "preserve-3d",
          rotateX,
          rotateY,
        }}
        initial={{ y: 50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div 
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            borderRadius: 'inherit',
            background: 'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 60%)',
            pointerEvents: 'none',
            x: glareX,
            y: glareY,
            opacity: glareOpacity,
            mixBlendMode: 'overlay'
          }}
        />

        <motion.span style={{ 
          fontSize: 'clamp(1.2rem, 3vw, 1.4rem)', 
          fontWeight: 700, 
          color: 'var(--color-text-faded)', 
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginBottom: '2px',
          z: 20 
        }}>
          {yearName}
        </motion.span>
        <motion.span style={{ 
          fontSize: 'clamp(2.5rem, 6vw, 4rem)', 
          fontWeight: 900, 
          color: 'var(--color-brand-dark)', 
          letterSpacing: '-0.03em', 
          lineHeight: '1',
          textShadow: '0 4px 10px rgba(0,0,0,0.1)',
          z: 40
        }}>
          {monthName}
        </motion.span>
      </motion.div>

    </div>
  );
}