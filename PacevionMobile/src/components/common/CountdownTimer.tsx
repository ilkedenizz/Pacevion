import React, { useState, useEffect } from 'react';

export interface CountdownTimerProps {
  targetDate: string; // ISO string or parsable date string
  className?: string;
}

export const CountdownTimer = React.memo(({ targetDate, className }: CountdownTimerProps) => {
  const [countdown, setCountdown] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true
  });

  useEffect(() => {
    if (!targetDate) return;
    const target = new Date(targetDate).getTime();
    
    const calculateTime = () => {
      const difference = target - Date.now();
      if (difference <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true });
        return;
      }
      setCountdown({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        isPassed: false
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (countdown.isPassed) return null;

  return (
    <div className={className || "rd-countdown"}>
      <span className="rd-cd-item font-mono">{String(countdown.days).padStart(2, '0')}D</span>
      <span className="rd-cd-item font-mono">{String(countdown.hours).padStart(2, '0')}H</span>
      <span className="rd-cd-item font-mono">{String(countdown.minutes).padStart(2, '0')}M</span>
      <span className="rd-cd-item font-mono">{String(countdown.seconds).padStart(2, '0')}S</span>
    </div>
  );
});
