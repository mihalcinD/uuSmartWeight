import { createTheme, responsiveFontSizes, ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ApiProvider } from './ApiContext.tsx';
import { JSX } from 'react';
import { SnackbarProvider } from 'notistack';

type Props = {
  children: JSX.Element;
};

const ContextsContainer = ({ children }: Props) => {
  let theme = createTheme({
    palette: {
      mode: 'dark',
    },
  });
  theme = responsiveFontSizes(theme);
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <ApiProvider>
          <CssBaseline />
          {children}
        </ApiProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default ContextsContainer;
