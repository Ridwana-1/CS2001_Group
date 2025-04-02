import React, { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '', 
  showLabel = true
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const toggleRef = useRef<HTMLDivElement>(null);
  
  // Эффекты для анимации при изменении темы
  useEffect(() => {
    if (toggleRef.current) {
      toggleRef.current.classList.add('theme-toggle-animate');
      const timer = setTimeout(() => {
        if (toggleRef.current) {
          toggleRef.current.classList.remove('theme-toggle-animate');
        }
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [theme]);
  
  return (
    <div
      ref={toggleRef}
      onClick={toggleTheme}
      className={`flex items-center gap-2 cursor-pointer ${className}`}
    >
      {isDark ? (
        <FaSun className="transition-transform duration-500" />
      ) : (
        <FaMoon className="transition-transform duration-500" />
      )}
      {showLabel && <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
    </div>
  );
};

export default ThemeToggle; 