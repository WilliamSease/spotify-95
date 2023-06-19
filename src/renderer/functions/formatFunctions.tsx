export const formatAlbumToIncludeArtists = (
  album: SpotifyApi.AlbumObjectSimplified
) => {
  return `${album.name}`;
};
