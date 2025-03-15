import React, { createContext, useContext } from "react";

const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children, value }) => (
  <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    console.warn("useTheme must be used within a ThemeProvider, returning fallback theme");
    return { isDarkMode: false, setIsDarkMode: () => {} };
  }
  return context;
};