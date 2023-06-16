import { GroupBox, Select } from 'react95';
import * as Themes from 'react95/dist/themes';
import { Theme } from 'react95/dist/types';
import { useDispatch, useSelector } from 'react-redux';
import { selectTheme, setTheme } from '../state/store';
import Label from '../sdk/Label';
import { FlexWindowModal } from '../conveniencesdk/FlexWindowModal';
import { useEffect, useState } from 'react';

const ThemesArray = Object.entries(Themes.default);

type IProps = {
  isOpen: boolean;
  closeThisWindow: () => void;
};

export const SettingsDialog = (props: IProps) => {
  const { isOpen, closeThisWindow } = props;
  const dispatch = useDispatch();
  const currentTheme = useSelector(selectTheme);

  const [themeMemory, setThemeMemory] = useState<Theme>();

  useEffect(() => {
    if (isOpen) {
      setThemeMemory(currentTheme);
    } else {
      setThemeMemory(undefined);
    }
  }, [isOpen, setThemeMemory]);

  return (
    <FlexWindowModal
      title="Settings"
      isOpen={isOpen}
      onClose={closeThisWindow}
      height={600}
      width={500}
      bottomButtons={[
        { text: 'save', onPress: () => {}, closesWindow: true },
        {
          text: 'cancel',
          onPress: () => {
            dispatch(setTheme(themeMemory));
          },
          closesWindow: true,
        },
      ]}
    >
      <GroupBox
        label="visual"
        style={{ marginTop: '1rem', marginLeft: '1rem', marginRight: '1rem' }}
      >
        <Label>Theme:</Label>
        <Select
          defaultValue={ThemesArray.map((t) => t[0]).indexOf(currentTheme.name)}
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
    </FlexWindowModal>
  );
};
