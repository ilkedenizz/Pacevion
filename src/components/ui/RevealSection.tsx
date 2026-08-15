import React from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface RevealSectionProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const RevealSection: React.FC<RevealSectionProps> = ({ children, className = '', style }) => {
  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>({ triggerOnce: true, threshold: 0.05 });
  
  return (
    <div 
      ref={ref} 
      className={`reveal-on-scroll ${isVisible ? 'is-visible' : ''} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default RevealSection;
