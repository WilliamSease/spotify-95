import { ApiTester } from "./ApiTester/ApiTester";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import original from "react95/dist/themes/original";
import { Button, styleReset, Window, WindowHeader } from "react95";
import ms_sans_serif from "react95/dist/fonts/ms_sans_serif.woff2";
import ms_sans_serif_bold from "react95/dist/fonts/ms_sans_serif_bold.woff2";

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
  html {
    height:100%,
    width:100%
  }
  body {
    font-family: 'ms_sans_serif';
    height:100%,
    width:100%
  }
  .window-title{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

function App() {
  return (
    <ThemeProvider theme={original}>
      <GlobalStyles />
      <Window style={{ height: "100%", width: "100%" }}>
        <WindowHeader title="Spotify95" className="window-title">
          <span>Spotify95</span>
          <Button onClick={() => {}}>
            <span className="close-icon" />
          </Button>
        </WindowHeader>
        <ApiTester />
      </Window>
    </ThemeProvider>
  );
}

export default App;
