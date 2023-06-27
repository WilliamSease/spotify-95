import { useDispatch, useSelector } from 'react-redux';
import { Frame, ScrollView, Toolbar } from 'react95';
import {
  selectNowPlaying,
  selectSpotify,
  selectTracksInPlayer,
  setNowPlaying,
} from 'renderer/state/store';
import { formatArtists, formatMs } from 'renderer/functions/formatFunctions';
import { AlternateGrey } from 'renderer/conveniencesdk/ThemedComponents';
import { FlexColumn } from 'renderer/sdk/FlexElements';
import { useMemo, useState } from 'react';
import Label from 'renderer/sdk/Label';
import { Playable } from 'renderer/representations/apiTypes';
import { isNil } from 'lodash';

export const PlayerList = () => {
  const dispatch = useDispatch();

  const tracksInPlayer = useSelector(selectTracksInPlayer);
  const spotify = useSelector(selectSpotify);
  const nowPlaying = useSelector(selectNowPlaying);

  const [highlighted, setHighlighted] = useState<number>(0);
  return (
    <FlexColumn style={{ flexGrow: 1 }}>
      <Frame variant="field" style={{ flexGrow: 1 }}>
        <ScrollView
          style={{
            height: '100%',
            width: '100%',
            position: 'absolute',
            display: 'flex',
          }}
        >
          {tracksInPlayer.map((itm, i) => {
            const compiledTrackInfo =
              itm.type === 'track'
                ? [`${formatArtists(itm.artists)}`, `${itm.album.name}`]
                : [itm.show.name];
            return (
              <AlternateGrey
                index={i}
                isSelected={i === highlighted}
                onClick={() => {
                  if (i === highlighted) {
                    dispatch(
                      setNowPlaying({ index: i, current: tracksInPlayer[i] })
                    );
                  }
                  setHighlighted(i);
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
                  <div style={{ width: '3rem' }}>
                    {formatMs(itm.duration_ms)}
                  </div>
                  <div style={{ width: '2rem' }}>
                    {itm.type === 'track' ? '🎵' : '📝'}
                  </div>
                  <div style={{ width: '25rem' }}>{itm.name}</div>
                  <div style={{ width: '20rem' }}>
                    {compiledTrackInfo.map((s, i) =>
                      i % 2 === 0 ? <Label>{s}</Label> : <div>{s}</div>
                    )}
                  </div>
                  <div
                    style={{
                      width: '2rem',
                      justifyContent: 'center',
                      alignItems: 'center',
                      display: 'flex',
                    }}
                  >
                    {nowPlaying?.index === i ? '💿' : ''}
                  </div>
                </div>
              </AlternateGrey>
            );
          })}
        </ScrollView>
      </Frame>
      <Toolbar style={{ justifyItems: 'center' }}>
        {isNil(nowPlaying) ? (
          `[Nothing Playing]`
        ) : (
          <>
            <Label style={{ marginLeft: '1rem' }}>
              {nowPlaying.current.type === 'track' ? `Artist: ` : `Show: `}
            </Label>
            <span>
              {nowPlaying.current.type === 'track'
                ? formatArtists(nowPlaying.current.artists)
                : nowPlaying.current.show.name}
            </span>
            {nowPlaying.current.type === 'track' && (
              <>
                <Label style={{ marginLeft: '1rem' }}>{`Album:`}</Label>
                <span>{nowPlaying.current.album.name}</span>
              </>
            )}
            <Label style={{ marginLeft: '1rem' }}>{`Name:`}</Label>
            <span>{nowPlaying.current.name}</span>
          </>
        )}
      </Toolbar>
      <Toolbar style={{ marginLeft: '1rem' }}>
        There will be player buttons here soon.
      </Toolbar>
    </FlexColumn>
  );
};
