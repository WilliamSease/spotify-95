export function formatMs(totalMilliseconds: number): string {
  const totalSeconds = Math.floor(totalMilliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes < 1) {
    return `:${seconds.toString().padStart(2, '0')}`;
  } else if (minutes < 10) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

export function formatArtists(artists: SpotifyApi.ArtistObjectSimplified[]) {
  return artists.map((a) => a.name).join(', ');
}
