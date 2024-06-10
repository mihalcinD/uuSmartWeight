import CssBaseline from '@mui/material/CssBaseline';
import { JSX } from 'react';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';
import { store } from '../store/store.ts';
import ThemeProvider from './ThemeProvider.tsx';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
type Props = {
  children: JSX.Element;
};

const ProvidersContainer = ({ children }: Props) => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <SnackbarProvider>
            <CssBaseline />
            {children}
          </SnackbarProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default ProvidersContainer;
