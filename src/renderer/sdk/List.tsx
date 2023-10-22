import { isFunction } from 'lodash';
import { ReactElement } from 'react';
import styled, { css } from 'styled-components';

type IProps = {
  items?: ReactElement[];
  selected?: number;
  onSelect?: (i: number) => void;
};

type selectedProps = { isSelected: boolean };
export const StyledDiv = styled.div<selectedProps>`
  ${({ isSelected, theme }) =>
    css`
      color: ${isSelected ? theme.materialTextInvert : 'unset'};
      background: ${isSelected ? theme.materialText : 'unset'};
      margin-top: 0.2rem;
    `}
`;

export const List = (props: IProps) => {
  const { items, selected, onSelect } = props;

  return (
    <div style={{ height: '100%' }}>
      {items?.map((i, idx) => {
        return (
          <StyledDiv
            isSelected={idx === selected}
            onClick={() => {
              if (isFunction(onSelect)) {
                onSelect(idx);
              }
            }}
          >
            {i}
          </StyledDiv>
        );
      })}
    </div>
  );
};
