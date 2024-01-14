import { CSSProperties } from 'react';

type IProps = {
  children: string;
  htmlFor?: string;
  style?: CSSProperties;
};

export default function Label(props: IProps) {
  const { children, style, htmlFor } = props;
  return (
    <label
      htmlFor={htmlFor}
      style={{ fontWeight: 'bold', marginRight: '1rem', ...style }}
    >
      {children}
    </label>
  );
}
