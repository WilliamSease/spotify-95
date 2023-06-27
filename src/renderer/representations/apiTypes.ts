export type TokenInfo = {
  token: string;
  type: string;
  expiresIn: number;
  expirationTime: number;
};

export type SearchResultType = {
  artists: SpotifyApi.ArtistObjectFull[];
  albums: SpotifyApi.AlbumObjectFull[];
  tracks: SpotifyApi.TrackObjectFull[];
  shows: SpotifyApi.ShowObjectFull[];
  episodes: SpotifyApi.EpisodeObjectFull[];
  playlists: SpotifyApi.PlaylistObjectFull[];
};

export type Playable =
  | SpotifyApi.TrackObjectFull
  | SpotifyApi.EpisodeObjectFull;

export type LibraryType = {
  artists: SpotifyApi.ArtistObjectFull[];
  albums: SpotifyApi.AlbumObjectFull[];
  shows: SpotifyApi.ShowObjectSimplified[];
  playlists: SpotifyApi.PlaylistObjectSimplified[];
};

export type AddDialogType = {
  type: 'topSongs' | 'album' | 'playlist' | 'showEpisodes';
  label: 'string';
  id: 'string';
};
