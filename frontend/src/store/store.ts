import { configureStore } from '@reduxjs/toolkit';
import themeSlice from './themeSlice.ts';
import meSlice from './meSlice.ts';
import { apiSlice } from './apiSlice.ts';

export const store = configureStore({
  reducer: {
    [themeSlice.reducerPath]: themeSlice.reducer,
    [meSlice.reducerPath]: meSlice.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
