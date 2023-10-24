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
      <Button
        variant="thin"
        onClick={() => setOpen(!open)}
        onMouseLeave={() => setOpen(false)}
        active={open}
      >
        {buttonText}
      </Button>
      {open && (
        <MenuList
          style={{
            position: 'absolute',
            left: '0',
            top: '100%',
            zIndex: 2,
          }}
          onClick={() => setOpen(false)}
          onMouseLeave={() => setOpen(false)}
          onMouseEnter={() => setOpen(true)}
        >
          {menuOptions.map((mo, i) => {
            return (
              <MenuListItem key={i} onClick={mo.onClick}>
                <span>{mo.text}</span>
              </MenuListItem>
            );
          })}
        </MenuList>
      )}
    </div>
  );
}
