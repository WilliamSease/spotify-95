import { ReactNode, useState } from 'react';

type IProps = {
  children?: ReactNode;
};

export const WindowShade = (props: IProps) => {
  const { children } = props;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: isOpen ? undefined : '1.5rem',
        margin: '.5rem',
        overflow: 'hidden',
      }}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{ width: '3rem', marginRight: '.5rem' }}
      >
        {isOpen ? '⬇️' : '➡️'}
      </div>
      <div style={{}}>{children}</div>
    </div>
  );
};
