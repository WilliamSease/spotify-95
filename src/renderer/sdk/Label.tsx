import { CSSProperties } from 'react';

type IProps = {
  children: string;
  style?: CSSProperties;
};

export default function Label(props: IProps) {
  const { children, style } = props;
  return (
    <span style={{ fontWeight: 'bold', marginRight: '1rem', ...style }}>
      {children}
    </span>
  );
}
