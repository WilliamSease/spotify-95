import { Button, Toolbar, Window, WindowHeader } from 'react95';
import { ReactNode } from 'react';
import { Modal } from 'renderer/sdk/Modal';

type BottomButton = {
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
  bottomButtons?: BottomButton[];
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
    bottomButtons,
  } = props;
  return (
    <Modal isOpen={isOpen}>
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
          <WindowHeader title={title} className="window-title">
            <span style={{ flexGrow: 1 }}>{title}</span>
            {provideCloseButton && (
              <Button
                className="dialogButton clickableUnderDraggable"
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
