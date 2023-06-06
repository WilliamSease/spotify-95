import { ApiTester } from './ApiTester';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import original from 'react95/dist/themes/original';
import { Button, styleReset, Window, WindowHeader } from 'react95';
import ms_sans_serif from 'react95/dist/fonts/ms_sans_serif.woff2';
import ms_sans_serif_bold from 'react95/dist/fonts/ms_sans_serif_bold.woff2';
import './App.css';

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
  return (
    <ThemeProvider theme={original}>
      <GlobalStyles />
      <Window style={{ width: '100%', height: '100%' }} resizable>
        <WindowHeader
          title="Spotify95"
          className="window-title dragApplication"
        >
          <span style={{ flexGrow: 1 }}>Spotify95</span>
          <Button className="clickableUnderDraggable" onClick={() => {}}>
            _
          </Button>
          <Button
            className="clickableUnderDraggable dialogButton"
            onClick={() => {}}
          >
            ✕
          </Button>
        </WindowHeader>
        <ApiTester />
      </Window>
    </ThemeProvider>
  );
}
