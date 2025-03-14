import React, { createContext, useContext, useState, useEffect } from 'react';

// Define available themes
export const themes = {
  light: {
    name: 'light',
    background: {
      start: '#f8fafc',
      end: '#e2e8f0'
    },
    text: '#1e293b',
    glass: {
      bg: 'rgba(255, 255, 255, 0.7)',
      border: 'rgba(148, 163, 184, 0.2)'
    },
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      largeText: false
    }
  },
  dark: {
    name: 'dark',
    background: {
      start: '#18122B',
      end: '#282044'
    },
    text: '#e0e0e0',
    glass: {
      bg: 'rgba(17, 25, 40, 0.75)',
      border: 'rgba(255, 255, 255, 0.125)'
    },
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      largeText: false
    }
  },
  highContrast: {
    name: 'highContrast',
    background: {
      start: '#000000',
      end: '#000000'
    },
    text: '#ffffff',
    glass: {
      bg: 'rgba(0, 0, 0, 0.9)',
      border: 'rgba(255, 255, 255, 0.5)'
    },
    accessibility: {
      highContrast: true,
      reducedMotion: true,
      largeText: true
    }
  }
};

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // Check for user preference in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Check for system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 