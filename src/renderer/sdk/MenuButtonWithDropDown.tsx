import { useState } from 'react';
import { Button, MenuList, MenuListItem } from 'react95';

type IProps = {
  buttonText: string;
  menuOptions: {
    text: string;
    onClick: () => void;
  }[];
};

export default function MenuButtonWithDropDown(props: IProps) {
  const { buttonText, menuOptions } = props;

  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Button variant="thin" onClick={() => setOpen(!open)} active={open}>
        Start
      </Button>
      {open && (
        <MenuList
          style={{
            position: 'absolute',
            left: '0',
            top: '100%',
            zIndex: 1,
          }}
          onClick={() => setOpen(false)}
        >
          {menuOptions.map((mo, i) => {
            return (
              <MenuListItem key={i}>
                <Button onClick={mo.onClick} variant="thin">
                  <span>{mo.text}</span>
                </Button>
              </MenuListItem>
            );
          })}
        </MenuList>
      )}
    </div>
  );
}
