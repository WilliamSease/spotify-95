import { isNil } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { Frame } from 'react95';
import { FlexWindowModal } from 'renderer/sdk/FlexWindowModal';
import { selectArtURL, setArtURL } from 'renderer/state/store';

export const ArtDialog = () => {
  const dispatch = useDispatch();
  const artURL = useSelector(selectArtURL);
  return (
    <FlexWindowModal
      title={'Artwork'}
      height={390}
      width={350}
      isOpen={!isNil(artURL)}
      onClose={() => {
        dispatch(setArtURL(undefined));
      }}
      provideCloseButton
    >
      <img style={{ margin: 10 }} src={artURL} />
    </FlexWindowModal>
  );
};
