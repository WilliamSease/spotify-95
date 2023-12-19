import { createGlobalStyle, ThemeProvider } from 'styled-components';
import {
  Button,
  Separator,
  styleReset,
  TextInput,
  Toolbar,
  Window,
  WindowContent,
  WindowHeader,
} from 'react95';
import ms_sans_serif from 'react95/dist/fonts/ms_sans_serif.woff2';
import ms_sans_serif_bold from 'react95/dist/fonts/ms_sans_serif_bold.woff2';
import './App.css';
import MenuButtonWithDropDown from './sdk/MenuButtonWithDropDown';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Playable, TokenInfo } from './representations/apiTypes';
import { sleep, triggerLogin } from './functions/apiFunctions';
import { isNil } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectPlaybackItem,
  selectPlaybackState,
  selectPlayerView,
  selectSearchTerm,
  selectShowAlbumArt,
  selectSpotify,
  selectTheme,
  setArtURL,
  setPlaybackItem,
  setPlaybackState,
  setSearchTerm,
  setToPlayer,
  togglePlayerView,
  toggleShowAlbumArt,
} from './state/store';
import { SettingsDialog } from './dialogs/SettingsDialog';
import { SearchDialog } from './dialogs/SearchDialog';
import { ApiTester } from './dialogs/ApiTester';
import { VolumeSlider } from './components/VolumeSlider';
import { ArtDialog } from './dialogs/ArtDialog';
import { LibraryTree } from './components/LibraryTree';
import { PlayerList } from './components/PlayerList';
import { AboutDialog, TodoDialog, WhyDialog } from './dialogs/AboutDialog';
import { DeviceDialog } from './dialogs/DeviceDialog';
import { AddToPlayerDialog } from './dialogs/AddToPlayerDialog';
import { FlexColumn } from './sdk/FlexElements';
import { AuthDialog } from './dialogs/AuthDialog';
import { Debugger } from './dialogs/Debugger';
import { useClock } from './sdk/useClock';
import axios from 'axios';
import { ErrorDialog } from './dialogs/ErrorDialog';
import Label from './sdk/Label';
import { NetworkGraphDialog } from './dialogs/NetworkGraphDialog';
import { FocusModeDialog } from './dialogs/FocusModeDialog';
import { ArtistPage } from './dialogs/ArtistPage';

const GlobalStyles = createGlobalStyle`
  ${styleReset}
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif}') format('woff2');
    font-weight: 400;
    font-style: normal
  }
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif_bold}') format('woff2');
    font-weight: bold;
    font-style: normal
  }
  body {
    font-family: 'ms_sans_serif';
  }
  .window-title{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

export default function App() {
  const dispatch = useDispatch();

  const spotify = useSelector(selectSpotify);
  const playBackState = useSelector(selectPlaybackState);
  const nowPlaying = useSelector(selectPlaybackItem);
  const playerView: 'individual' | 'group' = useSelector(selectPlayerView);
  const nowPlayingImage = useMemo(
    () =>
      isNil(nowPlaying)
        ? undefined
        : nowPlaying.type === 'track'
        ? nowPlaying.album.images[0]
        : nowPlaying.images[0],
    [nowPlaying]
  );
  const currentAlbumArtText =
    nowPlaying?.type === 'track' ? nowPlaying.album.name : nowPlaying?.name;
  const showAlbumArt = useSelector(selectShowAlbumArt);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>();

  const [leftPanelBigger, setLeftPanelBigger] = useState(false);

  useEffect(() => {
    triggerLogin();
    const interval = setInterval(triggerLogin, 1000 * 60 * 30);
    return () => clearInterval(interval);
  }, []);

  window.electron.ipcRenderer.on('gotNewToken', (args) => {
    const urlParams = new URLSearchParams(args as string).values();
    const token = urlParams.next().value;
    const type = urlParams.next().value;
    const expiresIn: number = urlParams.next().value;
    setTokenInfo({
      token: token,
      type: type,
      expiresIn: expiresIn,
      expirationTime: Date.now() + expiresIn * 1000,
    });
    spotify.setAccessToken(token);
  });

  window.electron.ipcRenderer.on('possiblyRevoked', (args) => {
    spotify.setAccessToken('');
    setTokenInfo(undefined);
  });

  const [tokenButtonHover, setTokenButtonHover] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [apiTesterOpen, setApiTesterOpen] = useState(false);
  const [debuggerIsOpen, setDebuggerIsOpen] = useState(false);
  const [aboutDialogOpen, setAboutDialogOpen] = useState(false);
  const [todoDialogOpen, setTodoDialogOpen] = useState(false);
  const [whyDialogOpen, setWhyDialogOpen] = useState(false);
  const [deviceDialogOpen, setDeviceDialogOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [networkGraphOpen, setNetworkGraphOpen] = useState(false);
  const [focusModeOpen, setFocusModeOpen] = useState(false);

  const [delays, setDelays] = useState<number[]>([]);
  const pushDelay = useCallback(
    (val: number) =>
      setDelays((prev) => {
        if (prev.length > 19) prev.shift();
        prev.push(val);
        return prev;
      }),
    [setDelays]
  );
  const [connection, setConnection] = useState<'Good' | 'Slow' | 'Desync'>(
    'Good'
  );
  //Note: spotify is threating to remove this additional_types parameter. Scary.
  // https://developer.spotify.com/documentation/web-api/reference/get-information-about-the-users-current-playback
  useClock({
    effect: useCallback(async () => {
      const bad = setTimeout(() => {
        setConnection('Desync');
        pushDelay(1000);
      }, 1000);
      const stamp = Date.now();
      let call = null;
      while (isNil(call)) {
        call = await axios.get(
          'https://api.spotify.com/v1/me/player?additional_types=episode',
          {
            headers: { Authorization: `Bearer ${spotify.getAccessToken()}` },
          }
        );
        if (call.status !== 200) {
          call = null;
          await sleep(500);
        }
      }
      const data = call.data as SpotifyApi.CurrentPlaybackResponse;
      dispatch(setPlaybackItem(data.item as Playable));
      dispatch(setPlaybackState(data));
      clearInterval(bad);
      if (Date.now() - 300 < stamp) {
        setConnection('Good');
        pushDelay(Date.now() - stamp);
      } else if (Date.now() - 1000 < stamp) {
        setConnection('Slow');
        pushDelay(Date.now() - stamp);
      }
    }, [spotify, setConnection, pushDelay]),
    condition: !isNil(tokenInfo),
    delay: 50,
  });

  return (
    <ThemeProvider theme={useSelector(selectTheme)}>
      <GlobalStyles />
      <Window
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <SearchDialog
          isOpen={searchOpen}
          closeThisWindow={() => setSearchOpen(false)}
        />
        <SettingsDialog
          isOpen={settingsOpen}
          closeThisWindow={() => setSettingsOpen(false)}
        />
        <ApiTester
          isOpen={apiTesterOpen}
          onClose={() => setApiTesterOpen(false)}
        />
        <Debugger
          isOpen={debuggerIsOpen}
          onClose={() => setDebuggerIsOpen(false)}
        />
        <ArtDialog />
        <AboutDialog
          isOpen={aboutDialogOpen}
          closeThisWindow={() => setAboutDialogOpen(false)}
        />
        <TodoDialog
          isOpen={todoDialogOpen}
          closeThisWindow={() => setTodoDialogOpen(false)}
        />
        <WhyDialog
          isOpen={whyDialogOpen}
          closeThisWindow={() => setWhyDialogOpen(false)}
        />
        <DeviceDialog
          isOpen={deviceDialogOpen}
          closeThisWindow={() => setDeviceDialogOpen(false)}
        />
        <ArtistPage />
        <AddToPlayerDialog />
        <AuthDialog
          isOpen={authDialogOpen}
          closeThisWindow={() => setAuthDialogOpen(false)}
          tokenInfo={tokenInfo}
          triggerLogin={triggerLogin}
        />
        <NetworkGraphDialog
          isOpen={networkGraphOpen}
          closeThisWindow={() => setNetworkGraphOpen(false)}
          delays={delays}
        />
        <ErrorDialog />
        <FocusModeDialog
          isOpen={focusModeOpen}
          closeThisWindow={() => setFocusModeOpen(false)}
        />
        <WindowHeader
          title="Spotify95"
          className="window-title dragApplication"
        >
          <span style={{ flexGrow: 1 }}>Spotify95</span>
          <Button
            className="clickableUnderDraggable"
            onClick={() => {
              window.electron.ipcRenderer.sendMessage('minimizeButton');
            }}
          >
            _
          </Button>
          <Button
            className="clickableUnderDraggable toolbarButton"
            onClick={() => {
              window.electron.ipcRenderer.sendMessage('quitButton');
            }}
          >
            ✕
          </Button>
        </WindowHeader>
        <Toolbar>
          <MenuButtonWithDropDown
            buttonText="File"
            menuOptions={[
              { text: 'Settings', onClick: () => setSettingsOpen(true) },
              { text: 'API Tester', onClick: () => setApiTesterOpen(true) },
              { text: 'Debugger', onClick: () => setDebuggerIsOpen(true) },
            ]}
          />
          <MenuButtonWithDropDown
            buttonText="About"
            menuOptions={[
              {
                text: 'About',
                onClick: () => setAboutDialogOpen(true),
              },
              {
                text: 'Todo',
                onClick: () => setTodoDialogOpen(true),
              },
              {
                text: 'Why',
                onClick: () => setWhyDialogOpen(true),
              },
            ]}
          />
          <Button variant="thin" onClick={() => setFocusModeOpen(true)}>
            Focus
          </Button>
          <span style={{ flexGrow: 1 }} />
          <TextInput
            value={useSelector(selectSearchTerm)}
            placeholder="Search"
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            width={20}
          />
          <Button
            onClick={() => {
              setSearchOpen(true);
            }}
            style={{ marginLeft: 4 }}
          >
            🔎
          </Button>
          <Button
            className="toolbarButton"
            onClick={() => setDeviceDialogOpen(true)}
          >
            {isNil(playBackState?.device)
              ? ''
              : playBackState?.device.type === 'Computer'
              ? '🖥️'
              : playBackState?.device.type === 'Smartphone'
              ? '📱'
              : playBackState?.device.type === 'Speaker'
              ? '🔊'
              : ''}{' '}
            {isNil(playBackState?.device)
              ? 'No Device!'
              : playBackState?.device.name}
          </Button>
          <Button
            onClick={() => setNetworkGraphOpen(true)}
            className="toolbarButton"
          >
            <div
              style={{
                backgroundColor: connection === 'Desync' ? 'red' : undefined,
                padding: '.2rem',
              }}
            >
              📶 {connection}
            </div>
          </Button>
          <Button
            onMouseOver={() => setTokenButtonHover(true)}
            onMouseLeave={() => setTokenButtonHover(false)}
            onClick={() => setAuthDialogOpen(true)}
            style={{ marginLeft: 4, width: 100 }}
          >
            <div>
              {!isNil(tokenInfo)
                ? tokenButtonHover
                  ? `${Math.floor(
                      (tokenInfo.expirationTime - Date.now()) / (1000 * 60)
                    )} min`
                  : 'Auth ✔️'
                : 'Auth ❌'}
            </div>
          </Button>
        </Toolbar>
        <Separator />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexGrow: 1,
            marginTop: 10,
            marginLeft: 10,
            marginRight: 10,
            marginBottom: 40,
          }}
        >
          <FlexColumn
            style={{ width: `${leftPanelBigger ? 70 : 30}%`, height: '100%' }}
          >
            <LibraryTree token={tokenInfo?.token} />
            {nowPlayingImage && showAlbumArt && !leftPanelBigger && (
              <Window
                title={'Artwork'}
                style={{
                  height: 410,
                  width: 375,
                }}
              >
                <WindowHeader
                  title="AlbumArt"
                  className="window-title dragApplication"
                >
                  <div
                    style={{
                      maxWidth: '300px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {currentAlbumArtText}
                  </div>

                  <Button
                    className="toolbarButton clickableUnderDraggable"
                    onClick={() => dispatch(toggleShowAlbumArt())}
                  >
                    ✕
                  </Button>
                </WindowHeader>
                <img
                  style={{ height: 365, width: 365 }}
                  src={nowPlayingImage.url}
                />
              </Window>
            )}
            {!showAlbumArt && !leftPanelBigger && (
              <Button
                className="toolbarButton clickableUnderDraggable"
                onClick={() => dispatch(toggleShowAlbumArt())}
                style={{ width: 100, height: 30, marginTop: 5 }}
                disabled={isNil(nowPlayingImage)}
              >
                Show Art
              </Button>
            )}
          </FlexColumn>
          <div
            style={{
              width: `${leftPanelBigger ? 30 : 70}%`,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Toolbar>
              <Button
                variant="thin"
                onClick={() => setLeftPanelBigger(!leftPanelBigger)}
                style={{
                  transform: leftPanelBigger ? 'scaleX(-1)' : undefined,
                }}
              >
                👉
              </Button>
              <span style={{ flexGrow: 1 }}></span>
              <Button
                style={{ marginLeft: '.5rem' }}
                onClick={() => dispatch(togglePlayerView())}
              >
                {playerView === 'individual'
                  ? `Individual Tracks`
                  : `Group Tracks By Artist/Album`}
              </Button>
              <VolumeSlider />
            </Toolbar>
            <PlayerList />
          </div>
        </div>
      </Window>
    </ThemeProvider>
  );
}
