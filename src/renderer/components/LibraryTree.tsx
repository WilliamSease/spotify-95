import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Frame,
  Hourglass,
  ScrollView,
  Tab,
  TabBody,
  Tabs,
  TreeView,
} from 'react95';
import { populateLibrary } from 'renderer/functions/apiFunctions';
import {
  selectLibrary,
  selectSpotify,
  setAddDialog,
  setLibrary,
} from 'renderer/state/store';
import SpotifyWebApi from 'spotify-web-api-js';
import './LibraryTree.css';

export const LibraryTree = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const spotify = useSelector(selectSpotify);
  const dispatch = useDispatch();
  const library = useSelector(selectLibrary);

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

  const nodes = useMemo(() => {
    switch (activeTab) {
      case 0:
        return library?.artists.map((a) => {
          return {
            id: a.id,
            label: a.name,
            icon: <>👨</>,
            items: [
              { id: `${a.id}_topSongs`, label: 'Top Songs', icon: <>🎵</> },
              { id: `${a.id}_artistAlbums`, label: 'Albums', icon: <>💿</> },
              { id: `${a.id}_playlists`, label: 'Playlists', icon: <>📝</> },
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
  }, [activeTab, library]);

  return (
    <div
      className="fullsize"
      style={{ display: 'flex', flexDirection: 'column' }}
    >
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
                      if (toSplit.length === 2) {
                        const [id, type] = toSplit;
                        dispatch(
                          setAddDialog({
                            type: type,
                            id: id,
                            label: nodes?.find((n) => n.id === id)?.label,
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
              />
            )}
          </ScrollView>
        </Frame>
      </TabBody>
    </div>
  );
};
