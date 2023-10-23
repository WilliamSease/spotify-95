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
        <Anchor target={'_blank'} href="https://react95.io/">React95</Anchor>
        <Anchor target={'_blank'} href="https://github.com/JMPerez/spotify-web-api-js">
          JS Spotify Web API
        </Anchor>
        <Anchor target={'_blank'} href="https://github.com/electron-react-boilerplate/electron-react-boilerplate">
          Electron React Boilerplate
        </Anchor>
      </div>
    </FlexWindowModal>
  );
};
