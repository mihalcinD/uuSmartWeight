import { JSX } from 'react';
import { responsiveFontSizes, ThemeProvider as MuiThemeProvider } from '@mui/material';
import { useAppSelector } from '../store/hooks.ts';
import { selectMode } from '../store/themeSlice.ts';
import { darkTheme, lightTheme } from '../config.ts';

type Props = {
  children: JSX.Element | JSX.Element[];
};
export const ThemeProvider = ({ children }: Props) => {
  const themeMode = useAppSelector(selectMode);
  const theme = responsiveFontSizes(themeMode === 'light' ? lightTheme : darkTheme);

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};
