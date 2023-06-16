import { useState } from 'react';
import { Button, Frame, Slider } from 'react95';

export const VolumeSlider = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Button variant="thin" onClick={() => setIsOpen(!isOpen)} active={isOpen}>
        Vol
      </Button>
      {isOpen && (
        <Frame
          variant="outside"
          style={{ zIndex: 1, position: 'absolute', right: '0', top: '100%' }}
        >
          <Slider
            size="300px"
            defaultValue={30}
            style={{ margin: 10 }}
            orientation="vertical"
          />
        </Frame>
      )}
    </div>
  );
};
