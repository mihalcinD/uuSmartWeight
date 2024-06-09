import { configureStore } from '@reduxjs/toolkit';
import themeSlice from './themeSlice.ts';
import meSlice from './meSlice.ts';

export const store = configureStore({
  reducer: {
    [themeSlice.reducerPath]: themeSlice.reducer,
    [meSlice.reducerPath]: meSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
