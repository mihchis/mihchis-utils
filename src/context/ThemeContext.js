import React, { createContext, useState, useEffect } from 'react';

// Tạo context
export const ThemeContext = createContext();

// Tạo provider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');

  // Kiểm tra và tải theme đã lưu khi component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Cập nhật localStorage khi theme thay đổi
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.className = theme === 'light' ? 'light-theme' : '';
  }, [theme]);

  // Toggle theme giữa light và dark
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}; 