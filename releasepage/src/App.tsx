import React, { useState } from 'react';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import {
  Button,
  GroupBox,
  ScrollView,
  styleReset,
  Window,
  WindowContent,
  WindowHeader,
} from 'react95';
// pick a theme of your choice
import original from 'react95/dist/themes/original';
// original Windows95 font (optionally)
import ms_sans_serif from 'react95/dist/fonts/ms_sans_serif.woff2';
import ms_sans_serif_bold from 'react95/dist/fonts/ms_sans_serif_bold.woff2';

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
`;

const BlackoutModal = (props: {
  openScreen: number;
  setOpenScreen: (toSet: number) => void;
}) => {
  return props.openScreen > 0 ? (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        position: 'absolute',
        zIndex: 2,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
        }}
      >
        <div>
          <Button
            variant="default"
            style={{ marginLeft: 10, marginTop: 10 }}
            onClick={() => props.setOpenScreen(0)}
          >
            Back
          </Button>
        </div>
        <div style={{ flexGrow: 1, marginTop: 20, alignSelf: 'center' }}>
          <img
            src={`https://WilliamASease.github.io/spotify-95/releasepage/build/screen${props.openScreen}.png`}
            alt={`screen${props.openScreen}`}
          />
        </div>
      </div>
    </div>
  ) : null;
};

const App = () => {
  const [openScreen, setOpenScreen] = useState(0);
  return (
    <div style={{ height: '100%' }}>
      <GlobalStyles />
      <ThemeProvider theme={original}>
        <Window style={{ width: '100%', height: '100%' }}>
          <BlackoutModal
            openScreen={openScreen}
            setOpenScreen={setOpenScreen}
          />
          <WindowHeader>Spotify95</WindowHeader>
          <WindowContent>
            <img
              src="https://WilliamASease.github.io/spotify-95/releasepage/build/spotify95.png"
              alt="Spotify95"
              style={{ borderRadius: 300 }}
            />
            <GroupBox label="What" style={{ marginTop: '1rem' }}>
              <ScrollView style={{ padding: '1rem', background: 'white' }}>
                An electron Spotify frontend utilizing stylish React95.
              </ScrollView>
            </GroupBox>
            <GroupBox
              label="Screens (click to open)"
              style={{ marginTop: '1rem' }}
            >
              <ScrollView
                style={{ padding: '1rem', background: 'white', height: 200 }}
              >
                {[1, 2, 3, 4, 5].map((i) => (
                  <img
                    src={`https://WilliamASease.github.io/spotify-95/releasepage/build/screen${i}.png`}
                    alt={`screen${i}`}
                    style={{ height: 100, marginRight: 20 }}
                    onClick={() => setOpenScreen(i)}
                  />
                ))}
              </ScrollView>
            </GroupBox>
            <GroupBox label="Downloads" style={{ marginTop: '1rem' }}>
              <a
                style={{
                  color: 'blue',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
                href="https://WilliamASease.github.io/spotify-95/releasepage/downloads/win-0.0.1.rar"
              >
                Windows 0.0.1
              </a>
            </GroupBox>
          </WindowContent>
        </Window>
      </ThemeProvider>
    </div>
  );
};

export default App;
