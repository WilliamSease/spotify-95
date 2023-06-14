import { Button, GroupBox, Select, Window, WindowHeader } from 'react95';
import { Modal } from './sdk/Modal';
import * as Themes from 'react95/dist/themes';
import { Theme } from 'react95/dist/types';
import { useDispatch, useSelector } from 'react-redux';
import { selectTheme, setTheme } from './state/store';
import Label from './sdk/Label';

const ThemesArray = Object.entries(Themes.default);
console.info(ThemesArray);

type IProps = {
  isOpen: boolean;
  closeThisWindow: () => void;
};

export const SettingsWindow = (props: IProps) => {
  const { isOpen, closeThisWindow } = props;
  const dispatch = useDispatch();
  const currentTheme = useSelector(selectTheme);

  return (
    <Modal isOpen={isOpen}>
      <Window style={{ width: 500, height: 600 }}>
        <WindowHeader title="Settings" className="window-title">
          <span style={{ flexGrow: 1 }}>Settings</span>
          <Button
            className="dialogButton clickableUnderDraggable"
            onClick={closeThisWindow}
          >
            ✕
          </Button>
        </WindowHeader>
        <GroupBox
          label="visual"
          style={{ marginTop: '1rem', marginLeft: '1rem', marginRight: '1rem' }}
        >
          <Label>Theme:</Label>
          <Select
            defaultValue={ThemesArray.map((t) => t[0]).indexOf(
              currentTheme.name
            )}
            options={ThemesArray.map((v: [string, Theme], i) => {
              return { value: i, label: v[0] };
            })}
            menuMaxHeight={160}
            width={160}
            onChange={(e) => {
              dispatch(setTheme(ThemesArray[e.value][1]));
            }}
          />
        </GroupBox>
      </Window>
    </Modal>
  );
};
