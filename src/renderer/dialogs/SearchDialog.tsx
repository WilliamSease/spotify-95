import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { FlexWindowModal } from 'renderer/conveniencesdk/FlexWindowModal';
import {
  selectSearchResult,
  selectSearchTerm,
  selectSpotify,
  setSearchResult,
} from 'renderer/state/store';
import { Button, Frame, Tab, Tabs, TextInput, Toolbar } from 'react95';
import { messages } from 'renderer/representations/messages';

type IProps = {
  isOpen: boolean;
  closeThisWindow: () => void;
};

export const SearchDialog = (props: IProps) => {
  const { isOpen, closeThisWindow } = props;
  const dispatch = useDispatch();
  const loadSearchTerm = useSelector(selectSearchTerm);
  const spotify = useSelector(selectSpotify);
  const searchResult = useSelector(selectSearchResult);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const runSearch = useCallback((search: string) => {
    setLoading(true);
    Promise.all([
      spotify.search(search, ['artist', 'album', 'track', 'playlist']),
      spotify.searchShows(search),
      spotify.searchEpisodes(search),
    ])
      .then((result) =>
        dispatch(
          setSearchResult({
            music: result[0],
            shows: result[1],
            episodes: result[2],
          })
        )
      )
      .catch(() => {
        dispatch(setSearchResult(null));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm(loadSearchTerm);
      setActiveTab(0);
      if (loadSearchTerm !== '') {
        runSearch(loadSearchTerm);
      }
    }
  }, [isOpen]);

  return (
    <FlexWindowModal
      title="Search"
      isOpen={isOpen}
      onClose={closeThisWindow}
      height={700}
      width={600}
      bottomButtons={[
        { text: 'Append to current', onPress: () => {}, closesWindow: true },
        { text: 'Select only this', onPress: () => {}, closesWindow: true },
      ]}
      provideCloseButton
    >
      <Toolbar style={{ marginTop: '1rem' }}>
        <TextInput
          value={searchTerm}
          placeholder="Search"
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%' }}
        />
        <Button onClick={() => runSearch(searchTerm)} style={{ marginLeft: 4 }}>
          🔎
        </Button>
      </Toolbar>
      <Tabs value={activeTab} onChange={setActiveTab} style={{ marginLeft: 3 }}>
        <Tab value={0}>Artists</Tab>
        <Tab value={1}>Albums</Tab>
        <Tab value={2}>Songs</Tab>
        <Tab value={3}>Shows</Tab>
        <Tab value={4}>Episodes</Tab>
        <Tab value={5}>Playlists</Tab>
      </Tabs>
      <Frame
        variant="field"
        style={{
          height: '100%',
          margin: 5,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {searchResult === null && <div>{messages.errorContactDev}</div>}
        {loading && (
          <div
            style={{
              placeContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flexGrow: 1,
            }}
          >
            ⏳
          </div>
        )}
        {!loading && activeTab === 0 && (
          <div style={{ height: '100%' }}>
            {searchResult?.music.tracks?.items.map((v) => {
              return <div>{v.name}</div>;
            })}
          </div>
        )}
      </Frame>
    </FlexWindowModal>
  );
};
