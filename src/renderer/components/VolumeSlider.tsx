import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Frame, Slider } from 'react95';
import { selectPlaybackState, selectSpotify } from 'renderer/state/store';

export const VolumeSlider = () => {
  const [isOpen, setIsOpen] = useState(false);
  const playbackState = useSelector(selectPlaybackState);
  const spotify = useSelector(selectSpotify)

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Button variant="thin" onClick={() => setIsOpen(!isOpen)} active={isOpen}>
        🔊
      </Button>
      {isOpen && (
        <Frame
          variant="outside"
          style={{ zIndex: 1, position: 'absolute', right: '0', top: '100%' }}
        >
          <Slider
            size="300px"
            defaultValue={playbackState?.device.volume_percent ?? 0}
            style={{ margin: 10 }}
            orientation="vertical"
            onChangeCommitted={(value) => spotify.setVolume(value)}
          />
        </Frame>
      )}
    </div>
  );
};
