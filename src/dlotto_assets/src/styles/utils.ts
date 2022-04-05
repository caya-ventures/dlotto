import { css } from 'styled-components'
import { baseTheme } from "./theme";

export const mainWideWrapper = css`
  max-width: ${baseTheme.sizes.maxWidth}px;
  width: 100%;
  margin: 0 auto;
`;

export const mainContentWrapper = css`
  max-width: ${baseTheme.sizes.maxContentWidth}px;
  width: 100%;
  margin: 0 auto;
`;

export const mainBlockTitle = css`
  font-weight: 700;
  font-size: 1.75rem;
  line-height: 2.75rem;
`;
