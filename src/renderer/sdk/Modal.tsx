import { ReactNode } from 'react';

type IProps = {
  children: ReactNode;
  isOpen: boolean;
};

export const Modal = (props: IProps) => {
  const { children, isOpen } = props;
  return isOpen ? (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'fixed',
        zIndex: 2,
        backgroundColor: 'rgba(255,255,255,0.5)',
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
      }}
    >
      {children}
    </div>
  ) : (
    <></>
  );
};
