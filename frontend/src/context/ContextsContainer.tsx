import CssBaseline from '@mui/material/CssBaseline';
import { ApiProvider } from './ApiContext.tsx';
import { JSX } from 'react';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from './ThemeContext.tsx';
import { MeProvider } from './MeContext.tsx';

type Props = {
  children: JSX.Element;
};

const ContextsContainer = ({ children }: Props) => {
  return (
    <ThemeProvider>
      <SnackbarProvider>
        <ApiProvider>
          <CssBaseline />
          <MeProvider>{children}</MeProvider>
        </ApiProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default ContextsContainer;
