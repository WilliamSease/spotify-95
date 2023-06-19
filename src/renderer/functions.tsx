import SpotifyWebApi from 'spotify-web-api-js';
import { LibraryType, SearchResultType } from './representations/apiTypes';
import axios from 'axios';
import { cloneDeep, isNil } from 'lodash';

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
  current: SearchResultType,
  type: number
): Promise<SearchResultType> {
  const copy = cloneDeep(current);
  if (!isNil(copy.music.artists) && type === 0) {
    const newArtists: SpotifyApi.SearchResponse = (
      await axios.get(current.music.artists?.next ?? '', {
        headers: { Authorization: `Bearer ${spotify.getAccessToken()}` },
      })
    ).data;
    copy.music.artists?.items.push(...(newArtists.artists?.items ?? []));
    copy.music.artists.next = newArtists.artists?.next ?? '';
  }
  if (!isNil(copy.music.albums) && type === 1) {
    const newArtists: SpotifyApi.SearchResponse = (
      await axios.get(current.music.albums?.next ?? '', {
        headers: { Authorization: `Bearer ${spotify.getAccessToken()}` },
      })
    ).data;
    copy.music.albums?.items.push(...(newArtists.albums?.items ?? []));
    copy.music.albums.next = newArtists.albums?.next ?? '';
  }
  if (!isNil(copy.music.tracks) && type === 2) {
    const newArtists: SpotifyApi.SearchResponse = (
      await axios.get(current.music.tracks?.next ?? '', {
        headers: { Authorization: `Bearer ${spotify.getAccessToken()}` },
      })
    ).data;
    copy.music.tracks?.items.push(...(newArtists.tracks?.items ?? []));
    copy.music.tracks.next = newArtists.tracks?.next ?? '';
  }
  if (!isNil(copy.music.playlists) && type === 3) {
    const newArtists: SpotifyApi.SearchResponse = (
      await axios.get(current.music.playlists?.next ?? '', {
        headers: { Authorization: `Bearer ${spotify.getAccessToken()}` },
      })
    ).data;
    copy.music.playlists?.items.push(...(newArtists.playlists?.items ?? []));
    copy.music.playlists.next = newArtists.playlists?.next ?? '';
  }
  if (!isNil(copy.episodes) && type === 4) {
    const newArtists: SpotifyApi.SearchResponse = (
      await axios.get(current.episodes?.episodes.next ?? '', {
        headers: { Authorization: `Bearer ${spotify.getAccessToken()}` },
      })
    ).data;
    copy.episodes.episodes.items.push(...(newArtists.episodes?.items ?? []));
    copy.episodes.episodes.next = newArtists.episodes?.next ?? '';
  }
  if (!isNil(copy.shows) && type === 5) {
    const newArtists: SpotifyApi.SearchResponse = (
      await axios.get(current.shows?.shows.next ?? '', {
        headers: { Authorization: `Bearer ${spotify.getAccessToken()}` },
      })
    ).data;
    copy.shows.shows.items.push(...(newArtists.shows?.items ?? []));
    copy.shows.shows.next = newArtists.shows?.next ?? '';
  }
  return copy;
}
