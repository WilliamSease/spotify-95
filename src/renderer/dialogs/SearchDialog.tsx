import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { FlexWindowModal } from 'renderer/conveniencesdk/FlexWindowModal';
import {
  selectSearchResult,
  selectSearchTerm,
  selectSpotify,
  setSearchResult,
} from 'renderer/state/store';
import {
  Button,
  Frame,
  Hourglass,
  ScrollView,
  Tab,
  Tabs,
  TextInput,
  Toolbar,
} from 'react95';
import { messages } from 'renderer/representations/messages';
import styled from 'styled-components';
import { List } from 'renderer/conveniencesdk/List';
import { appendToSearchResult } from 'renderer/functions';
import { isEmpty, isNil } from 'lodash';

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
  const [selected, setSelected] = useState<{ tab: Number; item: number }>();

  const runSearch = useCallback((search: string) => {
    setLoading(true);
    Promise.all([
      spotify.search(search, ['artist', 'album', 'track', 'playlist'], {
        limit: 50,
      }),
      spotify.searchShows(search, { limit: 50 }),
      spotify.searchEpisodes(search, { limit: 50 }),
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
        {
          text: 'Load More',
          disabled: loading,
          onPress: () => {
            if (!isNil(searchResult)) {
              setLoading(true);
              appendToSearchResult(spotify, searchResult, activeTab)
                .then((result) => dispatch(setSearchResult(result)))
                .catch(() => dispatch(setSearchResult(null)))
                .finally(() => setLoading(false));
            }
          },
        },
        {
          text: 'Append to current player',
          onPress: () => {},
          closesWindow: false,
        },
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
        <Button
          onClick={() => runSearch(searchTerm)}
          style={{ marginLeft: 4 }}
          disabled={isNil(searchTerm) || isEmpty(searchTerm)}
        >
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
        <ScrollView
          style={{
            height: '100%',
            width: '100%',
            position: 'absolute',
            display: 'flex',
          }}
        >
          {searchResult === null && <div>{messages.errorContactDev}</div>}
          {loading && (
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
          )}
          {!loading && activeTab === 0 && (
            <List
              items={searchResult?.music.artists?.items.map((v) => (
                <span>👨 {v.name}</span>
              ))}
              selected={selected?.tab === 0 ? selected.item : undefined}
              onSelect={(i) => setSelected({ tab: 0, item: i })}
            />
          )}
          {!loading && activeTab === 1 && (
            <List
              items={searchResult?.music.albums?.items.map((v) => (
                <span>💿 {v.name}</span>
              ))}
              selected={selected?.tab === 1 ? selected.item : undefined}
              onSelect={(i) => setSelected({ tab: 1, item: i })}
            />
          )}
          {!loading && activeTab === 2 && (
            <List
              items={searchResult?.music.tracks?.items.map((v) => (
                <span>🎵 {v.name}</span>
              ))}
              selected={selected?.tab === 2 ? selected.item : undefined}
              onSelect={(i) => setSelected({ tab: 2, item: i })}
            />
          )}
          {!loading && activeTab === 3 && (
            <List
              items={searchResult?.shows.shows?.items.map((v) => (
                <span>📻 {v.name}</span>
              ))}
              selected={selected?.tab === 3 ? selected.item : undefined}
              onSelect={(i) => setSelected({ tab: 3, item: i })}
            />
          )}
          {!loading && activeTab === 4 && (
            <List
              items={searchResult?.episodes.episodes?.items.map((v) => (
                <span>📻 {v.name}</span>
              ))}
              selected={selected?.tab === 4 ? selected.item : undefined}
              onSelect={(i) => setSelected({ tab: 4, item: i })}
            />
          )}
          {!loading && activeTab === 5 && (
            <List
              items={searchResult?.music.playlists?.items.map((v) => (
                <span>📝 {v.name}</span>
              ))}
              selected={selected?.tab === 5 ? selected.item : undefined}
              onSelect={(i) => setSelected({ tab: 5, item: i })}
            />
          )}
        </ScrollView>
      </Frame>
    </FlexWindowModal>
  );
};
