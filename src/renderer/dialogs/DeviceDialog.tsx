import { isNil } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Checkbox, Toolbar } from 'react95';
import { FlexWindowModal } from 'renderer/sdk/FlexWindowModal';
import Label from 'renderer/sdk/Label';
import { selectSpotify, setCurrentDevice } from 'renderer/state/store';

type IProps = {
  isOpen: boolean;
  closeThisWindow: () => void;
};

export const DeviceDialog = (props: IProps) => {
  const { isOpen, closeThisWindow } = props;
  const spotify = useSelector(selectSpotify);
  const [devices, setDevices] = useState<SpotifyApi.UserDevicesResponse>();
  const [selectedIndex, setSelectedIndex] = useState<number>();
  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(undefined);
      spotify.getMyDevices().then((devices) => setDevices(devices));
    }
  }, [spotify, isOpen]);

  const getDeviceComponent = useCallback(
    (
      index: number,
      selectedIndex: number | undefined,
      devices: SpotifyApi.UserDevicesResponse
    ) => {
      const device = devices.devices[index];
      return (
        <Toolbar key={index}>
          <Label>
            {device.type === 'Computer'
              ? '🖥️'
              : device.type === 'Smartphone'
              ? '📱'
              : device.type === 'Speaker'
              ? '🔊'
              : '?'}
          </Label>
          <Checkbox
            checked={index === selectedIndex}
            onClick={() => setSelectedIndex(index)}
          />
          <Label>{device.name}</Label>
          {device.is_active && <Label>[active]</Label>}
        </Toolbar>
      );
    },
    [setSelectedIndex]
  );

  return (
    <FlexWindowModal
      title={'Select Device'}
      height={
        !isNil(devices) && devices?.devices.length > 0
          ? 150 + 50 * devices.devices.length
          : 400
      }
      width={500}
      isOpen={isOpen}
      onClose={closeThisWindow}
      provideCloseButton
      bottomButtons={[
        {
          text: 'Cancel',
          onPress: () => {},
          closesWindow: true,
        },
        {
          text: 'Transfer Playback',
          onPress: () => {
            if (selectedIndex) {
              spotify.transferMyPlayback([
                devices?.devices[selectedIndex].id ?? '',
              ]);
              setCurrentDevice(devices?.devices[selectedIndex]);
            }
          },
          closesWindow: true,
          disabled: isNil(selectedIndex),
        },
      ]}
    >
      <div>After transfering playback, play any song.</div>
      <div>This feature is a work in progress and somewhat flaky.</div>
      {!isNil(devices) && devices?.devices.length > 0 ? (
        devices?.devices.map((d, i) => {
          return getDeviceComponent(i, selectedIndex, devices);
        })
      ) : (
        <div style={{ height: '4rem' }}>
          <div>No devices!</div>
          <div>--Is Spotify running?</div> <div>--Are you authenticated?</div>
        </div>
      )}
    </FlexWindowModal>
  );
};
