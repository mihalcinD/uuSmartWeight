import { createSlice } from '@reduxjs/toolkit';
import { RootState } from './store.ts';
import { MeResponse } from '../types/api/response/me.ts';

type State = {
  me: MeResponse | undefined;
};

const initialState: State = {
  me: {
    id: 1,
    name: 'David',
    email: 'david@unicorn.com',
    surname: 'Mihalcin',
  },
};

export const meSlice = createSlice({
  name: 'me',
  initialState,
  reducers: {},
});
export const selectMe = (state: RootState) => state.me.me;

export default meSlice;
