import React, { useState, useEffect } from 'react';

export const HomeCountdown = React.memo(({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0, passed: false });

  useEffect(() => {
    if (!targetDate) return;
    const target = new Date(targetDate).getTime();
    
    const calc = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0, passed: true });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((diff % (1000 * 60)) / 1000),
        passed: false
      });
    };

    calc();
    const timer = setInterval(calc, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.passed) {
    return (
      <div className="hero-countdown live-mode">
        <div className="status-dot pulse" style={{ marginRight: '8px' }} />
        <span className="editorial-label" style={{ color: '#00C864', fontSize: '13px', letterSpacing: '0.12em', fontWeight: 800 }}>SESSION LIVE</span>
      </div>
    );
  }

  return (
    <div className="hero-countdown">
      <div className="cd-box">
        <span className="cd-num font-mono editorial-num">{String(timeLeft.days).padStart(2, '0')}</span>
        <span className="cd-lbl editorial-label">DAYS</span>
      </div>
      <div className="cd-sep">:</div>
      <div className="cd-box">
        <span className="cd-num font-mono editorial-num">{String(timeLeft.hours).padStart(2, '0')}</span>
        <span className="cd-lbl editorial-label">HRS</span>
      </div>
      <div className="cd-sep">:</div>
      <div className="cd-box">
        <span className="cd-num font-mono editorial-num">{String(timeLeft.mins).padStart(2, '0')}</span>
        <span className="cd-lbl editorial-label">MIN</span>
      </div>
      <div className="cd-sep">:</div>
      <div className="cd-box">
        <span className="cd-num font-mono editorial-num">{String(timeLeft.secs).padStart(2, '0')}</span>
        <span className="cd-lbl editorial-label">SEC</span>
      </div>
    </div>
  );
});

