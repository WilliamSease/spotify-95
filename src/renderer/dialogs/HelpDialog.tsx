import { Frame, ScrollView } from 'react95';
import { FlexWindowModal } from 'renderer/sdk/FlexWindowModal';

type IProps = {
  isOpen: boolean;
  closeThisWindow: () => void;
};

export const HelpDialog = (props: IProps) => {
  const { isOpen, closeThisWindow } = props;
  return (
    <FlexWindowModal
      title={'Help'}
      height={450}
      width={500}
      isOpen={isOpen}
      onClose={closeThisWindow}
      provideCloseButton
    >
      <Frame
        variant="field"
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          margin: 10,
        }}
      >
        <ScrollView style={{ height: 380 }}>
          <div style={{ marginTop: '.25rem' }}>Troubleshooting</div>
          <hr />
          <div style={{ fontWeight: 'bold' }}>
            I see a red "Desync" in the corner. Nothing is playing. Nothing
            happens when I try to play a track. There's a green checkmark in the
            "Auth" box in the top right, though.
          </div>
          <div>
            Open spotify and play anything. Once you see it appear in the
            Spotify95 player, you should be synced up. Hopefully I fix this in
            short order.
          </div>
          <hr />
          <div style={{ fontWeight: 'bold' }}>
            I see a red X in the "Auth" box
          </div>
          <div>
            Click it, see if your username is in the box. If it isn't, grab a
            new token.
          </div>
          <hr />
          <div style={{ fontWeight: 'bold' }}>
            Protip: You can set the spotify desktop app to minimize to system
            tray instead of closing.
          </div>
        </ScrollView>
      </Frame>
    </FlexWindowModal>
  );
};
