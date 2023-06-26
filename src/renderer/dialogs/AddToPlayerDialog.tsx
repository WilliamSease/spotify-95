import { cloneDeep, isNil } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { WindowShade } from 'renderer/sdk/WindowShade';
import {
  appendToPlayer,
  selectAddToDialog,
  selectSpotify,
  setAddDialog,
  setToPlayer,
} from 'renderer/state/store';

export const AddToPlayerDialog = () => {
  const toAdd = useSelector(selectAddToDialog);
  const spotify = useSelector(selectSpotify);
  const dispatch = useDispatch();
  const [count, setCount] = useState<number>();
  const [loaded, setLoaded] = useState<number>(0);
  const [range, setRange] = useState<[number, number]>([0, 0]);
  const [filter, setFilter] = useState('');
  const [selectAll, setSelectAll] = useState<boolean>(false);

  const [items, setItems] =
    useState<(SpotifyApi.EpisodeObjectFull | SpotifyApi.TrackObjectFull)[]>();
  const [checkedArray, setCheckedArray] = useState<boolean[]>([]);
  const modifyCheck = useCallback(
    (to: number) =>
      setCheckedArray((prev) => {
        prev[to] = !prev[to];
        return cloneDeep(prev);
      }),
    [setCheckedArray]
  );
  useEffect(
    () => setCheckedArray(items?.map(() => false) ?? []),
    [setCheckedArray, items]
  );

  const selectedItems = useMemo(
    () =>
      items
        ?.filter((_itm, i) => checkedArray[i] || selectAll)
        .filter(
          (itm) =>
            !isNil(itm) && itm.name.toUpperCase().includes(filter.toUpperCase())
        ),
    [items, checkedArray, selectAll]
  );

  useEffect(() => {
    if (toAdd) {
      setCount(undefined);
      setLoaded(0);
      setItems(undefined);
      if (toAdd.type === 'topSongs') {
        spotify
          .getArtistTopTracks(toAdd.id, 'US', { limit: 50 })
          .then((result) => {
            setCount(result.tracks.length);
            setItems(result.tracks);
          });
      } else if (toAdd.type === 'album') {
        spotify.getAlbum(toAdd.id).then(async (result) => {
          let total = result.tracks.total;
          let idx = 0;
          let out = [];

          while (idx < total) {
            const ids = (
              await spotify.getAlbumTracks(toAdd.id, {
                limit: 50,
                offset: idx,
              })
            ).items.map((i) => i.id);

            out.push(...(await spotify.getTracks(ids)).tracks);
            idx += 50;
          }
          setItems(out);
          setCount(out.length);
        });
      } else if (toAdd.type === 'showEpisodes') {
        spotify.getShowEpisodes(toAdd.id).then((result) => {
          setCount(result.total);
          setRange([0, result.total]);
        });
      } else if (toAdd.type === 'playlist') {
        spotify.getPlaylistTracks(toAdd.id).then((result) => {
          setCount(result.total);
          if (result.total > 50) {
            setRange([0, result.total]);
          } else {
            setItems(result.items.map((t) => t.track));
          }
        });
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
      endLabel={`${selectedItems?.length ?? 0} item(s) selected`}
      bottomButtons={[
        {
          text: 'Append to current player',
          onPress: () => {
            dispatch(appendToPlayer(selectedItems));
          },
          closesWindow: true,
        },
        {
          text: 'Select only these item(s)',
          onPress: () => {
            dispatch(setToPlayer(selectedItems));
          },
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
            {(toAdd?.type === 'playlist' || toAdd?.type === 'showEpisodes') &&
            count > 50 ? (
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
                  <Checkbox
                    label={'Select All'}
                    checked={selectAll}
                    onClick={() => setSelectAll(!selectAll)}
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
                      marginTop: '1rem',
                      alignItems: 'center',
                    }}
                  >
                    <Button
                      style={{ width: '30%' }}
                      onClick={async () => {
                        let idx = range[0];
                        let out = [];
                        while (idx < range[1]) {
                          if (toAdd.type === 'showEpisodes') {
                            const ids = (
                              await spotify.getShowEpisodes(toAdd.id, {
                                offset: idx,
                                limit: 50,
                              })
                            ).items.map((i) => i.id);
                            out.push(
                              ...(await spotify.getEpisodes(ids)).episodes
                            );
                          } else if (toAdd.type === 'playlist') {
                            const ids = (
                              await spotify.getPlaylistTracks(toAdd.id, {
                                offset: idx,
                                limit: 50,
                              })
                            ).items.map((i) => i.track.id);
                            out.push(...(await spotify.getTracks(ids)).tracks);
                          }
                          idx += 50;
                          setLoaded(out.length);
                        }

                        setItems(out);
                      }}
                    >
                      Load Items
                    </Button>
                    <span style={{ flexGrow: 1, marginLeft: '.5rem' }}>
                      <span>
                        {loaded} / {range[1] - range[0]}
                      </span>
                    </span>
                    <TextInput
                      value={filter}
                      placeholder="filter..."
                      onChange={(e) => setFilter(e.target.value)}
                      style={{ flexGrow: 1 }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginTop: '1rem',
                    marginLeft: '1rem',
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
                <Checkbox
                  style={{ marginLeft: '1rem' }}
                  label={'Select All'}
                  checked={selectAll}
                  onClick={() => setSelectAll(!selectAll)}
                />
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
                  {items?.map((itm, i) => {
                    return !isNil(itm) &&
                      itm.name.toUpperCase().includes(filter.toUpperCase()) ? (
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
                          onClick={() => modifyCheck(i)}
                        >
                          <div style={{ width: '10%' }}>
                            <Checkbox
                              checked={checkedArray[i] || selectAll}
                              onClick={() => modifyCheck(i)}
                            />
                            {itm.type === 'track' ? '🎵' : '📝'}
                          </div>
                          <div style={{ width: '45%' }}>{itm.name}</div>
                          <div style={{ width: '45%' }}>
                            {itm.type === 'track'
                              ? itm.artists.map((a) => a.name).join(', ')
                              : !isNil(itm.show)
                              ? itm.show.name
                              : ''}
                          </div>
                        </div>
                        {itm.type === 'episode' && itm.description && (
                          <WindowShade>{itm.description}</WindowShade>
                        )}
                      </div>
                    ) : (
                      <></>
                    );
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
