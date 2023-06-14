type IProps = {
  children: string;
};

export default function Label(props: IProps) {
  return (
    <span style={{ fontWeight: 'bold', marginRight: '1rem' }}>
      {props.children}
    </span>
  );
}
