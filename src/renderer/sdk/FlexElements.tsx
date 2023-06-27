import { ReactNode, CSSProperties } from 'react';

export const FlexColumn = (props: {
  children: ReactNode;
  style?: CSSProperties;
}) => {
  const { children, style } = props;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', ...style }}>
      {children}
    </div>
  );
};

export const FlexRow = (props: {
  children: ReactNode;
  style?: CSSProperties;
}) => {
  const { children, style } = props;
  return (
    <div style={{ display: 'flex', flexDirection: 'row', ...style }}>
      {children}
    </div>
  );
};
