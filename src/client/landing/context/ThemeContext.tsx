import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
  isDark: true,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Mặc định ép dùng giao diện tối (Dark Mode) theo yêu cầu của người dùng
  const theme: Theme = 'dark';
  const toggleTheme = () => {
    console.log("Tính năng chuyển đổi giao diện đã bị vô hiệu hóa. Mặc định là Dark Mode.");
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', 'dark');
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: true }}>
      {children}
    </ThemeContext.Provider>
  );
};
