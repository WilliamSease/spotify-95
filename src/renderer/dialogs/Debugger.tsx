import { useCallback, useEffect, useState } from 'react';
import { Button, GroupBox, WindowContent, Window } from 'react95';
import { isNil } from 'lodash';
import SpotifyWebApi from 'spotify-web-api-js';
import { Playable, TokenInfo } from '../representations/apiTypes';
import { FlexWindowModal } from 'renderer/sdk/FlexWindowModal';
import { useSelector } from 'react-redux';
import { selectSpotify } from 'renderer/state/store';
import { useClock } from 'renderer/sdk/useClock';

type IProps = {
  isOpen: boolean;
  onClose: () => void;
};

type queueResponse = { queue: Playable[] };

export const Debugger = (props: IProps) => {
  const { isOpen, onClose } = props;
  const spotify = useSelector(selectSpotify);

  const [playbackState, setPlaybackState] =
    useState<SpotifyApi.CurrentPlaybackResponse>();
  const [queueState, setQueueState] = useState<queueResponse>();

  const refresh = useCallback(async () => {
    setPlaybackState(await spotify.getMyCurrentPlaybackState());
    setQueueState(
      (await spotify.getGeneric(
        'https://api.spotify.com/v1/me/player/queue'
      )) as queueResponse
    );
  }, [spotify]);

  useEffect(() => {
    if (isOpen) {
      refresh()
    }
  },[isOpen, refresh])

  const [timer, setTimer] = useState<number>(0);
  const [timerStack, setTimerStack] = useState<number[]>([]);
  useEffect(() => {
    setTimerStack((prev) => {
      prev.push(timer);
      if (prev.length > 2) prev.shift();
      return prev;
    });
  }, [timer]);

  useClock({
    effect: useCallback(async () => {
      setTimer(Date.now());
    }, [setTimer]),
    condition: true,
    delay: 17,
  });

  return (
    <FlexWindowModal
      title={'Debugger'}
      height={850}
      width={1200}
      isOpen={isOpen}
      onClose={onClose}
      provideCloseButton
      bottomButtons={[{ text: 'Refresh', onPress: refresh }]}
    >
      <GroupBox label="State of Playback">
        {!isNil(playbackState) ? (
          <>
            <div>device: {JSON.stringify(playbackState.device.id)}</div>
            <div>is_playing: {JSON.stringify(playbackState.is_playing)}</div>
            <div>item: {JSON.stringify(playbackState.item?.id)}</div>
            <div>progress_ms: {JSON.stringify(playbackState.progress_ms)}</div>
            <div>
              repeat_state: {JSON.stringify(playbackState.repeat_state)}
            </div>
            <div>
              shuffle_state: {JSON.stringify(playbackState.shuffle_state)}
            </div>
          </>
        ) : null}
      </GroupBox>
      <GroupBox label="State of the Queue">
        {!isNil(queueState) ? (
          <>
            {queueState.queue.map((playable) => (
              <div>{playable.name}</div>
            ))}
          </>
        ) : null}
      </GroupBox>
      <GroupBox label="Performance">
        <div>
          clock responds in {timerStack[1] - timerStack[0]} {'(target 17)'}
        </div>
      </GroupBox>
    </FlexWindowModal>
  );
};
