export type TokenInfo = {
  token: string;
  type: string;
  expiresIn: number;
  expirationTime: number;
};

export type SearchResultType = {
  artists: SpotifyApi.ArtistObjectFull[];
  albums: SpotifyApi.AlbumObjectSimplified[];
  tracks: SpotifyApi.TrackObjectSimplified[];
  shows: SpotifyApi.ShowObjectSimplified[];
  episodes: SpotifyApi.EpisodeObjectSimplified[];
  playlists: SpotifyApi.PlaylistObjectSimplified[];
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
