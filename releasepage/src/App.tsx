import React from 'react';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import {
  Anchor,
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
          <GroupBox label="Downloads">
            <Anchor
              href="WilliamASease.github.io/spotify-95/releasepage/downloads/win-0.0.1.rar"
              target="_blank"
            >
              Windows 0.0.1
            </Anchor>
          </GroupBox>
        </WindowContent>
      </Window>
    </ThemeProvider>
  </div>
);

export default App;
