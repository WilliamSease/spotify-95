import { useSelector } from 'react-redux';
import { Frame, ScrollView } from 'react95';
import { selectPlayer, selectSpotify } from 'renderer/state/store';
import { formatMs } from 'renderer/functions/formatFunctions';

export const PlayerList = () => {
  const player = useSelector(selectPlayer);
  const spotify = useSelector(selectSpotify);

  return (
    <Frame variant="field" style={{ flexGrow: 1 }}>
      <ScrollView
        style={{
          height: '100%',
          width: '100%',
          position: 'absolute',
          display: 'flex',
        }}
      >
        {player.playingItems.map((itm, i) => {
          return (
            <div
              style={{
                backgroundColor: i % 2 == 0 ? 'white' : 'lightgray',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                <div style={{ width: '3rem' }}>{formatMs(itm.duration_ms)}</div>
                <div style={{ width: '2rem' }}>
                  {itm.type === 'track' ? '🎵' : '📝'}
                </div>
                <div style={{ flexGrow: 1 }}>{itm.name}</div>
                <div style={{ width: '20rem' }}>
                  {itm.type === 'track'
                    ? `${itm.artists.map((a) => a.name).join(', ')} / ${
                        itm.album.name
                      }`
                    : itm.show.name}
                </div>
              </div>
            </div>
          );
        })}
      </ScrollView>
    </Frame>
  );
};
