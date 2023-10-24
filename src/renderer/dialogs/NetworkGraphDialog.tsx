import { useCallback, useMemo } from 'react';
import { FlexRow } from 'renderer/sdk/FlexElements';
import { FlexWindowModal } from 'renderer/sdk/FlexWindowModal';

type IProps = {
  isOpen: boolean;
  closeThisWindow: () => void;
  delays: number[];
};

export const NetworkGraphDialog = (props: IProps) => {
  const { isOpen, closeThisWindow, delays } = props;
  const catDelay = useCallback((val: number) => {
    if (val < 300) return 'Good!';
    if (val < 1000) return 'Slow';
    return 'Bad';
  }, []);
  const catColor = useCallback((val: number) => {
    if (val < 300) return 'green';
    if (val < 1000) return 'yellow';
    return 'red';
  }, []);
  const placeHolder = useMemo(
    () =>
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
        .slice(delays.length)
        .map((i) => {
          return (
            <FlexRow style={{ marginLeft: '.5rem' }} key={i}>
              <div style={{ width: '100%' }}>--</div>
            </FlexRow>
          );
        }),
    [delays.length]
  );

  return (
    <FlexWindowModal
      title={'Network Graph'}
      height={700}
      width={500}
      isOpen={isOpen}
      onClose={closeThisWindow}
      provideCloseButton
    >
      {placeHolder}
      {delays.map((delay, i) => (
        <FlexRow style={{ marginLeft: '.5rem' }}>
          <div key={i} style={{ width: '15%' }}>
            {delay}ms
          </div>
          <div key={i} style={{ width: '85%' }}>
            <div
              style={{
                width: `${delay / 10}%`,
                backgroundColor: catColor(delay),
              }}
            >
              {catDelay(delay)}
            </div>
          </div>
        </FlexRow>
      ))}
      <hr />
      <div style={{ marginLeft: '.5rem' }}>
        If most of these responses are GOOD or SLOW Spotify95 should work fine.
        If many calls are BAD you might see odd behavior stemming from desyncs
        between this client and Spotify. These calls are only a couple
        kilobytes, it shouldn't strain your internet.
      </div>
    </FlexWindowModal>
  );
};
