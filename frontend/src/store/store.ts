import { configureStore } from '@reduxjs/toolkit';
import { themeSlice } from './themeSlice.ts';

export const store = configureStore({
  reducer: {
    [themeSlice.reducerPath]: themeSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
