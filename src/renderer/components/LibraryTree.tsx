import { useMemo, useState } from 'react';
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
import { populateLibrary } from 'renderer/functions';
import { selectLibrary, selectSpotify, setLibrary } from 'renderer/state/store';

export const LibraryTree = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const spotify = useSelector(selectSpotify);
  const dispatch = useDispatch();
  const library = useSelector(selectLibrary);

  const nodes = useMemo(() => {
    switch (activeTab) {
      case 0:
        return library?.artists.map((a, i) => {
          return { id: i, label: a.name, icon: <>👨</> };
        });
      case 1:
        return library?.albums.map((a, i) => {
          return { id: i, label: a.name, icon: <>💿</> };
        });
      case 2:
        return library?.shows.map((a, i) => {
          return { id: i, label: a.name, icon: <>📻</> };
        });
      case 3:
        return library?.playlists.map((a, i) => {
          return { id: i, label: a.name, icon: <>📝</> };
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
          onClick={() => {
            setLoading(true);
            populateLibrary(spotify).then((library) => {
              dispatch(setLibrary(library));
              setLoading(false);
            });
          }}
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
              <TreeView tree={nodes ?? []} />
            )}
          </ScrollView>
        </Frame>
      </TabBody>
    </div>
  );
};
