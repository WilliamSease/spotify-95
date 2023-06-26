import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BottomButton,
  FlexWindowModal,
} from 'renderer/conveniencesdk/FlexWindowModal';
import {
  appendToPlayer,
  selectSearchResult,
  selectSearchTerm,
  selectSpotify,
  setAddDialog,
  setSearchResult,
  setToPlayer,
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
import { List } from 'renderer/conveniencesdk/List';
import { appendToSearchResult } from 'renderer/functions/apiFunctions';
import { isEmpty, isNil } from 'lodash';
import { current } from '@reduxjs/toolkit';

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
  const [storedSearchTerm, setStoredSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [selected, setSelected] = useState<{ tab: Number; item: number }>();

  const runSearch = useCallback(
    async (search: string) => {
      setLoading(true);
      setStoredSearchTerm(search);
      dispatch(
        setSearchResult(
          await appendToSearchResult(
            spotify,
            search,
            {
              artists: [],
              albums: [],
              tracks: [],
              shows: [],
              episodes: [],
              playlists: [],
            },
            'ALL'
          )
        )
      );
      setLoading(false);
    },
    [setSearchResult, dispatch, setLoading, setStoredSearchTerm]
  );

  useEffect(() => {
    if (isOpen) {
      setSearchTerm(loadSearchTerm);
      setActiveTab(0);
      if (loadSearchTerm !== '') {
        runSearch(loadSearchTerm);
      }
    }
  }, [isOpen]);

  const loadMoreButton: BottomButton = useMemo(() => {
    return {
      text: 'Load More',
      disabled: loading,
      onPress: async () => {
        if (!isNil(searchResult)) {
          setLoading(true);
          dispatch(
            setSearchResult(
              await appendToSearchResult(
                spotify,
                storedSearchTerm,
                searchResult,
                activeTab
              )
            )
          );
          setLoading(false);
        }
      },
      closesWindow: false,
    };
  }, []);

  const addToPlayerButtons: BottomButton[] = useMemo(() => {
    const process = (type: 'append' | 'open') => {
      if (activeTab === 2 && selected?.tab === 2) {
        const item = searchResult.tracks[selected.item];
        dispatch(type === 'append' ? appendToPlayer(item) : setToPlayer(item));
      }
      if (activeTab === 4 && selected?.tab === 4) {
        const item = searchResult.episodes[selected.item];
        dispatch(type === 'append' ? appendToPlayer(item) : setToPlayer(item));
      }
    };
    return [
      {
        text: 'Append to current player',
        disabled: false,
        onPress: async () => process('append'),
        closesWindow: true,
      },
      {
        text: 'Select only these item(s)',
        disabled: false,
        onPress: async () => process('open'),
        closesWindow: true,
      },
    ];
  }, []);

  const openButtons: BottomButton[] = useMemo(
    () => [
      {
        text: 'Open',
        disabled: false,
        onPress: async () => {
          if (activeTab === 0) {
          } else if (activeTab === 1) {
            const item =
              selected?.tab === 1
                ? searchResult.albums[selected.item]
                : undefined;
            if (!isNil(item)) {
              dispatch(
                setAddDialog({
                  type: 'album',
                  id: item.id,
                  label: item.name,
                })
              );
            }
          } else if (activeTab === 3) {
            const item =
              selected?.tab === 3
                ? searchResult.shows[selected.item]
                : undefined;
            if (!isNil(item)) {
              dispatch(
                setAddDialog({
                  type: 'showEpisodes',
                  id: item.id,
                  label: item.name,
                })
              );
            }
          } else if (activeTab === 5) {
            const item =
              selected?.tab === 5
                ? searchResult.playlists[selected.item]
                : undefined;
            if (!isNil(item)) {
              dispatch(
                setAddDialog({
                  type: 'playlist',
                  id: item.id,
                  label: item.name,
                })
              );
            }
          }
        },
        closesWindow: false,
      },
    ],
    [activeTab, selected, searchResult]
  );

  return (
    <FlexWindowModal
      title="Search"
      isOpen={isOpen}
      onClose={closeThisWindow}
      height={700}
      width={600}
      bottomButtons={[loadMoreButton].concat(
        ...(activeTab === 2 || activeTab === 4
          ? addToPlayerButtons
          : openButtons)
      )}
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
              items={searchResult?.artists.map((v) => (
                <span>👨 {v.name}</span>
              ))}
              selected={selected?.tab === 0 ? selected.item : undefined}
              onSelect={(i) => setSelected({ tab: 0, item: i })}
            />
          )}
          {!loading && activeTab === 1 && (
            <List
              items={searchResult.albums.map((v) => (
                <span>💿 {v.name}</span>
              ))}
              selected={selected?.tab === 1 ? selected.item : undefined}
              onSelect={(i) => setSelected({ tab: 1, item: i })}
            />
          )}
          {!loading && activeTab === 2 && (
            <List
              items={searchResult.tracks.map((v) => (
                <span>🎵 {v.name}</span>
              ))}
              selected={selected?.tab === 2 ? selected.item : undefined}
              onSelect={(i) => setSelected({ tab: 2, item: i })}
            />
          )}
          {!loading && activeTab === 3 && (
            <List
              items={searchResult.shows.map((v) => (
                <span>📻 {v.name}</span>
              ))}
              selected={selected?.tab === 3 ? selected.item : undefined}
              onSelect={(i) => setSelected({ tab: 3, item: i })}
            />
          )}
          {!loading && activeTab === 4 && (
            <List
              items={searchResult.episodes.map((v) => (
                <span>📺 {v.name}</span>
              ))}
              selected={selected?.tab === 4 ? selected.item : undefined}
              onSelect={(i) => setSelected({ tab: 4, item: i })}
            />
          )}
          {!loading && activeTab === 5 && (
            <List
              items={searchResult.playlists.map((v) => (
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
