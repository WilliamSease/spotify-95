import React from 'react';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import {
  GroupBox,
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

const App = () => (
  <div style={{ height: '100%' }}>
    <GlobalStyles />
    <ThemeProvider theme={original}>
      <Window style={{ width: '100%', height: '100%' }}>
        <WindowHeader>Spotify95 for React95</WindowHeader>
        <WindowContent>
          <img
            src="https://WilliamASease.github.io/spotify-95/releasepage/build/spotify95.png"
            alt="Spotify95"
          />
          <GroupBox label="What" style={{ marginTop: '1rem' }}>
            <div style={{ padding: '1rem', background: 'white' }}>
              An electron Spotify frontend written in stylish React95.
            </div>
          </GroupBox>
          <GroupBox label="Screens" style={{ marginTop: '1rem' }}>
            <div style={{ padding: '1rem', background: 'white' }}>
              <img
                src="https://WilliamASease.github.io/spotify-95/releasepage/build/screen1.png"
                alt="screen1"
              />
              <img
                src="https://WilliamASease.github.io/spotify-95/releasepage/build/screen2.png"
                alt="screen2"
              />
              <img
                src="https://WilliamASease.github.io/spotify-95/releasepage/build/screen3.png"
                alt="screen3"
              />
              <img
                src="https://WilliamASease.github.io/spotify-95/releasepage/build/screen4.png"
                alt="screen4"
              />
              <img
                src="https://WilliamASease.github.io/spotify-95/releasepage/build/screen5.png"
                alt="screen5"
              />
            </div>
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

export default App;
