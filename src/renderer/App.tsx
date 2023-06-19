import { createGlobalStyle, ThemeProvider } from 'styled-components';
import {
  Button,
  Frame,
  MenuList,
  ScrollView,
  Separator,
  styleReset,
  TextInput,
  Toolbar,
  Window,
  WindowHeader,
} from 'react95';
import ms_sans_serif from 'react95/dist/fonts/ms_sans_serif.woff2';
import ms_sans_serif_bold from 'react95/dist/fonts/ms_sans_serif_bold.woff2';
import './App.css';
import MenuButtonWithDropDown from './sdk/MenuButtonWithDropDown';
import { useCallback, useEffect, useState } from 'react';
import { TokenInfo } from './representations/apiTypes';
import { populateLibrary, triggerLogin } from './functions/apiFunctions';
import { isNil } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectSearchTerm,
  selectSpotify,
  selectTheme,
  setArtURL,
  setSearchTerm,
} from './state/store';
import { SettingsDialog } from './dialogs/SettingsDialog';
import { SearchDialog } from './dialogs/SearchDialog';
import { ApiTester } from './dialogs/ApiTester';
import { VolumeSlider } from './components/VolumeSlider';
import { ArtDialog } from './dialogs/ArtDialog';
import { LibraryTree } from './components/LibraryTree';
import { PlayerList } from './components/PlayerList';
import { AboutDialog } from './dialogs/AboutDialog';
import { DeviceDialog } from './dialogs/DeviceDialog';

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

  const [tokenButtonHover, setTokenButtonHover] = useState(false);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [apiTesterOpen, setApiTesterOpen] = useState(false);
  const [aboutDialogOpen, setAboutDialogOpen] = useState(false);
  const [deviceDialogOpen, setDeviceDialogOpen] = useState(false);

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
        resizable
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
        <ArtDialog />
        <AboutDialog
          isOpen={aboutDialogOpen}
          closeThisWindow={() => setAboutDialogOpen(false)}
        />
        <DeviceDialog
          isOpen={deviceDialogOpen}
          closeThisWindow={() => setDeviceDialogOpen(false)}
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
            className="clickableUnderDraggable dialogButton"
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
            ]}
          />
          <Button variant="thin" onClick={() => setDeviceDialogOpen(true)}>
            Device
          </Button>
          <MenuButtonWithDropDown
            buttonText="About"
            menuOptions={[
              {
                text: 'About',
                onClick: () => {
                  setAboutDialogOpen(true);
                },
              },
              {
                text: 'Buy me a coffee',
                onClick: () => {},
              },
              {
                text: 'Buy React95 a coffee',
                onClick: () => {},
              },
            ]}
          />
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
            onMouseOver={() => setTokenButtonHover(true)}
            onMouseLeave={() => setTokenButtonHover(false)}
            onClick={triggerLogin}
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
          <div
            style={{ width: `${leftPanelBigger ? 70 : 30}%`, height: '100%' }}
          >
            <LibraryTree />
          </div>
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
              <Button onClick={() => {}}>Clear</Button>
              <Button
                onClick={() => {
                  dispatch(
                    setArtURL(
                      'https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228'
                    )
                  );
                }}
              >
                Show art
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
