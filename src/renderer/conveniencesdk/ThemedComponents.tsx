import styled, { css } from 'styled-components';

export const AlternateGrey = styled.div<{ index: number }>`
  ${({ index, theme }) =>
    css`
      background: ${index % 2 === 0 ? theme.borderLightest : 'unset'};
      margin-top: 0.2rem;
    `}
`;
