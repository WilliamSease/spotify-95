import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Frame,
  Hourglass,
  ScrollView,
  Tab,
  TabBody,
  Tabs,
  TreeLeaf,
  TreeView,
} from 'react95';
import {
  addBearerTokenToRequest,
  populateLibrary,
} from 'renderer/functions/apiFunctions';
import {
  selectLibrary,
  selectSpotify,
  setAddDialog,
  setLibrary,
} from 'renderer/state/store';
import SpotifyWebApi from 'spotify-web-api-js';
import './LibraryTree.css';
import { cloneDeep, isNil } from 'lodash';

export const LibraryTree = (props: { token?: string }) => {
  const { token } = props;
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const spotify = useSelector(selectSpotify);
  const dispatch = useDispatch();
  const library = useSelector(selectLibrary);
  const [initialLoad, setInitialLoad] = useState(true);
  const [albumMap, setAlbumMap] = useState<Map<string, TreeLeaf<string>[]>>(
    new Map<string, TreeLeaf<string>[]>()
  );
  const [playlistMap, setPlaylistMap] = useState<
    Map<string, TreeLeaf<string>[]>
  >(new Map<string, TreeLeaf<string>[]>());
  const [lastLength, setLastLength] = useState(0);

  const libraryCallback = useCallback(
    (spotify: SpotifyWebApi.SpotifyWebApiJs) => {
      setLoading(true);
      populateLibrary(spotify).then((library) => {
        dispatch(setLibrary(library));
        setLoading(false);
      });
    },
    [setLoading, dispatch]
  );

  useEffect(() => {
    if (initialLoad && !isNil(token)) {
      libraryCallback(spotify);
      setInitialLoad(false);
    }
  }, [token, initialLoad, setInitialLoad]);

  const nodes = useMemo(() => {
    switch (activeTab) {
      case 0:
        return library?.artists.map((a) => {
          return {
            id: a.id,
            label: a.name,
            icon: <>👨</>,
            items: [
              {
                id: `${a.id}_topSongs_${a.name}`,
                label: 'Top Songs',
                icon: <>🎵</>,
              },
              {
                id: `${a.id}_allSongs_${a.name}`,
                label: 'All Songs',
                icon: <>🎵</>,
              },
              {
                id: `${a.id}_artistAlbums_${a.name}`,
                label: 'Albums',
                icon: <>💿</>,
                items: albumMap.has(a.id)
                  ? albumMap.get(a.id)
                  : [
                      {
                        id: `${a.id}_artistAlbums_placeholder`,
                        label: 'Loading...',
                        icon: <> ⏳</>,
                      },
                    ],
              },
              {
                id: `${a.id}_playlists_${a.name}`,
                label: 'Playlists',
                icon: <>📝</>,
                items: playlistMap.has(a.id)
                  ? playlistMap.get(a.id)
                  : [
                      {
                        id: `${a.id}_playlists_placeholder`,
                        label: 'Loading...',
                        icon: <> ⏳</>,
                      },
                    ],
              },
            ],
          };
        });
      case 1:
        return library?.albums.map((a) => {
          return { id: a.id, label: a.name, icon: <>💿</> };
        });
      case 2:
        return library?.shows.map((a) => {
          return { id: a.id, label: a.name, icon: <>📻</> };
        });
      case 3:
        return library?.playlists.map((a) => {
          return { id: a.id, label: a.name, icon: <>📝</> };
        });
    }
  }, [activeTab, library, albumMap, playlistMap]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <Tabs
          style={{ marginTop: 6, width: '80%' }}
          value={activeTab}
          onChange={setActiveTab}
        >
          <Tab value={0}>Artists</Tab>
          <Tab value={1}>Albums</Tab>
          <Tab value={2}>Shows</Tab>
          <Tab value={3}>Playlists</Tab>
          <span style={{ flexGrow: 1 }}></span>
        </Tabs>
        <Button
          variant="thin"
          style={{ width: '20%' }}
          onClick={() => libraryCallback(spotify)}
        >
          Refresh
        </Button>
      </div>
      <TabBody style={{ flexGrow: 1, display: 'flex' }}>
        <Frame variant="field" style={{ display: 'flex', flexGrow: 1 }}>
          <ScrollView
            style={{
              height: '100%',
              width: '100%',
              position: 'absolute',
              display: 'flex',
            }}
          >
            {loading ? (
              <div
                style={{
                  position: 'relative',
                  top: '50%',
                  left: '48%',
                  width: '50%',
                }}
              >
                <Hourglass size={16} />
              </div>
            ) : (
              <TreeView
                tree={nodes ?? []}
                onNodeSelect={(_e, id) => {
                  switch (activeTab) {
                    case 0:
                      const toSplit = id.split('_');
                      if (toSplit.length === 3) {
                        const [id, type, label] = toSplit;
                        if (
                          type === 'topSongs' ||
                          type === 'allSongs' ||
                          type === 'album' ||
                          type === 'playlist'
                        )
                          dispatch(
                            setAddDialog({
                              type: type,
                              id: id,
                              label: label,
                            })
                          );
                      }

                      break;
                    case 1:
                      dispatch(
                        setAddDialog({
                          type: 'album',
                          id: id,
                          label: nodes?.find((n) => n.id === id)?.label,
                        })
                      );
                      break;
                    case 2:
                      dispatch(
                        setAddDialog({
                          type: 'showEpisodes',
                          id: id,
                          label: nodes?.find((n) => n.id === id)?.label,
                        })
                      );
                      break;

                    case 3:
                      dispatch(
                        setAddDialog({
                          type: 'playlist',
                          id: id,
                          label: nodes?.find((n) => n.id === id)?.label,
                        })
                      );
                      break;
                  }
                }}
                onNodeToggle={async (e, nodes) => {
                  if (nodes.length > lastLength) {
                    const operatingOn = nodes[nodes.length - 1];
                    if (operatingOn.split('_').length == 3) {
                      const [id, type, label] = operatingOn.split('_');
                      if (type === 'artistAlbums') {
                        let items: SpotifyApi.AlbumObjectSimplified[] = [];
                        let albumResponse = await spotify.getArtistAlbums(id, {
                          limit: 50,
                        });
                        items.push(...albumResponse.items);
                        while (albumResponse.next) {
                          albumResponse = await addBearerTokenToRequest(
                            albumResponse.next,
                            spotify
                          );
                          items.push(...albumResponse.items);
                        }
                        setAlbumMap((prev) => {
                          const neu: Map<string, TreeLeaf<string>[]> =
                            cloneDeep(prev);
                          neu.set(
                            id,
                            items.map((a) => {
                              return {
                                id: `${a.id}_album_${a.name}`,
                                label: a.name,
                                icon: <>💿</>,
                              };
                            })
                          );
                          return neu;
                        });
                      }
                      if (type === 'playlists') {
                        let items: SpotifyApi.PlaylistObjectSimplified[] = [];
                        let playlistResponse = (
                          await spotify.searchPlaylists(`artist%20${label}`, {
                            limit: 50,
                          })
                        ).playlists;
                        items.push(...playlistResponse.items);
                        while (playlistResponse.next) {
                          playlistResponse = (
                            await addBearerTokenToRequest(
                              playlistResponse.next,
                              spotify
                            )
                          ).playlists;
                          items.push(...playlistResponse.items);
                        }
                        setPlaylistMap((prev) => {
                          const neu: Map<string, TreeLeaf<string>[]> =
                            cloneDeep(prev);
                          neu.set(
                            id,
                            items.map((a) => {
                              return {
                                id: `${a.id}_playlist_${a.name}`,
                                label: a.name,
                                icon: <>📝</>,
                              };
                            })
                          );
                          return neu;
                        });
                      }
                    }
                  }
                  setLastLength(nodes.length);
                }}
              />
            )}
          </ScrollView>
        </Frame>
      </TabBody>
    </div>
  );
};
