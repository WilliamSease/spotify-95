import { useDispatch, useSelector } from 'react-redux';
import { Button, Frame, ScrollView, Toolbar } from 'react95';
import {
  selectNowPlaying,
  selectPlayerView,
  selectSpotify,
  selectTracksInPlayer,
  setNowPlaying,
} from 'renderer/state/store';
import { formatArtists, formatMs } from 'renderer/functions/formatFunctions';
import { AlternateGrey } from 'renderer/conveniencesdk/ThemedComponents';
import { FlexColumn } from 'renderer/sdk/FlexElements';
import { useCallback, useState } from 'react';
import Label from 'renderer/sdk/Label';
import { isNil } from 'lodash';
import { Playable } from 'renderer/representations/apiTypes';

export function PlayerList() {
  const dispatch = useDispatch();

  const tracksInPlayer = useSelector(selectTracksInPlayer);
  const spotify = useSelector(selectSpotify);
  const playerView = useSelector(selectPlayerView);
  const nowPlaying = useSelector(selectNowPlaying);

  const [highlighted, setHighlighted] = useState<number>(0);
  const compileTrackInfo = useCallback(
    (item: Playable) =>
      item.type === 'track'
        ? [`${formatArtists(item.artists)}`, `${item.album.name}`]
        : [item.show.name],
    []
  );

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
            const compiledTrackInfo = compileTrackInfo(itm);
            return (
              <>
                {playerView === 'individual' && (
                  <AlternateGrey
                    index={i}
                    isSelected={i === highlighted}
                    onClick={() => {
                      if (i === highlighted) {
                        dispatch(
                          setNowPlaying({
                            index: i,
                            current: tracksInPlayer[i],
                          })
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
                        {compileTrackInfo(itm).map((s, i) =>
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
                )}
                {playerView === 'group' && (
                  <>
                    {(i === 0 ||
                      JSON.stringify(
                        compileTrackInfo(tracksInPlayer[i - 1])
                      ) !== JSON.stringify(compileTrackInfo(itm))) && (
                      <div>
                        <Label>{`${compiledTrackInfo[0]} ${
                          itm.type === 'track'
                            ? `/ ${compiledTrackInfo[1]}`
                            : ``
                        }`}</Label>
                      </div>
                    )}
                    <AlternateGrey
                      index={1}
                      isSelected={i === highlighted}
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginLeft: '2rem',
                      }}
                      onClick={() => {
                        if (i === highlighted) {
                          dispatch(
                            setNowPlaying({
                              index: i,
                              current: tracksInPlayer[i],
                            })
                          );
                        }
                        setHighlighted(i);
                      }}
                    >
                      <div style={{ width: '3rem' }}>
                        {formatMs(itm.duration_ms)}
                      </div>
                      <div style={{ width: '2rem' }}>
                        {itm.type === 'track' ? '🎵' : '📝'}
                      </div>
                      <div style={{ width: '43rem' }}>{itm.name}</div>
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
                    </AlternateGrey>
                  </>
                )}
              </>
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
                <Label style={{ marginLeft: '1rem' }}>Album:</Label>
                <span>{nowPlaying.current.album.name}</span>
              </>
            )}
            <Label style={{ marginLeft: '1rem' }}>Name:</Label>
            <span>{nowPlaying.current.name}</span>
          </>
        )}
      </Toolbar>
      <Toolbar style={{ marginLeft: '1rem' }}>
        <Button className="toolbarButton">⏵</Button>
        <Button className="toolbarButton">⏸</Button>
        <Button className="toolbarButton">⏹</Button>
        <Button className="toolbarButton">⏏</Button>
        <Button className="toolbarButton">⏮</Button>
        <Button className="toolbarButton">⏭</Button>
        <Button className="toolbarButton">Repeat</Button>
        <Button className="toolbarButton">Shuffle</Button>
        <Button className="toolbarButton">⏴ 15s</Button>
        <Button className="toolbarButton">15s ⏵</Button>
        <span style={{ marginLeft: '1rem' }}>someTime / runTime</span>
      </Toolbar>
    </FlexColumn>
  );
}
