import SpotifyWebApi from 'spotify-web-api-js';
import axios from 'axios';
import { cloneDeep } from 'lodash';
import {
  LibraryType,
  Playable,
  SearchResultType,
} from '../representations/apiTypes';

const CLIENT_ID = '2d8d7d7d0f6241fcb7cf54fc5b2e24a8';
const REDIRECT_URI = 'spotify-95://gotToken';
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const SCOPES = [
  'user-read-playback-state',
  'user-modify-playback-state',
  'app-remote-control',
  'streaming',
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-follow-read',
  'user-read-playback-position',
  'user-top-read',
  'user-read-recently-played',
  'user-library-read',
];

let codeVerifier = '';

function generateRandomString(length: number): string {
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], '');
}

async function sha256(plain: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
}

function base64urlEncode(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

export const triggerLogin = async () => {
  codeVerifier = generateRandomString(64);
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64urlEncode(hashed);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    scope: SCOPES.join(' '),
  });

  const authorizationUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
  window.electron.ipcRenderer.sendMessage('logintospotify', [authorizationUrl]);
};

export const exchangeCodeForToken = async (code: string) => {
  const response = await axios.post(
    TOKEN_ENDPOINT,
    new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier,
    }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  return response.data;
};

export const refreshAccessToken = async (refreshToken: string) => {
  const response = await axios.post(
    TOKEN_ENDPOINT,
    new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  return response.data;
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
      limit: 20,
      offset: out.albums.length,
    });
    out.albums.push(...nextAlbums.items.map((a) => a.album));
    console.info(nextAlbums.next);
  }
  let nextShows = await spotify.getMySavedShows();
  out.shows.push(...nextShows.items.map((s) => s.show));
  while (nextShows.next) {
    nextShows = await spotify.getMySavedShows({
      after: new URLSearchParams(nextShows.next).get('after'),
      limit: 20,
      offset: out.shows.length,
    });
    out.shows.push(...nextShows.items.map((s) => s.show));
  }
  const playlistCount = (await spotify.getUserPlaylists()).total;
  for (let i = 0; i < playlistCount; i += 50) {
    out.playlists.push(
      ...(await spotify.getUserPlaylists(undefined, { offset: i, limit: 50 }))
        .items
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
    copy.albums.push(...newAlbums);
  }
  if (type === 2 || type === 'ALL') {
    const newTracks = (
      await spotify.searchTracks(searchTerm, {
        offset: copy.tracks.length,
        limit: 10,
      })
    ).tracks.items;
    copy.tracks.push(...newTracks);
  }
  if (type === 3 || type === 'ALL') {
    const newShows = (
      await spotify.searchShows(searchTerm, {
        offset: copy.shows.length,
        limit: 10,
      })
    ).shows.items;
    copy.shows.push(...newShows);
  }
  if (type === 4 || type === 'ALL') {
    const newEpisodes = (
      await spotify.searchEpisodes(searchTerm, {
        offset: copy.episodes.length,
        limit: 10,
      })
    ).episodes.items;
    copy.episodes.push(...newEpisodes);
  }
  if (type === 5 || type === 'ALL') {
    const newPlaylists = (
      await spotify.searchPlaylists(searchTerm, {
        offset: copy.playlists.length,
        limit: 10,
      })
    ).playlists.items;
    copy.playlists.push(...newPlaylists);
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

export const putOnRecord = async (
  spotify: SpotifyWebApi.SpotifyWebApiJs,
  toAdd: Playable[],
  ifNoDevices: () => void
) => {
  const state = await spotify.getMyCurrentPlaybackState();
  if (state.is_playing) await spotify.pause();
  const devices = await spotify.getMyDevices();
  let activateFirstDevice = true;
  for (const device of devices.devices) {
    if (device.is_active) activateFirstDevice = false;
  }
  if (activateFirstDevice && devices.devices.length === 0) {
    ifNoDevices();
  } else {
    if (activateFirstDevice) {
      await spotify.transferMyPlayback([devices.devices[0].id ?? '']);
    }
    await spotify.play({ uris: toAdd.map((playable) => playable.uri) });
  }
};

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
