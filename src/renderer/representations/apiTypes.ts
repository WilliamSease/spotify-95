export type TokenInfo = {
  token: string;
  type: string;
  expiresIn: number;
  expirationTime: number;
};

export type SearchResultType = {
  music: SpotifyApi.SearchResponse;
  shows: SpotifyApi.ShowSearchResponse;
  episodes: SpotifyApi.EpisodeSearchResponse;
};

export type LibraryType = {
  artists: SpotifyApi.ArtistObjectFull[];
  albums: SpotifyApi.AlbumObjectFull[];
  shows: SpotifyApi.ShowObjectSimplified[];
  playlists: SpotifyApi.PlaylistObjectSimplified[];
};

export type AddDialogType = {
  type:
    | 'topSongs'
    | 'album'
    | 'playlist'
    | 'showEpisodes';
  label: 'string';
  id: 'string';
};
