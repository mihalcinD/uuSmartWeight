import { createContext, useContext, useEffect, useMemo, JSX, useState } from 'react';

import { createTheme, responsiveFontSizes, ThemeProvider as MuiThemeProvider, useMediaQuery } from '@mui/material';
import { deepOrange, indigo } from '@mui/material/colors';

type Props = {
  children: JSX.Element | JSX.Element[];
};

type ThemeContextType = {
  mode: 'light' | 'dark';
  toggleMode: () => void;
};

export const useThemeContext = () => {
  return useContext(ThemeContext);
};

export const ThemeContext = createContext<ThemeContextType>(undefined!);

export const ThemeProvider = ({ children }: Props) => {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  let theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode,
          primary: deepOrange,
          secondary: indigo,
        },
      }),
    [mode],
  );
  theme = responsiveFontSizes(theme);

  useEffect(() => {
    const mode = localStorage.getItem('mode');
    if (mode) {
      setMode(mode as 'light' | 'dark');
    } else {
      setMode(prefersDarkMode ? 'dark' : 'light');
    }
  }, [prefersDarkMode]);
  const toggleMode = () => {
    const _mode = mode === 'light' ? 'dark' : 'light';
    setMode(_mode);
    localStorage.setItem('mode', _mode);
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
