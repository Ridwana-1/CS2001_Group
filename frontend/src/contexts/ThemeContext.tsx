/**
 * Theme Context
 * @author Sultan Jurabekov
 * @functionality Theme context provider that handles:
 * - Dark/light mode switching
 * - Theme persistence across sessions
 * - Theme-aware styling
 * - System theme detection
 * - Theme change animations
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  systemTheme: Theme | null;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Определение системной темы
  const getSystemTheme = (): Theme => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' 
      : 'light';
  };
  
  const [systemTheme, setSystemTheme] = useState<Theme>(getSystemTheme());
  
  const [theme, setTheme] = useState<Theme>(() => {
    // Приоритет: сохраненная тема -> системная тема
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme as Theme;
    }
    return getSystemTheme();
  });

  // Отслеживание изменений системной темы
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      const newSystemTheme = e.matches ? 'dark' : 'light';
      setSystemTheme(newSystemTheme);
      
      // Если нет явно сохраненной темы, используем системную
      if (!localStorage.getItem('theme')) {
        setTheme(newSystemTheme);
      }
    };
    
    // Добавляем обработчик изменения системной темы
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Фолбэк для старых браузеров
      mediaQuery.addListener(handleChange);
    }
    
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  // Применяем тему при её изменении
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Сохраняем выбор пользователя (если это не системная тема автоматически)
    if (theme !== systemTheme || localStorage.getItem('theme')) {
      localStorage.setItem('theme', theme);
    }
  }, [theme, systemTheme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, systemTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 