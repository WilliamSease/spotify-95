import { useSelector } from 'react-redux';
import { Frame, ScrollView } from 'react95';
import { selectPlayer, selectSpotify } from 'renderer/state/store';

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
        {player.playingItems.map((item) => {
          if (item.type === 'track') {
            return (
              <div style={{ marginLeft: '1rem' }}>{`🎵 ${
                item.name
              } ${item.artists.map((a) => a.name)}`}</div>
            );
          } else if (item.type === 'episode') {
            return (
              <div style={{ marginLeft: '1rem' }}>{`📝 ${item.name}`}</div>
            );
          }
        })}
      </ScrollView>
    </Frame>
  );
};
