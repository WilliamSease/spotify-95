import { createSlice, createSelector, configureStore } from '@reduxjs/toolkit';
import original from 'react95/dist/themes/original';
import { Theme } from 'react95/dist/types';

interface appState {
  theme: Theme;
}

const initialState: appState = {
  theme: original,
};

const appSlice = createSlice({
  name: 'appSlice',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const { setTheme } = appSlice.actions;

export const selectTheme = createSelector(
  (state: appState) => {
    return state.theme;
  },
  (theme) => theme
);

const store = configureStore({
  reducer: appSlice.reducer,
});

export default store;
