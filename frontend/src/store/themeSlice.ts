import { createSlice } from '@reduxjs/toolkit';
import { RootState } from './store.ts';

type Mode = 'light' | 'dark';
type State = {
  mode: Mode;
};

const initialState: State = {
  mode:
    (localStorage.getItem('mode') as Mode) ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleMode: state => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      localStorage.setItem('mode', state.mode);
    },
  },
});
export const { toggleMode } = themeSlice.actions;
export const selectMode = (state: RootState) => state.theme.mode;

export default themeSlice;
