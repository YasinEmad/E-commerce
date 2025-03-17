import { createContext, useState, useMemo, useEffect } from "react";
import { createTheme } from "@mui/material/styles";

// Color Tokens for Theme
const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      main: mode === "light" ? "#1976D2" : "#90CAF9",
    },
    secondary: {
      main: "#FF4081",
    },
    text: {
      primary: mode === "light" ? "#000000" : "#FFFFFF", // Black in light mode, White in dark mode
      secondary: mode === "light" ? "#333333" : "#CCCCCC",
    },
    background: {
      default: mode === "light" ? "#FFFFFF" : "#000000", // White in light mode, Black in dark mode
      paper: mode === "light" ? "#F5F5F5" : "#121212",
    },
    appBar: {
      main: mode === "light" ? "#FFFFFF" : "#000000",
    },
  },
  shape: {
    borderRadius: 8,
  },
});

// Color Mode Context
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const storedMode = localStorage.getItem("mode") || "light"; // Default to light mode
  const [mode, setMode] = useState(storedMode);

  useEffect(() => {
    localStorage.setItem("mode", mode);
  }, [mode]);

  const colorMode = useMemo(() => ({
    toggleColorMode: () => setMode((prevMode) => (prevMode === "light" ? "dark" : "light")),
  }), []);

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return [theme, colorMode];
};
