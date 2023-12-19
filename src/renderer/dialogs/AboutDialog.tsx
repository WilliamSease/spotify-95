import { Anchor } from 'react95';
import { FlexWindowModal } from 'renderer/sdk/FlexWindowModal';
import { logo } from 'renderer/images';

type IProps = {
  isOpen: boolean;
  closeThisWindow: () => void;
};

export const AboutDialog = (props: IProps) => {
  const { isOpen, closeThisWindow } = props;
  return (
    <FlexWindowModal
      title={'About'}
      height={450}
      width={500}
      isOpen={isOpen}
      onClose={closeThisWindow}
      provideCloseButton
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img style={{ borderRadius: 300 }} src={logo} />
        <div style={{ marginTop: '.25rem' }}>
          Spotify95 October 2023 [Unreleased]
        </div>
        <Anchor target={'_blank'} href="https://WilliamASease.github.io">
          William Sease
        </Anchor>
        <Anchor target={'_blank'} href="https://react95.io/">
          React95
        </Anchor>
        <Anchor
          target={'_blank'}
          href="https://github.com/JMPerez/spotify-web-api-js"
        >
          JS Spotify Web API
        </Anchor>
        <Anchor
          target={'_blank'}
          href="https://github.com/electron-react-boilerplate/electron-react-boilerplate"
        >
          Electron React Boilerplate
        </Anchor>
        <div>Contact:</div>
        <div>WilliamASease@protonmail.com</div>
      </div>
    </FlexWindowModal>
  );
};

export const TodoDialog = (props: IProps) => {
  const { isOpen, closeThisWindow } = props;
  return (
    <FlexWindowModal
      title={'Todo'}
      height={400}
      width={500}
      isOpen={isOpen}
      onClose={closeThisWindow}
      provideCloseButton
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '90%%',
          marginLeft: '5%',
          marginRight: '5%',
        }}
      >
        <div style={{ marginTop: '.25rem' }}>
          Rough list of outstanding features:
        </div>
        <hr style={{ width: '100%' }} />
        <div>
          Set up right-click behavior everywhere (open artist from a track
          entry, for example)
        </div>
        <div>Generate new tracks based on state of player and display them</div>
        <div>
          Unbreak resizing and maybe make the main window resizable, someday
        </div>
      </div>
    </FlexWindowModal>
  );
};

export const WhyDialog = (props: IProps) => {
  const { isOpen, closeThisWindow } = props;
  return (
    <FlexWindowModal
      title={'Why'}
      height={400}
      width={500}
      isOpen={isOpen}
      onClose={closeThisWindow}
      provideCloseButton
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '90%%',
          marginLeft: '5%',
          marginRight: '5%',
        }}
      >
        <div style={{ marginTop: '.25rem' }}>Why Spotify95?</div>
        <hr style={{ width: '100%' }} />
        <div>
          The primary goal here was to build a version of Spotify that looked
          and behaved more like{' '}
          <Anchor target={'_blank'} href={'https://www.foobar2000.org/'}>
            Foobar2000
          </Anchor>
          .
        </div>
        <div>
          Less emphasis on an algorithm serving you one track after an another
          (A behavior spotify is pretty much constantly routing you to)
        </div>
        <div>
          More emphasis on having you queue up some albums and then not really
          touching the player.
        </div>
        <div>
          Browsing your favorite artists/albums/playlists with a tree is also
          the only sensible way to do it, everytime I see Spotify's left panel I
          think "why isn't this a tree?"
        </div>
      </div>
    </FlexWindowModal>
  );
};
