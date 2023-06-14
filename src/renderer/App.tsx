import { ApiTester } from './ApiTester';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import original from 'react95/dist/themes/original';
import {
  Button,
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
import { useEffect, useState } from 'react';
import { TokenInfo } from './representations/apiTypes';
import SpotifyWebApi from 'spotify-web-api-js';
import { triggerLogin } from './functions';
import { isNil } from 'lodash';
import { useSelector } from 'react-redux';
import { selectTheme } from './state/store';
import { SettingsWindow } from './SettingsWindow';
import { Modal } from './sdk/Modal';

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
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>();
  const [spotify, setSpotify] = useState<SpotifyWebApi.SpotifyWebApiJs>(
    new SpotifyWebApi()
  );

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
    setSpotify((oldSpotify) => {
      oldSpotify.setAccessToken(token);
      return oldSpotify;
    });
  });

  const [searchBarValue, setSearchBarValue] = useState('');
  const [tokenButtonHover, setTokenButtonHover] = useState(false);

  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <ThemeProvider theme={useSelector(selectTheme)}>
      <GlobalStyles />
      <Window style={{ width: '100%', height: '100%' }} resizable>
        <SettingsWindow
          isOpen={settingsOpen}
          closeThisWindow={() => setSettingsOpen(false)}
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
            ]}
          />
          <span style={{ flexGrow: 1 }} />
          <TextInput
            value={searchBarValue}
            placeholder="Search"
            onChange={(e) => setSearchBarValue(e.target.value)}
            width={20}
          />
          <Button onClick={() => {}} style={{ marginLeft: 4 }}>
            mag
          </Button>
          <Button
            onMouseOver={() => setTokenButtonHover(true)}
            onMouseLeave={() => setTokenButtonHover(false)}
            onClick={triggerLogin}
            style={{ marginLeft: 4, width: 150 }}
          >
            <div style={{ color: tokenInfo ? 'green' : 'red' }}>
              {!isNil(tokenInfo)
                ? tokenButtonHover
                  ? `${Math.floor(
                      (tokenInfo.expirationTime - Date.now()) / (1000 * 60)
                    )} min`
                  : 'Token GOOD'
                : 'Token BAD'}
            </div>
          </Button>
        </Toolbar>
        <Separator />
      </Window>
    </ThemeProvider>
  );
}
