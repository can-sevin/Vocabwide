import React, { createContext, useState, useContext } from "react";
import { themes } from "../assets/themes";

// Context oluşturma
const ThemeContext = createContext();

// ThemeProvider bileşeni
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(themes.dark);

  // Tema değiştirme fonksiyonu
  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === themes.light ? themes.dark : themes.light;
      return newTheme;
    });
  };

  // Sağlanan değerler
  const value = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// Tema hook'u
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
