import SpotifyWebApi from 'spotify-web-api-js';
import { LibraryType, SearchResultType } from '../representations/apiTypes';
import axios from 'axios';
import { cloneDeep } from 'lodash';

export const triggerLogin = () => {
  const clientId = '2d8d7d7d0f6241fcb7cf54fc5b2e24a8';
  const redirectUri = 'spotify-95://gotToken';
  const scopes = [
    'ugc-image-upload',
    'user-read-playback-state',
    'user-modify-playback-state',
    'app-remote-control',
    'streaming',
    'playlist-read-private',
    'playlist-read-collaborative',
    'playlist-modify-private',
    'playlist-modify-public',
    'user-follow-modify',
    'user-follow-read',
    'user-read-playback-position',
    'user-top-read',
    'user-read-recently-played',
    'user-library-modify',
    'user-library-read',
    'user-read-email',
    'user-read-private',
  ];

  const authorizationUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
    '%20'
  )}&response_type=token`;

  // Redirect the user to the authorization URL

  window.electron.ipcRenderer.sendMessage('logintospotify', [authorizationUrl]);
};

export async function populateLibrary(spotify: SpotifyWebApi.SpotifyWebApiJs) {
  const out: LibraryType = {
    artists: [],
    albums: [],
    shows: [],
    playlists: [],
  };

  let nextArtists = await spotify.getFollowedArtists();
  out.artists.push(...nextArtists.artists.items);
  while (nextArtists.artists.next) {
    nextArtists = await spotify.getFollowedArtists({
      after: new URLSearchParams(nextArtists.artists.next).get('after'),
    });
    out.artists.push(...nextArtists.artists.items);
  }
  let nextAlbums = await spotify.getMySavedAlbums();
  out.albums.push(...nextAlbums.items.map((a) => a.album));
  while (nextAlbums.next) {
    nextAlbums = await spotify.getMySavedAlbums({
      after: new URLSearchParams(nextAlbums.next).get('after'),
    });
    out.albums.push(...nextAlbums.items.map((a) => a.album));
  }
  let nextShows = await spotify.getMySavedShows();
  out.shows.push(...nextShows.items.map((s) => s.show));
  while (nextShows.next) {
    nextShows = await spotify.getMySavedShows({
      after: new URLSearchParams(nextShows.next).get('after'),
    });
    out.shows.push(...nextShows.items.map((s) => s.show));
  }
  let playlistCount = (await spotify.getUserPlaylists()).total;
  for (let i = 0; i < playlistCount; i += 50) {
    out.playlists.push(
      ...(
        await spotify.getUserPlaylists(undefined, { offset: i, limit: i + 50 })
      ).items
    );
  }

  return {
    artists: out.artists.sort((a, b) => a.name.localeCompare(b.name)),
    albums: out.albums.sort((a, b) => a.name.localeCompare(b.name)),
    shows: out.shows.sort((a, b) => a.name.localeCompare(b.name)),
    playlists: out.playlists.sort((a, b) => a.name.localeCompare(b.name)),
  };
}

export async function appendToSearchResult(
  spotify: SpotifyWebApi.SpotifyWebApiJs,
  searchTerm: string,
  current: SearchResultType,
  type: number | 'ALL'
): Promise<SearchResultType> {
  const copy = cloneDeep(current);
  if (type === 0 || type === 'ALL') {
    const newArtists = (
      await spotify.searchArtists(searchTerm, {
        offset: copy.artists.length,
        limit: 10,
      })
    ).artists.items;
    copy.artists.push(...newArtists);
  }
  if (type === 1 || type === 'ALL') {
    const newAlbums = (
      await spotify.searchAlbums(searchTerm, {
        offset: copy.albums.length,
        limit: 10,
      })
    ).albums.items;
    copy.albums.push(
      ...(await spotify.getAlbums(newAlbums.map((na) => na.id))).albums
    );
  }
  if (type === 2 || type === 'ALL') {
    const newTracks = (
      await spotify.searchTracks(searchTerm, {
        offset: copy.tracks.length,
        limit: 10,
      })
    ).tracks.items;
    copy.tracks.push(
      ...(await spotify.getTracks(newTracks.map((na) => na.id))).tracks
    );
  }
  if (type === 3 || type === 'ALL') {
    const newShows = (
      await spotify.searchShows(searchTerm, {
        offset: copy.shows.length,
        limit: 10,
      })
    ).shows.items;
    copy.shows.push(
      ...(await spotify.getShows(newShows.map((na) => na.id))).shows
    );
  }
  if (type === 4 || type === 'ALL') {
    const newEpisodes = (
      await spotify.searchEpisodes(searchTerm, {
        offset: copy.episodes.length,
        limit: 10,
      })
    ).episodes.items;
    copy.episodes.push(
      ...(await spotify.getEpisodes(newEpisodes.map((na) => na.id))).episodes
    );
  }
  if (type === 5 || type === 'ALL') {
    const newPlaylists = (
      await spotify.searchPlaylists(searchTerm, {
        offset: copy.playlists.length,
        limit: 10,
      })
    ).playlists.items;
    for (let i = 0; i < newPlaylists.length; i++) {
      copy.playlists.push(await spotify.getPlaylist(newPlaylists[i].id));
    }
  }
  return copy;
}

export const addBearerTokenToRequest = async (
  url: string,
  spotify: SpotifyWebApi.SpotifyWebApiJs
) => {
  return (
    await axios.get(url, {
      headers: { Authorization: `Bearer ${spotify.getAccessToken()}` },
    })
  ).data;
};
