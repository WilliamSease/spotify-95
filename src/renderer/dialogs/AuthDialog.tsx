import { isNil } from 'lodash';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Anchor, Button } from 'react95';
import { FlexWindowModal } from 'renderer/conveniencesdk/FlexWindowModal';
import { addBearerTokenToRequest } from 'renderer/functions/apiFunctions';
import { TokenInfo } from 'renderer/representations/apiTypes';
import { selectSpotify } from 'renderer/state/store';

type IProps = {
  isOpen: boolean;
  closeThisWindow: () => void;
  tokenInfo?: TokenInfo;
  triggerLogin?: () => void;
};

export const AuthDialog = (props: IProps) => {
  const { isOpen, closeThisWindow, tokenInfo, triggerLogin } = props;
  const spotify = useSelector(selectSpotify);
  const [thisUser, setThisUser] =
    useState<SpotifyApi.CurrentUsersProfileResponse>();

  useEffect(() => {
    if (isOpen) {
      spotify
        .getMe()
        .then((me) => setThisUser(me))
        .catch(() => setThisUser(undefined));
    }
  }, [spotify, isOpen, tokenInfo]);

  return (
    <FlexWindowModal
      title={'Auth'}
      height={400}
      width={500}
      isOpen={isOpen}
      onClose={closeThisWindow}
      provideCloseButton
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isNil(thisUser) ? (
          <div>❌ You are NOT logged in.</div>
        ) : (
          <div>
            <div>{`✔️ You are logged in as ${thisUser.display_name}`}</div>
            {tokenInfo && (
              <div>{`Your token's lease expires in ${Math.floor(
                (tokenInfo.expirationTime - Date.now()) / (1000 * 60)
              )} minutes.`}</div>
            )}
            <div>It should refresh at the 30 minute mark.</div>
          </div>
        )}
        <Button onClick={triggerLogin}>Grab new Token</Button>
        <div style={{ marginTop: '.3rem' }}>
          To log out, click this button and revoke access to "95":
        </div>
        <Button
          onClick={() => {
            window.electron.ipcRenderer.sendMessage('logoutofspotify');
          }}
        >
          Log Out
        </Button>
      </div>
    </FlexWindowModal>
  );
};
