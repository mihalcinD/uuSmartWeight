import CssBaseline from '@mui/material/CssBaseline';
import { ApiProvider } from './ApiContext.tsx';
import { JSX } from 'react';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';
import { store } from '../store/store.ts';
import ThemeProvider from './ThemeProvider.tsx';
type Props = {
  children: JSX.Element;
};

const ProvidersContainer = ({ children }: Props) => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <SnackbarProvider>
          <ApiProvider>
            <CssBaseline />
            {children}
          </ApiProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default ProvidersContainer;
