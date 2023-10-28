import { isNil } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Frame,
  GroupBox,
  Hourglass,
  ScrollView,
  Toolbar,
} from 'react95';
import { FlexColumn, FlexRow } from 'renderer/sdk/FlexElements';
import { FlexWindowModal } from 'renderer/sdk/FlexWindowModal';
import Label from 'renderer/sdk/Label';
import { List } from 'renderer/sdk/List';
import {
  selectArtistPage,
  selectSpotify,
  setAddDialog,
  setArtistPage,
  setErrorMessage,
} from 'renderer/state/store';

export function ArtistPage() {
  const dispatch = useDispatch();
  const artistArray = useSelector(selectArtistPage) ?? [];
  const currentArtist = artistArray[artistArray.length - 1]
  const spotify = useSelector(selectSpotify);
  const [artist, setArtist] = useState<SpotifyApi.SingleArtistResponse | null>(
    null
  );
  const [albums, setAlbums] = useState<SpotifyApi.AlbumObjectSimplified[]>([]);
  const [relatedArists, setRelatedArtists] = useState<SpotifyApi.ArtistObjectFull[]>([])
  const getAllAlbums = useCallback(
    async (id: string) => {
      let flag = false;
      let count = 0;
      while (!flag) {
        const next = await spotify.getArtistAlbums(id, {
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
    setArtist(null);
    setAlbums([]);
    setPlaylists([]);
    if (!isNil(currentArtist)) {
      spotify.getArtist(currentArtist).then((a) => {
        setArtist(a);
        getAllAlbums(a.id);
        spotify.search(a.name, ['playlist']).then((ret) => {
          setPlaylists(ret.playlists?.items ?? []);
        });
        spotify.getArtistRelatedArtists(currentArtist).then((ret) => {
          setRelatedArtists(ret.artists)
        })
      });
    }
  }, [currentArtist]);

  const getFunctionForFindPlaylist = (formatted:string) => {
    const failure = () =>  dispatch(setErrorMessage("There doesn't seem to be a playlist matching name '" + formatted + "'."))
    return async () => {
      const searchResult = await spotify.searchPlaylists(
        formatted
      );
      if (searchResult.playlists.items.length > 0) {
        const possibleResult = searchResult.playlists.items[0];
        if (possibleResult.name === formatted) {
        dispatch(
          setAddDialog({
            type: 'playlist',
            id: possibleResult.id,
            label: possibleResult.name,
          }))
        }
         else failure()
      } else failure()
    }
  }
  return (
    <FlexWindowModal
      title={!isNil(artist) ? artist.name : 'Please Wait...'}
      height={800}
      width={800}
      isOpen={artistArray.length > 0}
      onClose={() => dispatch(setArtistPage(undefined))}
      onBack={artistArray.length > 1 ? () => dispatch(setArtistPage(artistArray.slice(0,artistArray.length - 1))) : undefined}
      provideCloseButton
    >
      {isNil(artist) ? (
        <Hourglass
          style={{ position: 'absolute', top: '50%', right: '50%' }}
          size={32}
        />
      ) : (
        <FlexColumn style={{ height: '100%' }}>
          <FlexRow style={{height:365}}>
            <img
              style={{ height: 365, width: 365 }}
              src={artist.images[0].url}
            />
            <Frame style={{ width: '100%', height: '100%', }}>
              <FlexColumn>
                <Label style={{ marginLeft: '.5rem', marginRight:".5rem" }}>
                  {`${artist.followers.total} Followers`}
                </Label>
                <Label style={{ marginLeft: '.5rem', marginRight:".5rem" }}>
                  {`${artist.popularity} / 100 popularity`}
                </Label>
                <Button
                  onClick={() =>
                    dispatch(
                      setAddDialog({
                        type: 'topSongs',
                        id: artist.id,
                        label: artist.name,
                      })
                    )
                  }
                >
                  Top Songs
                </Button>
                <Button
                  onClick={getFunctionForFindPlaylist("This Is " + artist.name)}
                >
                  This is {artist.name}
                </Button>
                <Button onClick={getFunctionForFindPlaylist(artist.name + " Radio")}>{artist.name} Radio</Button>
                <Label>Related Artists</Label>
                <ScrollView style={{                  height: 175,
                  width: '100%',                  
                  padding: '.5rem'}}>{relatedArists.map((ra) => <div><a onClick={() => dispatch(setArtistPage([...artistArray, ra.id]))}>{ra.name}</a></div>)}</ScrollView>
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
                />
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
}
