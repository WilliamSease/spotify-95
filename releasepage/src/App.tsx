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
import { isMobile } from 'react-device-detect';

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
  setOpenScreen: React.Dispatch<React.SetStateAction<number>>;
}) => {
  return props.openScreen > 0 && props.openScreen < 6 ? (
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
          <Button
            variant="default"
            style={{ marginLeft: 10, marginTop: 10 }}
            onClick={() =>
              props.setOpenScreen((prev: number) => (prev > 1 ? prev - 1 : 5))
            }
          >
            Prev
          </Button>
          <Button variant="thin" style={{ marginLeft: 10, marginTop: 10 }}>
            {`${props.openScreen} / ${5}`}
          </Button>
          <Button
            variant="default"
            style={{ marginLeft: 10, marginTop: 10 }}
            onClick={() =>
              props.setOpenScreen((prev: number) => (prev < 5 ? prev + 1 : 1))
            }
          >
            Next
          </Button>
        </div>
        <div
          style={{
            flexGrow: 1,
            marginTop: 20,
            alignSelf: 'center',
            width: '90%',
          }}
        >
          <img
            style={{ width: '100%' }}
            src={`https://williamsease.github.io/spotify-95/releasepage/build/screen${props.openScreen}.png`}
            alt={`screen${props.openScreen}`}
          />
        </div>
      </div>
    </div>
  ) : null;
};

const Link = (props: {
  link: string;
  linkText: string;
  additionalText?: string;
}) => (
  <>
    <a
      style={{
        color: 'blue',
        textDecoration: 'underline',
        marginRight: '1rem',
      }}
      href={props.link}
      
      rel="noreferrer noopener"
    >
      {props.linkText}
    </a>
    {props.additionalText && <span>{props.additionalText}</span>}
  </>
);

const App = () => {
  const [openScreen, setOpenScreen] = useState(0);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: isMobile ? '90%' : 1100,
        flexGrow: 1,
        backgroundColor: 'white',
        marginLeft: isMobile ? 5 : undefined,
        marginRight: isMobile ? 5 : undefined,
        paddingLeft: 5,
        paddingRight: 5,
        height: '100%',
        alignItems: 'center',
      }}
    >
      <GlobalStyles />
      <ThemeProvider theme={original}>
        <Window
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <BlackoutModal
            openScreen={openScreen}
            setOpenScreen={setOpenScreen}
          />
          <WindowHeader>Spotify95</WindowHeader>
          <WindowContent
            style={{
              flexGrow: 1,
              flexDirection: 'column',
              display: 'flex',
              height: '1px',
            }}
          >
            <ScrollView style={{ flexGrow: 1, height: 1, padding: '1rem' }}>
              <img
                src="https://williamsease.github.io/spotify-95/releasepage/build/spotify95.png"
                alt="Spotify95"
                style={{ borderRadius: 300 }}
                width={isMobile ? '80%' : undefined}
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
                <ScrollView style={{ padding: '1rem', background: 'white' }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <img
                      src={`https://williamsease.github.io/spotify-95/releasepage/build/screen${i}.png`}
                      alt={`screen${i}`}
                      style={{ height: 100, marginRight: 20 }}
                      onClick={() => setOpenScreen(i)}
                    />
                  ))}
                </ScrollView>
              </GroupBox>
              <GroupBox label="Downloads" style={{ marginTop: '1rem' }}>
                <div>Windows</div>
                <div>
                  <Link
                    link="https://williamsease.github.io/spotify-95/releasepage/downloads/spotify95 Setup 0.1.2.exe"
                    linkText="spotify95 Setup 0.1.2.exe"
                    additionalText="Asks for less permissions during authentication"
                  />
                </div>
                <div>Mac</div>
                <div><Link link='/Users/williamsease/Documents/GitHub/spotify-95/releasepage/downloads/spotify95-0.1.2.dmg' linkText='spotify95 0.1.2.dmg'/></div>
              </GroupBox>
              <GroupBox label="Links" style={{ marginTop: '1rem' }}>
                <a
                  style={{
                    color: 'blue',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    marginRight: '1rem',
                  }}
                  href="https://williamsease.github.io/"
                  
                  rel="noreferrer noopener"
                >
                  William Sease
                </a>
                <a
                  style={{
                    color: 'blue',
                    textDecoration: 'underline',
                    marginRight: '1rem',
                  }}
                  href="https://react95.io/"
                  
                  rel="noreferrer noopener"
                >
                  React 95
                </a>
                <a
                  style={{
                    color: 'blue',
                    textDecoration: 'underline',
                    marginRight: '1rem',
                  }}
                  href="https://github.com/williamsease/spotify-95"
                  
                  rel="noreferrer noopener"
                >
                  Repository
                </a>
                <a
                  style={{
                    color: 'blue',
                    textDecoration: 'underline',
                    marginRight: '1rem',
                  }}
                  href="https://github.com/electron-react-boilerplate/electron-react-boilerplate"
                  
                  rel="noreferrer noopener"
                >
                  Election React Boilerplate
                </a>
                <a
                  style={{
                    color: 'blue',
                    textDecoration: 'underline',
                    marginRight: '1rem',
                  }}
                  href="https://github.com/JMPerez/spotify-web-api-js"
                  
                  rel="noreferrer noopener"
                >
                  JS Spotify Web API{' '}
                </a>
              </GroupBox>
            </ScrollView>
          </WindowContent>
        </Window>
      </ThemeProvider>
    </div>
  );
};

export default App;
