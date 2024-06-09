import { createTheme } from '@mui/material';
import { deepOrange, indigo } from '@mui/material/colors';

export const config = {
  domain: 'https://server.com/',
};

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: deepOrange,
    secondary: indigo,
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: deepOrange,
    secondary: indigo,
  },
});
