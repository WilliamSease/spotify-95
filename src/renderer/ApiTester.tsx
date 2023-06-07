import { useState } from 'react';
import { Button, GroupBox, WindowContent, Window } from 'react95';
import { isNil } from 'lodash';
import axios from 'axios';
import SpotifyWebApi from 'spotify-web-api-js';

export const ApiTester = () => {
  // Parse the access token from the URL fragment
  const urlParams = new URLSearchParams(window.location.hash.substring(1));
  const accessToken = urlParams.get('access_token');
  const tokenType = urlParams.get('token_type');
  const expiresIn = urlParams.get('expires_in');
  let spotify = new SpotifyWebApi();
  spotify.setAccessToken(accessToken);

  const [album, setAlbum] = useState<SpotifyApi.SingleAlbumResponse>();
  const [newReleases, setNewReleases] =
    useState<SpotifyApi.ListOfNewReleasesResponse>();
  const [me, setMe] = useState<SpotifyApi.CurrentUsersProfileResponse>();
  const [audioUrl, setAudioUrl] = useState<string>();

  const getTestDisplayValue = (untested: boolean, check: boolean) => {
    return untested ? (
      <div>untested</div>
    ) : (
      <div>{check ? <span>OK!</span> : <span>Error!</span>}</div>
    );
  };

  return (
    <>
      <GroupBox variant="default">
        <Button
          children={'Get Token'}
          onClick={async () => {
            const clientId = '2d8d7d7d0f6241fcb7cf54fc5b2e24a8';
            const redirectUri = 'http://localhost:1212';
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
            window.electron.ipcRenderer.sendMessage('redirect', [
              authorizationUrl,
            ]);
          }}
        />
        <Button
          children={'Test Functions'}
          disabled={!accessToken}
          onClick={async () => {
            spotify.getAlbum('0PT5m6hwPRrpBwIHVnvbFX').then((value) => {
              setAlbum(value);
            });
            spotify.getNewReleases().then((value) => {
              setNewReleases(value);
            });
            spotify.getMe().then((value) => {
              setMe(value);
            });
          }}
        />
        <Button
          children={'Reset Panel'}
          disabled={!accessToken}
          onClick={async () => {
            setAlbum(undefined);
            setNewReleases(undefined);
            setMe(undefined);
          }}
        />
        <Button
          children={'Play Help By the Beatles'}
          disabled={!accessToken}
          onClick={async () => {
            await axios
              .put(
                `https://api.spotify.com/v1/me/player/play`,
                {
                  uris: ['spotify:track:7DD7eSuYSC5xk2ArU62esN'],
                },
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                }
              )
              .then((response) => {});
          }}
        />
      </GroupBox>

      <GroupBox label="access token">
        {accessToken ? 'Defined!' : 'Not Defined'}
        <div>token type: {tokenType}</div>
        <div>expires in: {expiresIn}</div>
      </GroupBox>
      <GroupBox label="getAlbum">
        <div>id: {album?.id}</div>
        <div>name: {album?.name}</div>
        <div>artist: {album?.artists[0].name}</div>
        <div>tracks: {album?.tracks.items.length}</div>
        {getTestDisplayValue(
          isNil(album),
          album?.id === '0PT5m6hwPRrpBwIHVnvbFX'
        )}
      </GroupBox>
      <GroupBox label="getNewReleases">
        <div>
          New Releases:
          {(
            newReleases ?? { albums: { items: [] } }
          ).albums.items.length.toString()}
        </div>
        {getTestDisplayValue(
          isNil(newReleases),
          newReleases?.albums.items.length === 20
        )}
      </GroupBox>
      <GroupBox label="getMe">
        <div>display name: {me?.display_name}</div>
        <div>email: {me?.email}</div>
        <div>country: {me?.country}</div>
        <div>Make sure this is you!</div>
      </GroupBox>
      <GroupBox label="sound test">
        <div>
          Open spotify and play any song. Then click the "Play Help" button.
        </div>
        {audioUrl && <audio id="audio" src={audioUrl} autoPlay />}
      </GroupBox>
    </>
  );
};
