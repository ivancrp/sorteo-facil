
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedNumberProps {
  value: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animationDelay?: number;
}

const AnimatedNumber = ({ 
  value, 
  className, 
  size = 'md',
  animationDelay = 0 
}: AnimatedNumberProps) => {
  const [displayValue, setDisplayValue] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const sizeClasses = {
    sm: 'text-4xl',
    md: 'text-6xl',
    lg: 'text-8xl',
    xl: 'text-9xl',
  };
  
  useEffect(() => {
    if (displayValue !== value) {
      // Start with null to show animation
      setDisplayValue(null);
      setIsAnimating(true);
      
      // After a small delay, show the new value
      const timer = setTimeout(() => {
        setDisplayValue(value);
        
        // Reset animation state after animation completes
        const animationTimer = setTimeout(() => {
          setIsAnimating(false);
        }, 600); // Animation duration
        
        return () => clearTimeout(animationTimer);
      }, animationDelay);
      
      return () => clearTimeout(timer);
    }
  }, [value, animationDelay]);

  return (
    <div 
      className={cn(
        "relative overflow-hidden font-bold text-center tabular-nums",
        sizeClasses[size],
        isAnimating ? "animate-number-shuffle" : "",
        className
      )}
      style={{ 
        transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      {displayValue !== null ? displayValue : ''}
    </div>
  );
};

export default AnimatedNumber;
