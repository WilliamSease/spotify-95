import { createSlice, createSelector, configureStore } from '@reduxjs/toolkit';
import original from 'react95/dist/themes/original';
import { Theme } from 'react95/dist/types';
import {
  AddDialogType,
  LibraryType,
  Playable,
  SearchResultType,
} from 'renderer/representations/apiTypes';
import SpotifyWebApi from 'spotify-web-api-js';

interface appState {
  theme: Theme;
  searchTerm: '';
  spotify: SpotifyWebApi.SpotifyWebApiJs;
  artURL?: string;
  searchResult: SearchResultType;
  library?: LibraryType | null;
  addToDialog?: AddDialogType;
  tracksInPlayer: Playable[];
  currentDevice?: string;
  nowPlaying?: { index: number; current: Playable };
  playerView: 'individual' | 'group';
  showAlbumArt: boolean;
}

const initialState: appState = {
  theme: original,
  searchTerm: '',
  spotify: new SpotifyWebApi(),
  searchResult: {
    artists: [],
    albums: [],
    tracks: [],
    shows: [],
    episodes: [],
    playlists: [],
  },
  tracksInPlayer: [],
  playerView: 'individual',
  showAlbumArt: true,
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
      state.tracksInPlayer = action.payload;
    },
    appendToPlayer: (state, action) => {
      state.tracksInPlayer.push(...action.payload);
    },
    togglePlayerView: (state) => {
      state.playerView =
        state.playerView === 'individual' ? 'group' : 'individual';
    },
    setCurrentDevice: (state, action) => {
      state.currentDevice = action.payload;
    },
    setNowPlaying: (state, action) => {
      state.nowPlaying = action.payload;
    },
    toggleShowAlbumArt: (state) => {
      state.showAlbumArt = !state.showAlbumArt;
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
  togglePlayerView,
  setCurrentDevice,
  setNowPlaying,
  toggleShowAlbumArt,
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

export const selectTracksInPlayer = createSelector(
  (state: appState) => state.tracksInPlayer,
  (tracksInPlayer) => tracksInPlayer
);

export const selectPlayerView = createSelector(
  (state: appState) => state.playerView,
  (playerView) => playerView
);

export const selectNowPlaying = createSelector(
  (state: appState) => state.nowPlaying,
  (nowPlaying) => nowPlaying
);

export const selectShowAlbumArt = createSelector(
  (state: appState) => state.showAlbumArt,
  (showAlbumArt) => showAlbumArt
);

export const selectCurrentDevice = createSelector(
  (state: appState) => state.currentDevice,
  (currentDevice) => currentDevice
);

const store = configureStore({
  reducer: appSlice.reducer,
});

export default store;
