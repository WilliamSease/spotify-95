import { isNil } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Frame, GroupBox, Hourglass, ScrollView } from 'react95';
import { FlexColumn, FlexRow } from 'renderer/sdk/FlexElements';
import { FlexWindowModal } from 'renderer/sdk/FlexWindowModal';
import Label from 'renderer/sdk/Label';
import { List } from 'renderer/sdk/List';
import {
  selectArtistPage,
  selectSpotify,
  setAddDialog,
  setArtistPage,
} from 'renderer/state/store';

export const ArtistPage = () => {
  const dispatch = useDispatch();
  const currentArtist = useSelector(selectArtistPage);
  const spotify = useSelector(selectSpotify);
  const [artist, setArtist] = useState<SpotifyApi.SingleArtistResponse | null>(
    null
  );
  const [albums, setAlbums] = useState<SpotifyApi.AlbumObjectSimplified[]>([]);
  const getAllAlbums = useCallback(
    async (id: string) => {
      let flag = false;
      let count = 0;
      while (!flag) {
        let next = await spotify.getArtistAlbums(id, {
          offset: count,
          limit: 20,
        });
        count += 20;
        if (isNil(next.next)) flag = true;
        setAlbums((prev) => {
          return prev.concat(next.items);
        });
      }
    },
    [setAlbums, spotify]
  );
  const [playlists, setPlaylists] = useState<
    SpotifyApi.PlaylistObjectSimplified[]
  >([]);
  useEffect(() => {
    if (!isNil(currentArtist)) {
      spotify.getArtist(currentArtist).then((a) => {
        setArtist(a);
        getAllAlbums(a.id);
        spotify.search(a.name, ['playlist']).then((ret) => {
          setPlaylists(ret.playlists?.items ?? []);
        });
      });
    } else {
      setArtist(null);
      setAlbums([]);
      setPlaylists([]);
    }
  }, [currentArtist]);
  return (
    <FlexWindowModal
      title={!isNil(artist) ? artist.name : 'Please Wait...'}
      height={800}
      width={800}
      isOpen={!isNil(currentArtist)}
      onClose={() => dispatch(setArtistPage(undefined))}
      provideCloseButton
    >
      {isNil(artist) ? (
        <Hourglass
          style={{ position: 'absolute', top: '50%', right: '50%' }}
          size={32}
        />
      ) : (
        <FlexColumn style={{ height: '100%' }}>
          <FlexRow>
            <img
              style={{ height: 365, width: 365 }}
              src={artist.images[0].url}
            />
            <Frame style={{ width: '100%', height: '100%' }}>
              <FlexColumn>
                <Label style={{ margin: '.5rem' }}>
                  {`${artist.followers.total} Followers`}
                </Label>
                <Label style={{ margin: '.5rem' }}>
                  {`${artist.popularity} / 100 popularity`}
                </Label>
                <Label style={{ margin: '.5rem' }}>{`${artist.genres.join(
                  ', '
                )}`}</Label>
              </FlexColumn>
            </Frame>
          </FlexRow>
          <FlexRow style={{ flexGrow: 1 }}>
            <Frame style={{ width: '50%', height: '100%' }} variant="field">
              <ScrollView
                style={{
                  height: '100%',
                  width: '100%',
                  position: 'absolute',
                  padding: '.5rem',
                }}
              >
                <List
                  items={albums.map((v) => (
                    <span>💿 {v.name}</span>
                  ))}
                  onSelect={(i) =>
                    dispatch(
                      setAddDialog({
                        type: 'album',
                        id: albums[i].id,
                        label: albums[i].name,
                      })
                    )
                  }
                />{' '}
              </ScrollView>
            </Frame>
            <Frame style={{ width: '50%', height: '100%' }} variant="field">
              <ScrollView
                style={{
                  height: '100%',
                  width: '100%',
                  position: 'absolute',
                  padding: '.5rem',
                }}
              >
                <List
                  items={playlists.map((v) => (
                    <span>📝 {v.name}</span>
                  ))}
                  onSelect={(i) =>
                    dispatch(
                      setAddDialog({
                        type: 'playlist',
                        id: playlists[i].id,
                        label: playlists[i].name,
                      })
                    )
                  }
                />
              </ScrollView>
            </Frame>
          </FlexRow>
        </FlexColumn>
      )}
    </FlexWindowModal>
  );
};
