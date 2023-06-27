import styled, { css } from 'styled-components';

export const AlternateGrey = styled.div<{
  index: number;
  isSelected?: boolean;
}>`
  ${({ index, isSelected, theme }) =>
    css`
      background: ${isSelected
        ? theme.borderDark
        : index % 2 === 0
        ? theme.borderLight
        : 'unset'};
      color: ${isSelected ? theme.materialTextInvert : theme.materialText};
      margin-top: 0.2rem;
    `}
`;
