import { css } from "styled-components";
import { baseTheme } from './theme';

export const helperStyles = css`
  .hide {
    display: none;
  }

  .clickable {
    cursor: pointer;
  }

  .bold {
    font-weight: 700;
  }
`;

export const respondAfter = (size: 'xs' | 'sm' | 'md' | 'lg') => {
    return (...args: [ TemplateStringsArray ]) => css`
      @media only screen and (min-width: ${baseTheme.breakpoints[size]}px) {
        ${css(...args)};
      }
    `;
};

export const respondTo = (size: 'xs' | 'sm' | 'md' | 'lg') => {
    return (...args: [ TemplateStringsArray ]) => css`
      @media only screen and (max-width: ${+baseTheme.breakpoints[size] - 1}px) {
        ${css(...args)};
      }
    `;
};
