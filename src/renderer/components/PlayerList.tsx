import { Anchor, Frame, ScrollView } from 'react95';
import Label from 'renderer/sdk/Label';

type ListType = {
  artistName: string;
  albumName: string;
  tracks: {
    trackName: string;
  }[];
}[];

export const PlayerList = () => {
  const mockData: ListType = [
    {
      artistName: 'Mock Artist 1',
      albumName: 'Mock Album 1',
      tracks: Array.from({ length: 5 }, (_, i) => i + 1).map((n) => {
        return { trackName: `Mock track ${n}` };
      }),
    },
    {
      artistName: 'Mock Artist 2',
      albumName: 'Mock Album 2',
      tracks: Array.from({ length: 50 }, (_, i) => i + 1).map((n) => {
        return { trackName: `Mock track ${n}` };
      }),
    },
  ];

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
        {mockData.map((data) => (
          <>
            <Label>{`${data.artistName} / ${data.albumName}`}</Label>
            {data.tracks.map((track) => (
              <div
                style={{ marginLeft: '1rem' }}
              >{`🎵 ${track.trackName}`}</div>
            ))}
          </>
        ))}
      </ScrollView>
    </Frame>
  );
};
