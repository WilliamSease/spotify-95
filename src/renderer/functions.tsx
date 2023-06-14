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
