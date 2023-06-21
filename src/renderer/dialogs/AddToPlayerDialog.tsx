import { isNil } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Checkbox,
  Frame,
  Hourglass,
  ProgressBar,
  Radio,
  ScrollView,
  TextInput,
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
  const [filter, setFilter] = useState('');
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [items, setItems] = useState<
    | { type: 'episodes'; items: SpotifyApi.EpisodeObjectSimplified[] }
    | { type: 'playlistTracks'; items: SpotifyApi.PlaylistTrackObject[] }
    | { type: 'tracks'; items: SpotifyApi.TrackObjectSimplified[] }
  >();

  useEffect(() => {
    if (toAdd) {
      setCount(undefined);
      setLoaded(0)
      setItems(undefined)
      if (toAdd.type === 'topSongs') {
        spotify
          .getArtistTopTracks(toAdd.id, 'US',{limit:50})
          .then((result) =>  {setCount(result.tracks.length); setItems({type:"tracks", items:result.tracks}) });
      } else if (toAdd.type === 'album') {
        console.info("Hello")
        spotify
          .getAlbum(toAdd.id)
          .then(async (result) => {
            let total = result.tracks.total;
            let idx = 0;
            let out = [];

            while (idx < total) {
              out.push(...(await spotify.getAlbumTracks(toAdd.id, {limit:50, offset:idx})).items)
              idx += 50;
            }
          setItems({type:"tracks", items:out})
          setCount(out.length)
          });
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
            {
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
                    <Button style={{ width: '50%' }} onClick={async () => {
                                              let idx = range[0];
                                              let out = [];
                        while (idx < range[1]) {
                          if (toAdd.type === "showEpisodes") {
                          out.push( ... (await spotify.getShowEpisodes(toAdd.id,{offset:idx, limit: 50})).items);
                          } 
                          idx += 50;
                          setLoaded(out.length)
                        }
                      
                      if (toAdd.type === "showEpisodes") {
                        setItems({type:"episodes", items:out as SpotifyApi.EpisodeObjectSimplified[]})
                      } 
                    }}>Load Items</Button>
                    <span style={{ flexGrow: 1, marginLeft: '1rem' }}>
                      <span>
                        {loaded} / {range[1] - range[0]}
                      </span>
                    </span>
                  </div>
                  <Checkbox label={'Select All'} checked={selectAll} onClick={() => setSelectAll(!selectAll)}/>
                </div>
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginTop: 5,
                    alignItems: 'center',
                  }}
                >
                  <Label
                    style={{ width: '50%' }}
                  >{`Adding ${count} items from ${toAdd?.label}`}</Label>
                  <TextInput
                    value={filter}
                    placeholder="filter..."
                    onChange={(e) => setFilter(e.target.value)}
                    style={{ width: '50%' }}
                  />
                </div>
                <Checkbox label={'Select All'} />
              </>
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
                >
                  {(items?.type === "tracks" || items?.type === 'episodes') && items?.items.map((itm,i) => {
                    return (itm.name.includes(filter) ? <div><Checkbox/>{items.type === "tracks" ? '🎵' : '📝' } {itm.name}</div> : <></>)
                  })}
                  {items?.type === "episodes" && items?.items.map((epi,i) => {
                    return (epi.name.includes(filter) ? <div><Checkbox/>📝 {epi.name}</div> : <></>)
                  })}
                </ScrollView>
              </Frame>
            </div>
          </div>
        )}
      </div>
    </FlexWindowModal>
  );
};
