import { createSlice, createSelector, configureStore } from '@reduxjs/toolkit';
import original from 'react95/dist/themes/original';
import { Theme } from 'react95/dist/types';
import {
  AddDialogType,
  LibraryType,
  PlayerType,
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
  player: PlayerType;
}

const initialState: appState = {
  theme: original,
  searchTerm: '',
  spotify: new SpotifyWebApi(),
  player: {
    playingItems: [],
  },
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
    },
    setAddDialog: (state, action) => {
      state.addToDialog = action.payload;
    },
    setToPlayer: (state, action) => {
      state.player.playingItems = action.payload;
    },
    appendToPlayer: (state, action) => {
      state.player.playingItems.push(...action.payload);
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
  setToPlayer,
  appendToPlayer,
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

export const selectAddToDialog = createSelector(
  (state: appState) => state.addToDialog,
  (addToDialog) => addToDialog
);

export const selectPlayer = createSelector(
  (state: appState) => state.player,
  (player) => player
);

const store = configureStore({
  reducer: appSlice.reducer,
});

export default store;
