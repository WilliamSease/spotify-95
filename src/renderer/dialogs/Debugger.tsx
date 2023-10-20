import { useCallback, useState } from 'react';
import { Button, GroupBox, WindowContent, Window } from 'react95';
import { isNil } from 'lodash';
import SpotifyWebApi from 'spotify-web-api-js';
import { Playable, TokenInfo } from '../representations/apiTypes';
import { FlexWindowModal } from 'renderer/conveniencesdk/FlexWindowModal';
import { useSelector } from 'react-redux';
import { selectSpotify } from 'renderer/state/store';

type IProps = {
  isOpen: boolean;
  onClose: () => void;
};

type queueResponse = {queue:Playable[]}

export const Debugger = (props: IProps) => {
    const {isOpen, onClose} = props;
    const spotify = useSelector(selectSpotify)

    const [playbackState, setPlaybackState] = useState<SpotifyApi.CurrentPlaybackResponse>();
    const [queueState, setQueueState] = useState<queueResponse>();
    console.log(queueState)

    const refresh = useCallback(async () => {
        setPlaybackState(await spotify.getMyCurrentPlaybackState());
        setQueueState(await spotify.getGeneric('https://api.spotify.com/v1/me/player/queue') as queueResponse)
    },[spotify])

  return (
    <FlexWindowModal
      title={'Debugger'}
      height={850}
      width={1200}
      isOpen={isOpen}
      onClose={onClose}
      provideCloseButton
      bottomButtons={[{text:"Refresh",onPress:refresh}]}
    >
        <GroupBox label='State of Playback'>
            {!isNil(playbackState) ?
            <>
            <div>device: {JSON.stringify(playbackState.device.id)}</div> 
            <div>is_playing: {JSON.stringify(playbackState.is_playing)}</div> 
            <div>item: {JSON.stringify(playbackState.item?.id)}</div> 
            <div>progress_ms: {JSON.stringify(playbackState.progress_ms)}</div>
            <div>repeat_state: {JSON.stringify(playbackState.repeat_state)}</div> 
            <div>shuffle_state: {JSON.stringify(playbackState.shuffle_state)}</div> 
            </>
            : null}
        </GroupBox>
        <GroupBox label='State of the Queue'>{!isNil(queueState) ? <>
        </> : null}</GroupBox>
    </FlexWindowModal>
  );
};
