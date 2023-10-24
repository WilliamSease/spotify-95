import { Button, Toolbar, Window, WindowHeader } from 'react95';
import { ReactNode } from 'react';
import { Modal } from 'renderer/sdk/Modal';
import Label from 'renderer/sdk/Label';

export type BottomButton = {
  text: string;
  onPress: () => void;
  closesWindow?: boolean;
  disabled?: boolean;
};

type IProps = {
  title: string;
  height: number;
  width: number;
  isOpen: boolean;
  onClose: () => void;
  provideCloseButton?: boolean;
  children?: ReactNode;
  endLabel?: string;
  bottomButtons?: BottomButton[];
  screenSaverBackground?: boolean;
};

export const FlexWindowModal = (props: IProps) => {
  const {
    title,
    isOpen,
    height,
    width,
    onClose,
    provideCloseButton,
    children,
    endLabel,
    bottomButtons,
    screenSaverBackground,
  } = props;
  return (
    <Modal isOpen={isOpen} screenSaverBackground={screenSaverBackground}>
      {isOpen && (
        <Window
          style={{
            width: width,
            height: height,
            display: 'flex',
            flexDirection: 'column',
          }}
          shadow
        >
          <WindowHeader title={title} className="window-title dragApplication">
            <span style={{ flexGrow: 1 }}>{title}</span>
            {provideCloseButton && (
              <Button
                className="toolbarButton clickableUnderDraggable"
                onClick={onClose}
              >
                ✕
              </Button>
            )}
          </WindowHeader>
          {children}
          <Toolbar
            style={{ flexGrow: 1, alignItems: 'end', justifyContent: 'end' }}
          >
            {endLabel && <Label>{endLabel}</Label>}
            {bottomButtons?.map((bb, i) => {
              return (
                <Button
                  key={i}
                  style={{ marginLeft: '.25rem' }}
                  onClick={() => {
                    bb.onPress();
                    if (bb.closesWindow) {
                      onClose();
                    }
                  }}
                  disabled={bb.disabled}
                >
                  {bb.text}
                </Button>
              );
            })}
          </Toolbar>
        </Window>
      )}
    </Modal>
  );
};
