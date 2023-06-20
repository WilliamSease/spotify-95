import { createSlice, createSelector, configureStore } from '@reduxjs/toolkit';
import original from 'react95/dist/themes/original';
import { Theme } from 'react95/dist/types';
import {
  AddDialogType,
  LibraryType,
  SearchResultType,
} from 'renderer/representations/apiTypes';
import SpotifyWebApi from 'spotify-web-api-js';

interface appState {
  theme: Theme;
  searchTerm: '';
  spotify: SpotifyWebApi.SpotifyWebApiJs;
  artURL?: string;
  searchResult?: SearchResultType | null;
  library?: LibraryType | null;
  addToDialog?: AddDialogType;
}

const initialState: appState = {
  theme: original,
  searchTerm: '',
  spotify: new SpotifyWebApi(),
};

const appSlice = createSlice({
  name: 'appSlice',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setArtURL: (state, action) => {
      state.artURL = action.payload;
    },
    setSearchResult: (state, action) => {
      state.searchResult = action.payload;
    },
    setLibrary: (state, action) => {
      state.library = action.payload;
      console.log('LIBRARY:');
      console.log(state.library);
    },
    setAddDialog: (state, action) => {
      state.addToDialog = action.payload;
    },
  },
});

export const {
  setTheme,
  setSearchTerm,
  setArtURL,
  setSearchResult,
  setLibrary,
  setAddDialog,
} = appSlice.actions;

export const selectTheme = createSelector(
  (state: appState) => state.theme,
  (theme) => theme
);

export const selectSearchTerm = createSelector(
  (state: appState) => state.searchTerm,
  (searchTerm) => searchTerm
);

export const selectSpotify = createSelector(
  (state: appState) => state.spotify,
  (spotify) => spotify
);

export const selectArtURL = createSelector(
  (state: appState) => state.artURL,
  (artURL) => artURL
);

export const selectSearchResult = createSelector(
  (state: appState) => state.searchResult,
  (searchResult) => searchResult
);

export const selectLibrary = createSelector(
  (state: appState) => state.library,
  (library) => library
);

export const addToDialog = createSelector(
  (state: appState) => state.addToDialog,
  (addToDialog) => addToDialog
);

const store = configureStore({
  reducer: appSlice.reducer,
});

export default store;
