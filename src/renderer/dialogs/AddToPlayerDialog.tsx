import { isNil } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Frame,
  Hourglass,
  ProgressBar,
  Radio,
  ScrollView,
} from 'react95';
import { FlexWindowModal } from 'renderer/conveniencesdk/FlexWindowModal';
import Label from 'renderer/sdk/Label';
import { addToDialog, selectSpotify, setAddDialog } from 'renderer/state/store';

export const AddToPlayerDialog = () => {
  const toAdd = useSelector(addToDialog);
  const spotify = useSelector(selectSpotify);
  const dispatch = useDispatch();
  const [count, setCount] = useState<number>();
  const [loaded, setLoaded] = useState<number>(0);
  const [range, setRange] = useState<[number, number]>([0, 0]);
  const [items, setItems] =
    useState<
      (SpotifyApi.EpisodeObjectSimplified | SpotifyApi.PlaylistTrackObject)[]
    >();

  useEffect(() => {
    if (toAdd) {
      setCount(undefined);
      if (toAdd.type === 'artistAlbums') {
        spotify
          .getArtistAlbums(toAdd.id)
          .then((result) => setCount(result.total));
      } else if (toAdd.type === 'artistPlaylists') {
      } else if (toAdd.type === 'artistTopTracks') {
        spotify
          .getArtistTopTracks(toAdd.id, 'US')
          .then((result) => setCount(result.tracks.length));
      } else if (toAdd.type === 'album') {
        spotify
          .getAlbum(toAdd.id)
          .then((result) => setCount(result.tracks.total));
      } else if (toAdd.type === 'showEpisodes') {
        spotify.getShowEpisodes(toAdd.id).then((result) => {
          setCount(result.total);
          setRange([0, result.total]);
        });
      } else if (toAdd.type === 'playlist') {
        spotify
          .getPlaylistTracks(toAdd.id)
          .then((result) => setCount(result.total));
      }
    }
  }, [toAdd]);

  return (
    <FlexWindowModal
      title={'Add Dialog'}
      height={800}
      width={800}
      isOpen={!isNil(toAdd)}
      onClose={() => dispatch(setAddDialog(undefined))}
      provideCloseButton
      bottomButtons={[
        {
          text: 'Append to current player',
          onPress: () => {},
          closesWindow: false,
        },
        {
          text: 'Select only these item(s)',
          onPress: () => {},
          closesWindow: true,
        },
      ]}
    >
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {isNil(count) ? (
          <Hourglass
            style={{ position: 'absolute', top: '50%', right: '50%' }}
            size={32}
          />
        ) : (
          <div
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            {toAdd?.type === 'artistAlbums' ||
            toAdd?.type === 'artistPlaylists' ||
            toAdd?.type === 'playlist' ||
            toAdd?.type === 'showEpisodes' ? (
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '50%',
                    marginLeft: '1rem',
                  }}
                >
                  <Label>{`Adding ${toAdd?.label}`}</Label>

                  <Radio
                    checked={range[0] === 0 && range[1] === count}
                    onChange={() => setRange([0, count])}
                    label={`Query all ${count} items`}
                  />
                  <Radio
                    checked={range[0] !== 0 || range[1] !== count}
                    onChange={() => setRange([0, 100])}
                    label={`Query items 0 to 100`}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '50%',
                    margin: 5,
                  }}
                >
                  <ProgressBar
                    variant="tile"
                    value={(loaded / range[1] - range[0]) * 100}
                  />
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      marginTop: 5,
                      alignItems: 'center',
                    }}
                  >
                    <Button style={{ width: '50%' }}>Load Items</Button>
                    <span style={{ flexGrow: 1, marginLeft: '1rem' }}>
                      <span>
                        {loaded} / {range[1] - range[0]}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <Label>{`Adding ${count} items from ${toAdd?.label}`}</Label>
            )}
            <div style={{ flexGrow: 1 }}>
              <Frame
                variant="field"
                style={{
                  height: '100%',
                  margin: 5,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <ScrollView
                  style={{
                    height: '100%',
                    width: '100%',
                    position: 'absolute',
                    display: 'flex',
                  }}
                ></ScrollView>
              </Frame>
            </div>
          </div>
        )}
      </div>
    </FlexWindowModal>
  );
};
